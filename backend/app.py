import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import yfinance as yf
from datetime import datetime, UTC, timedelta
from decimal import Decimal
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{os.getenv("DBUSER")}:{os.getenv("DBPASS")}@{os.getenv("DBHOST")}/{os.getenv("DBNAME")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import models after db is initialized to avoid circular imports
from models import Wallets, Transactions, StockHoldings


# Route to handle stock transactions (buy/sell)
@app.route('/api/stock/<action>', methods=['POST'])
def handle_stock_transaction(action):
    data = request.json
    user_id = 1 # Dummy user id
    ticker = data.get('ticker')
    quantity = int(data.get('quantity', 0))
    price = Decimal(str(data.get('price')))

    # Validate input
    if action not in ['buy', 'sell']:
        return jsonify({'success': False, 'message': 'Invalid action'}), 400
    if not ticker or quantity <= 0:
        return jsonify({'success': False, 'message': 'Invalid ticker or shares'}), 400
    
    # Get user's wallet
    wallet = Wallets.query.filter_by(user_id=user_id).first()
    if not wallet:
        return jsonify({'success': False, 'message': 'Wallet not found'}), 404

    # Calculate total price of shares
    total_price = price * Decimal(quantity)

    # Buy
    if action == 'buy':
        
        # Check if user has enough funds
        if wallet.balance < total_price:
            return jsonify({'success': False, 'message': 'Insufficient funds'}), 400
        
        # Get user's shares
        stock_holding = StockHoldings.query.filter_by(user_id=user_id, ticker=ticker).first()

        # If user doesn't have any shares, create a new record
        if not stock_holding:
            stock_holding = StockHoldings(user_id=user_id, ticker=ticker, quantity=0)
            db.session.add(stock_holding)

        # Update user's number of shares
        stock_holding.quantity += quantity

        # Update user's wallet balance
        wallet.balance -= total_price

    # Sell
    else:
        # Get user's shares
        stock_holding = StockHoldings.query.filter_by(user_id=user_id, ticker=ticker).first()
        
        # Check if user has enough shares
        if stock_holding and stock_holding.quantity >= quantity:
            
            # Update user's number of shares
            stock_holding.quantity -= quantity

            # Update user's wallet balance
            wallet.balance += total_price

            # Delete user's shares if quantity is 0
            if stock_holding.quantity == 0:
                db.session.delete(stock_holding)

        else:
            return jsonify({'success': False, 'message': 'Insufficient shares'}), 400  

    # Create transaction record
    transaction = Transactions(
        user_id=user_id,
        ticker=ticker,
        quantity=quantity,
        price_per_share=price,
        total_price=total_price,
        transaction_type=action.upper()
    )
    db.session.add(transaction)
    wallet.updated_at = datetime.now(UTC)
    
    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'message': f'Successfully {'bought' if action == 'buy' else 'sold'} {quantity} shares of {ticker}',
            'new_balance': str(wallet.balance),
            'shares': stock_holding.quantity
        }), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'success': False, 'message': "Failed to " + action + " " + ticker + ". Please try again later."}), 500


# Route to get a stock's info
@app.route('/api/stock/<ticker>', methods=['GET'])
def get_stock_info(ticker):
    stock = yf.Ticker(ticker)

    # Get current price of stock
    price = stock.info['currentPrice']

    # Get historical data for the past 30 days
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    history = stock.history(start=start_date, end=end_date)

    # Prepare historical data for frontend
    historical_data = []
    for date, row in history.iterrows():
        historical_data.append({
            'date': date.strftime('%Y-%m-%d'),
            'price': row['Close']
        })

    return jsonify({
        'success': True,
        'ticker': ticker,
        'price': price,
        'historicalData': historical_data
    })


# Route to get all stocks information a user has
@app.route('/api/user-stocks', methods=['GET'])
def get_user_stocks():
    user_id = 1  # Dummy user id

    # Get user's stocks
    stock_holdings = StockHoldings.query.filter_by(user_id=user_id).all()
    
    # If user doesn't have any stocks, return an empty list
    if not stock_holdings:
        return jsonify({'success': True, 'stockHoldings': [], 'totalPortfolioValue': '0'}), 200

    # Prepare stock holdings with data
    stock_holdings_with_data = []
    total_portfolio_value = Decimal('0')

    for holding in stock_holdings:
        stock_dict = holding.to_dict()
        
        try:
            # Fetch stock data using yfinance
            ticker = yf.Ticker(stock_dict['ticker'])
            
            # Get current price
            current_price = Decimal(str(ticker.info['currentPrice']))
            
            # Calculate total value
            total_value = current_price * Decimal(stock_dict['quantity'])
            
            # Get historical data for the past 30 days
            end_date = datetime.now()
            start_date = end_date - timedelta(days=30)
            history = ticker.history(start=start_date, end=end_date)

            # Prepare historical data
            historical_data = []
            for date, row in history.iterrows():
                historical_data.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'price': row['Close']
                })
            
            # Add price, value, and historical information to the stock dictionary
            stock_dict['currentPrice'] = str(current_price)
            stock_dict['totalValue'] = str(total_value)
            stock_dict['historicalData'] = historical_data
            
            # Add to total portfolio value
            total_portfolio_value += total_value
        except Exception as e:
            print(f"Error fetching data for {stock_dict['ticker']}: {str(e)}")
            stock_dict['currentPrice'] = "N/A"
            stock_dict['totalValue'] = "N/A"
            stock_dict['historicalData'] = []
        
        stock_holdings_with_data.append(stock_dict)

    return jsonify({
        'success': True,
        'stockHoldings': stock_holdings_with_data,
        'totalPortfolioValue': str(total_portfolio_value)
    })


# Route to get the number of shares a user has of a stock   
@app.route('/api/user-shares/<ticker>', methods=['GET'])
def get_user_shares(ticker):
    user_id = 1 # Dummy user id

    # Get user's total shares for given ticker
    stock_holding = StockHoldings.query.filter_by(user_id=user_id, ticker=ticker).first()

    # If user doesn't have any shares, return 0
    if not stock_holding:
        return jsonify({'success': True, 'shares': 0}), 200
    
    # Return user's total shares for given ticker
    shares = stock_holding.quantity
    return jsonify({
        'success': True,
        'shares': shares
    })


# Route to get a user's wallet balance
@app.route('/api/wallet', methods=['GET'])
def get_wallet():
    user_id = 1 # Dummy user id

    # Get user's wallet
    wallet = Wallets.query.filter_by(user_id=user_id).first()

    # If wallet doesn't exist, create it
    if not wallet:
        return jsonify({'success': False, 'walletBalance': 0})
    
    # Return user's wallet balance
    return jsonify({'success': True, 'walletBalance': wallet.balance})


# Route to deposit funds into a user's wallet
@app.route('/api/wallet/deposit', methods=['POST'])
def deposit_funds():
    data = request.json
    user_id = 1 # Dummy user id
    deposit_amount = data.get('deposit_amount')
    
    # Validate input
    if deposit_amount is None:
        return jsonify({'success': False, 'message': 'Invalid deposit_amount'}), 400

    try:
        # Convert deposit_amount to Decimal
        deposit_amount = Decimal(str(deposit_amount))
        
        # Check if deposit_amount has more than 2 decimal places
        if deposit_amount.as_tuple().exponent < -2:
            return jsonify({'success': False, 'message': 'Deposit amount cannot have more than 2 decimal places'}), 400
        
        # Get user's wallet
        wallet = Wallets.query.filter_by(user_id=user_id).first()

        # If wallet doesn't exist, create it
        if not wallet:
            wallet = Wallets(user_id=user_id, balance=Decimal('0'))
            db.session.add(wallet)

        # Update wallet balance
        wallet.balance += deposit_amount
        wallet.updated_at = datetime.now(UTC)
        db.session.commit()

        return jsonify({'success': True, 'walletBalance': str(wallet.balance)})
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'success': False, 'message': "Failed to deposit funds. Please try again later."}), 500



if __name__ == '__main__':
    app.run()