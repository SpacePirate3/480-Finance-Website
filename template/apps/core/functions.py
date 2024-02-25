import datetime

from dotenv import load_dotenv
import os
import requests
import mysql.connector
import time
import FWS.FWS.stock_data_pull as stock_data_pull

# Load environment variables from .env file
load_dotenv()

# API_KEY Management Initialization
api_keys = [os.getenv("API_KEY1"), os.getenv("API_KEY2"), os.getenv("API_KEY3")]
current_key_index = 0  # Start with the first API key
calls_made_with_current_key = 0

# Database connection details
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
stocks = {
    "Amazon": "AMZN",
    "Apple": "AAPL",
    "Dell": "DELL",
    "GameStop": "GME",
    "Google": "GOOGL",
    "Intel": "INTC",
    "Microsoft": "MSFT",
    "Netflix": "NFLX",
    "NVIDIA": "NVDA",
    "Tesla": "TSLA",
    "S&P Global Inc.": "SPGI",
    "Dow Inc.": "DOW",
    "Nasdaq, Inc": "NDAQ",
}


# Function to connect to the database
def db_connect():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

def eachstock(func):
    for name, symbol in stocks.items():
        func(symbol)
def lastIntraday(symbol):
    connection = db_connect()
    cursor = connection.cursor()
    cursor.execute("SELECT ID FROM stock_overview WHERE symbol = %s", (symbol,))
    result = cursor.fetchone()
    if result is None:
        print("Symbol not found")
        return
    stock_id = result[0]
    cursor.execute("SELECT MAX(date_time) FROM intraday_data WHERE ID = %s", (stock_id,))
    result = cursor.fetchone()
    return result[0]


def fetchdailydata(symbol):
    return

def fetch_intraday_data(symbol):
    global current_key_index, calls_made_with_current_key

    connection = db_connect()
    cursor = connection.cursor()

    # Fetch ID for symbol from stock_overview table
    cursor.execute("SELECT ID FROM stock_overview WHERE symbol = %s", (symbol,))
    result = cursor.fetchone()
    if result is None:
        print(f"No ID found for symbol {symbol}. Ensure stock_overview is populated first.")
        return  # Exit the function if no ID found
    stock_id = result[0]

    # Fetch and insert new intraday data as before
    url = "https://alpha-vantage.p.rapidapi.com/query"
    querystring = {
        "function": "TIME_SERIES_INTRADAY",
        "symbol": symbol,
        "interval": "1min",
        "outputsize": "compact",
        "datatype": "json"
    }
    headers = {
        "X-RapidAPI-Key": api_keys[current_key_index],
        "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code == 200:
        data = response.json()
        intraday_data = data['Time Series (1min)']  # Adjust based on the actual key in response
        insert_query = """
        INSERT INTO intraday_data (ID, symbol, date_time, open, high, low, close, volume)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """
        intraday_data = intraday_data.items()
        lastUpdate = lastIntraday(symbol)
        for date_time, values in intraday_data:
            if (datetime.datetime.strptime(date_time, '%Y-%m-%d %H:%M:%S') > lastUpdate):
                cursor.execute(insert_query, (
                    stock_id,
                    symbol,
                    date_time,
                    values['1. open'],
                    values['2. high'],
                    values['3. low'],
                    values['4. close'],
                    values['5. volume']
                ))

        connection.commit()
        print(f"Intraday data for {symbol} has been updated.")
    else:
        print(f"Failed to fetch intraday data for {symbol}")

    # Logic to rotate the API key
    calls_made_with_current_key += 1
    if calls_made_with_current_key >= 5:
        current_key_index = (current_key_index + 1) % len(api_keys)
        calls_made_with_current_key = 0  # Reset the count for the new key

    cursor.close()
    connection.close()
