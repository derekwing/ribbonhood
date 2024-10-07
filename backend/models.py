from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Numeric

from app import db

# Define User model
class Users(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now)


# Define Wallet model
class Wallets(db.Model):
    __tablename__ = 'wallets'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    balance = Column(Numeric(15, 2), nullable=False, default=0)
    updated_at = Column(DateTime, nullable=False, default=datetime.now)

# Define Transactions model
class Transactions(db.Model):
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    ticker = Column(String(10), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_per_share = Column(Numeric(15, 2), nullable=False)
    total_price = Column(Numeric(15, 2), nullable=False)
    transaction_type = Column(String(4), nullable=False)  # 'buy' or 'sell'
    created_at = Column(DateTime, nullable=False, default=datetime.now)

# Define StockHoldings model
class StockHoldings(db.Model):
    __tablename__ = 'stockholdings'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    ticker = Column(String(10), nullable=False)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now)

    def to_dict(self):
        return {  
            'ticker': self.ticker,
            'quantity': self.quantity
        }