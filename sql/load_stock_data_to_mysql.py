"""
This file reads the .json files in the stock_history folder and appends the data to the stock_data and stock tables in the stock database.
There is handling for duplicate data, disallowing duplicated data from being appended to the tables.
"""

import json
import pymysql
import os

# Function to insert stock data
def insert_stock_data(cursor, symbol, date, open_price, high, low, close, volume):
    # Check if entry already exists
    cursor.execute("SELECT id FROM Stock_Data WHERE symbol = %s AND date = %s", (symbol, date))
    if cursor.fetchone() is None:
        cursor.execute("INSERT INTO Stock_Data (symbol, date, open, high, low, close, volume) VALUES (%s, %s, %s, %s, %s, %s, %s)", 
                       (symbol, date, open_price, high, low, close, volume))

# Function to process a JSON file
def process_json_file(cursor, file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)

    # Inserting data into stocks table
    symbol = data['Meta Data']['2. Symbol']
    name = "Unknown"  # Placeholder, update as needed
    cursor.execute("INSERT IGNORE INTO Stocks (symbol, name) VALUES (%s, %s)", (symbol, name))

    # Inserting data into stock_data table
    for date, daily_data in data['Time Series (Daily)'].items():
        open_price = daily_data['1. open']
        high = daily_data['2. high']
        low = daily_data['3. low']
        close = daily_data['4. close']
        volume = daily_data['5. volume']
        insert_stock_data(cursor, symbol, date, open_price, high, low, close, volume)

# Database connection parameters (will need to change for your local environment)
host = "your-host"
user = "your-user"
password = "your-password"
db = "StockDatabase"

# Database connection
connection = pymysql.connect(host=host, user=user, password=password, db=db)
cursor = connection.cursor()

# Path to .json files
json_directory_path = ".\stock_history"

# Process each .json in stock_history directory
for filename in os.listdir(json_directory_path):
    if filename.endswith('.json'):
        file_path = os.path.join(json_directory_path, filename)
        process_json_file(cursor, file_path)

# Commit the transaction and close the connection
connection.commit()
cursor.close()
connection.close()
