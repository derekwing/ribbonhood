import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv
load_dotenv()

# Database configuration (Make sure the user has the privilege to create a database)
db_name = os.getenv("DBNAME")
db_user = os.getenv("DBUSER")
db_pass = os.getenv("DBPASS")
db_host = os.getenv("DBHOST")

# Connect to the default 'postgres' database
conn = psycopg2.connect(dbname="postgres", user=db_user, password=db_pass, host=db_host)
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

cur = conn.cursor()

# Drop the database if it already exists
cur.execute(f"DROP DATABASE IF EXISTS {db_name}")

# Create the new database
cur.execute(f"CREATE DATABASE {db_name}")

# Close the cursor and connection
cur.close()
conn.close()

# Connect to the new database
conn = psycopg2.connect(dbname=db_name, user=db_user, password=db_pass, host=db_host)
cur = conn.cursor()

# Create tables
cur.execute("""
CREATE TABLE Users (
    Id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cur.execute("""
CREATE TABLE Wallets (
    Id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(Id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cur.execute("""
CREATE TABLE StockHoldings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(Id) ON DELETE CASCADE,
    ticker VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cur.execute("""
CREATE TABLE Transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(Id) ON DELETE CASCADE,
    ticker VARCHAR(10) NOT NULL,
    transaction_type VARCHAR(4) CHECK (Transaction_type IN ('BUY', 'SELL')),
    quantity INTEGER NOT NULL,
    price_per_share DECIMAL(15, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# Create a dummy user
cur.execute("""
INSERT INTO Users (first_name, last_name) VALUES ('John', 'Doe')
""")

# Create a dummy wallet
cur.execute("""
INSERT INTO Wallets (user_id, balance) VALUES (1, 10000.00)
""")

# Add dummy shares
cur.execute("""
INSERT INTO StockHoldings (user_id, ticker, quantity) VALUES (1, 'AAPL', 15)
""")
cur.execute("""
INSERT INTO StockHoldings (user_id, ticker, quantity) VALUES (1, 'GOOGL', 18)
""")
cur.execute("""
INSERT INTO StockHoldings (user_id, ticker, quantity) VALUES (1, 'MSFT', 23)
""")


# Commit the changes
conn.commit()

# Close the cursor and the connection
cur.close()
conn.close()

print("Database and Tables created successfully.")