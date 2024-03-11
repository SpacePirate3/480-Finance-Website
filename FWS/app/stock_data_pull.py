from dotenv import load_dotenv
import os
import requests
import mysql.connector
import time

# Load environment variables from .env file
load_dotenv()

# API keys for accessing the external data source.
api_keys = [os.getenv("API_KEY1"), os.getenv("API_KEY2"), os.getenv("API_KEY3")]
current_key_index = 0  # Start with the first API key
calls_made_with_current_key = 0

# Database connection details, loaded from environment variables.
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")


def db_connect():
    """
    Establishes a connection to the database using credentials loaded from environment variables.

    Returns:
        A MySQL connection object.
    """
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )


def convert_none_values(data):
    """
    Converts 'None' or '-' string values to None type for all keys except 'Symbol' in a dictionary.

    Parameters:
        data (dict): The dictionary whose values need to be converted.
    Returns:
        dict: The dictionary with 'None' or '-' values converted to None type.
    """
    return {
        key: None if (value == 'None' or value == '-') and key != 'Symbol' else value
        for key, value in data.items()
    }


def fetch_stock_data(symbol, fetch_type="historical", interval_min=1):
    """
    Fetches and updates stock data for a given symbol. Supports historical, daily, and intraday data fetching.

    Parameters:
        symbol (str): The stock symbol for which to fetch the data.
        fetch_type (str): The type of data to fetch - "historical", "daily", or "intraday". Default is "historical".
        interval_min (int): The time interval in minutes for intraday data fetching. Default is 1 minute.
    """
    global current_key_index, calls_made_with_current_key
    url = "https://alpha-vantage.p.rapidapi.com/query"

    connection = None
    cursor = None
    try:
        # Setup for API request
        if fetch_type in ["historical", "daily"]:
            function = "TIME_SERIES_DAILY"
            output_size = "full" if fetch_type == "historical" else "compact"
            querystring = {
                "function": function,
                "symbol": symbol,
                "outputsize": output_size,
                "datatype": "json"
            }
        elif fetch_type == "intraday":
            function = "TIME_SERIES_INTRADAY"
            interval_str = f"{interval_min}min"  # Format interval as a string, i.e. "1min".
            output_size = "full"  # Always use compact for intraday
            querystring = {
                "function": function,
                "symbol": symbol,
                "interval": interval_str,
                "outputsize": output_size,
                "datatype": "json"
            }

        headers = {
            "X-RapidAPI-Key": api_keys[current_key_index],
            "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)

        if response.status_code == 200:
            data = response.json()

            # Determine the key for data extraction based on fetch_type
            data_key = f"Time Series ({interval_str})" if fetch_type == "intraday" else "Time Series (Daily)"
            stock_data = data.get(data_key, {})

            if fetch_type == "intraday":
                # Find the most current date from the data
                most_current_date = max(stock_data.keys()).split(" ")[0]
                # Filter stock_data to keep only entries for the most current date
                stock_data = {date: values for date, values in stock_data.items() if date.startswith(most_current_date)}

            connection = db_connect()
            cursor = connection.cursor()

            # Ensure the stock symbol exists in the overview table
            cursor.execute("SELECT ID FROM stock_overview WHERE symbol = %s", (symbol,))
            result = cursor.fetchone()
            if not result:
                print(f"No ID found for symbol {symbol}. Ensure stock_overview is populated first.")
                return

            stock_id = result[0]

            if fetch_type == "intraday":
                # Clear existing intraday records for the symbol
                cursor.execute("DELETE FROM intraday_data WHERE ID = %s", (stock_id,))
                connection.commit()

            # Prepare the database insert/update query
            table_name = "intraday_data" if fetch_type == "intraday" else "historical_data"
            upsert_query = f"""
            INSERT INTO {table_name} (
                ID, symbol, date, open, high, low, close, volume
            )
            VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s
            )
            ON DUPLICATE KEY UPDATE
                open = VALUES(open), high = VALUES(high), low = VALUES(low),
                close = VALUES(close), volume = VALUES(volume);
            """

            # Insert or update the stock data
            for date, values in stock_data.items():
                cursor.execute(upsert_query, (
                    stock_id,
                    symbol,
                    date,
                    values['1. open'],
                    values['2. high'],
                    values['3. low'],
                    values['4. close'],
                    values['5. volume']
                ))

            connection.commit()
            print(f"{fetch_type.capitalize()} data for {symbol} has been updated.")
        else:
            print(f"Failed to fetch {fetch_type} data for {symbol}")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    # API key rotation logic
    calls_made_with_current_key += 1
    if calls_made_with_current_key >= 5:
        current_key_index = (current_key_index + 1) % len(api_keys)
        calls_made_with_current_key = 0


def fetch_stock_overview(symbol):
    """
    Fetches and updates the stock overview information for a given symbol.

    Parameters:
        symbol (str): The stock symbol for which to fetch the overview information.
    """
    global current_key_index, calls_made_with_current_key
    url = "https://alpha-vantage.p.rapidapi.com/query"

    connection = None
    cursor = None
    try:
        querystring = {"function": "Overview", "symbol": symbol, "datatype": "json"}
        headers = {
            "X-RapidAPI-Key": api_keys[current_key_index],
            "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com"
        }
        response = requests.get(url, headers=headers, params=querystring)
        if response.status_code == 200:
            overview_data = response.json()
            connection = db_connect()
            cursor = connection.cursor()

            # SQL query to insert or update the stock_overview data
            upsert_query = """
            INSERT INTO stock_overview (
                symbol, asset_type, name, description, cik, exchange, currency, country, sector, industry, address, 
                fiscal_year_end, latest_quarter, market_capitalization, ebitda, pe_ratio, peg_ratio, book_value, 
                dividend_per_share, dividend_yield, eps, revenue_per_share_ttm, profit_margin, operating_margin_ttm, 
                return_on_assets_ttm, return_on_equity_ttm, revenue_ttm, gross_profit_ttm, diluted_eps_ttm, 
                quarterly_earnings_growth_yoy, quarterly_revenue_growth_yoy, analyst_target_price, trailing_pe, 
                forward_pe, price_to_sales_ratio_ttm, price_to_book_ratio, ev_to_revenue, ev_to_ebitda, beta, 
                week_52_high, week_52_low, day_50_moving_average, day_200_moving_average, shares_outstanding, 
                dividend_date, ex_dividend_date
            )
            VALUES (
                %(Symbol)s, %(AssetType)s, %(Name)s, %(Description)s, %(CIK)s, %(Exchange)s, %(Currency)s, %(Country)s, %(Sector)s,
                %(Industry)s, %(Address)s, %(FiscalYearEnd)s, %(LatestQuarter)s, %(MarketCapitalization)s, %(EBITDA)s,
                %(PERatio)s, %(PEGRatio)s, %(BookValue)s, %(DividendPerShare)s, %(DividendYield)s, %(EPS)s, %(RevenuePerShareTTM)s,
                %(ProfitMargin)s, %(OperatingMarginTTM)s, %(ReturnOnAssetsTTM)s, %(ReturnOnEquityTTM)s, %(RevenueTTM)s,
                %(GrossProfitTTM)s, %(DilutedEPSTTM)s, %(QuarterlyEarningsGrowthYOY)s, %(QuarterlyRevenueGrowthYOY)s,
                %(AnalystTargetPrice)s, %(TrailingPE)s, %(ForwardPE)s, %(PriceToSalesRatioTTM)s, %(PriceToBookRatio)s,
                %(EVToRevenue)s, %(EVToEBITDA)s, %(Beta)s, %(52WeekHigh)s, %(52WeekLow)s, %(50DayMovingAverage)s,
                %(200DayMovingAverage)s, %(SharesOutstanding)s, %(DividendDate)s, %(ExDividendDate)s
            )
            ON DUPLICATE KEY UPDATE
                asset_type=VALUES(asset_type), name=VALUES(name), description=VALUES(description), cik=VALUES(cik), 
                exchange=VALUES(exchange), currency=VALUES(currency), country=VALUES(country), sector=VALUES(sector), 
                industry=VALUES(industry), address=VALUES(address), fiscal_year_end=VALUES(fiscal_year_end), 
                latest_quarter=VALUES(latest_quarter), market_capitalization=VALUES(market_capitalization), 
                ebitda=VALUES(ebitda), pe_ratio=VALUES(pe_ratio), peg_ratio=VALUES(peg_ratio), 
                book_value=VALUES(book_value), dividend_per_share=VALUES(dividend_per_share), 
                dividend_yield=VALUES(dividend_yield), eps=VALUES(eps), revenue_per_share_ttm=VALUES(revenue_per_share_ttm), 
                profit_margin=VALUES(profit_margin), operating_margin_ttm=VALUES(operating_margin_ttm), 
                return_on_assets_ttm=VALUES(return_on_assets_ttm), return_on_equity_ttm=VALUES(return_on_equity_ttm), 
                revenue_ttm=VALUES(revenue_ttm), gross_profit_ttm=VALUES(gross_profit_ttm), 
                diluted_eps_ttm=VALUES(diluted_eps_ttm), quarterly_earnings_growth_yoy=VALUES(quarterly_earnings_growth_yoy), 
                quarterly_revenue_growth_yoy=VALUES(quarterly_revenue_growth_yoy), analyst_target_price=VALUES(analyst_target_price), 
                trailing_pe=VALUES(trailing_pe), forward_pe=VALUES(forward_pe), price_to_sales_ratio_ttm=VALUES(price_to_sales_ratio_ttm), 
                price_to_book_ratio=VALUES(price_to_book_ratio), ev_to_revenue=VALUES(ev_to_revenue), 
                ev_to_ebitda=VALUES(ev_to_ebitda), beta=VALUES(beta), week_52_high=VALUES(week_52_high), week_52_low=VALUES(week_52_low), 
                day_50_moving_average=VALUES(day_50_moving_average), day_200_moving_average=VALUES(day_200_moving_average), 
                shares_outstanding=VALUES(shares_outstanding), dividend_date=VALUES(dividend_date), ex_dividend_date=VALUES(ex_dividend_date);
            """

            # Convert 'None' strings to None for the overview_data, excluding 'Symbol'
            converted_data = convert_none_values(overview_data)

            # Execute the upsert query with overview data
            cursor.execute(upsert_query, converted_data)

            connection.commit()
            print(f"Overview data for {symbol} updated in the database.")
        else:
            print(f"Failed to fetch overview data for {symbol}")
    except Exception as e:
        print(f"An error occured: {e}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    # Logic to rotate the API key
    calls_made_with_current_key += 1
    if calls_made_with_current_key >= 5:
        current_key_index = (current_key_index + 1) % len(api_keys)
        calls_made_with_current_key = 0  # Reset the count for the new key


def intraday_update():
    stocks = {
        "Meta Platforms Inc.": "META",
        "Amazon": "AMZN",
        "Apple": "AAPL",
        "Netflix": "NFLX",
        "Google": "GOOGL",
        "Dell": "DELL",
        "Intel": "INTC",
        "Microsoft": "MSFT",
        "NVIDIA": "NVDA",
        "International Business Machines": "IBM",
        "Advanced Micro Devices Inc": "AMD",
        "HP Inc": "HPQ",
        "Tesla": "TSLA",
        "T-Mobile": "TMUS",
        "Verizon": "VZ",
    }

    current_call_count = 0

    for name, symbol in stocks.items():
        print(f"Fetching data for {name} ({symbol})...")

        # fetch_stock_overview(symbol) # Updates stock_overview table with most-recent day.
        # fetch_stock_data(symbol, 'historical')
        fetch_stock_data(symbol, 'intraday')

        current_call_count += 1  # Increment by the number of calls made

        # After every 15 calls, pause for 60 seconds
        if current_call_count > 15:
            print("60 second pause (API call limits)")
            time.sleep(60)
            current_call_count = 0  # Reset call count

def daily_update():
    stocks = {
        "Meta Platforms Inc.": "META",
        "Amazon": "AMZN",
        "Apple": "AAPL",
        "Netflix": "NFLX",
        "Google": "GOOGL",
        "Dell": "DELL",
        "Intel": "INTC",
        "Microsoft": "MSFT",
        "NVIDIA": "NVDA",
        "International Business Machines": "IBM",
        "Advanced Micro Devices Inc": "AMD",
        "HP Inc": "HPQ",
        "Tesla": "TSLA",
        "T-Mobile": "TMUS",
        "Verizon": "VZ",
    }

    current_call_count = 0

    for name, symbol in stocks.items():
        print(f"Fetching data for {name} ({symbol})...")
        fetch_stock_overview(symbol) # Updates stock_overview table with most-recent day.
        current_call_count += 1  # Increment by the number of calls made
    time.sleep(60)
    for name, symbol in stocks.items():
            print(f"Fetching data for {name} ({symbol})...")
            fetch_stock_data(symbol, 'daily')  # Updates stock_overview table with most-recent day.
            current_call_count += 1  # Increment by the number of calls made

        # After every 15 calls, pause for 60 seconds


def main():
    """
    MAIN FUNCTION FOR DATA POPULATION DURING DEVELOPMENT

    Main function to iterate through a predefined list of stocks and populate the database with their data.
    Fetches overview, daily, and intraday data for each stock.
    """
    stocks = {
        "Meta Platforms Inc.": "META",
        "Amazon": "AMZN",
        "Apple": "AAPL",
        "Netflix": "NFLX",
        "Google": "GOOGL",
        "Dell": "DELL",
        "Intel": "INTC",
        "Microsoft": "MSFT",
        "NVIDIA": "NVDA",
        "International Business Machines": "IBM",
        "Advanced Micro Devices Inc": "AMD",
        "HP Inc": "HPQ",
        "Tesla": "TSLA",
        "T-Mobile": "TMUS",
        "Verizon": "VZ",
    }

    current_call_count = 0

    for name, symbol in stocks.items():
        print(f"Fetching data for {name} ({symbol})...")

        fetch_stock_overview(symbol) # Updates stock_overview table with most-recent day.
        fetch_stock_data(symbol, 'historical')
        fetch_stock_data(symbol, 'intraday')

        current_call_count += 1  # Increment by the number of calls made

        # After every 15 calls, pause for 60 seconds
        if current_call_count > 15:
            print("60 second pause (API call limits)")
            time.sleep(60)
            current_call_count = 0  # Reset call count


if __name__ == "__main__":
    main()
