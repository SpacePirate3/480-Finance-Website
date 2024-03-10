import unittest
from dotenv import load_dotenv
import os
import requests
from datetime import datetime, timedelta, timezone,date


import mysql.connector
import time

# Load environment variables from .env file
load_dotenv()




class TestEnvironment(unittest.TestCase):
    api = "http://localhost:8000/api/"
    stocks = ['META', 'AMZN', 'AAPL', 'NFLX', 'GOOGL', 'DELL', 'INTC', 'MSFT', 'NVDA', 'IBM', 'AMD', 'HPQ', 'TSLA', 'TMUS', 'VZ']
    def test_3Keys(self):
        api_keys = [os.getenv("API_KEY1",False), os.getenv("API_KEY2",False), os.getenv("API_KEY3",False)]
        for key in api_keys:
            self.assertNotEqual(key,False)
    
    def test_DbHost(self):
        self.assertNotEqual(os.getenv("DB_HOST",False),False)
    def test_DbUser(self):
        self.assertNotEqual(os.getenv("DB_USER",False),False)
    def test_DbPW(self):
        self.assertNotEqual(os.getenv("DB_PASSWORD",False),False)
    def test_DbUser(self):
        self.assertNotEqual(os.getenv("DB_USER",False),False)
    def test_DbName(self):
        self.assertEqual(os.getenv("DB_NAME",False),"StockData")
    def test_DbPort(self):
        self.assertEqual(os.getenv("DB_PORT",False),"3306")
    
    

    def test_api_list(self):
        resp = requests.get(self.api+"stock/list/")
        self.assertEqual(resp.json(),['META', 'AMZN', 'AAPL', 'NFLX', 'GOOGL', 'DELL', 'INTC', 'MSFT', 'NVDA', 'IBM', 'AMD', 'HPQ', 'TSLA', 'TMUS', 'VZ'])
    def test_api_simple(self):
        for stock in self.stocks:
            resp = requests.get(self.api+"stock/overview/simple/"+stock+'/')
            self.assertEqual(resp.status_code,200)
            self.assertNotEqual(resp.json()['name'],'')
            self.assertEqual(resp.json()['symbol'],stock)
            self.assertEqual(resp.json().keys(),['name','symbol'])
    def test_api_historicalLatest(self):
        for stock in self.stocks:
            resp = requests.get(self.api+"stock/historical/latest/"+stock+'/')
            #returns good http code
            self.assertEqual(resp.status_code,200)
            #the initial keys in the json object are correct
            jsonKeys1 = list(resp.json().keys())
            self.assertEqual(jsonKeys1,['model','pk','fields'])
            #the keys of the value mapped to fields is correct
            jsonKeys2 = list(resp.json()['fields'].keys())
            self.assertEqual(jsonKeys2,['stock_id','date','open','high','low','close','volume'])
            
            #make sure historical has been updated within a day
            reqDate =  datetime.strptime(resp.json()['fields']['date'], '%Y-%m-%d').date() 
            today = date.today()
            self.assertLessEqual((today-reqDate).days,1)
    def test_api_intradayLatest(self):
        for stock in self.stocks:
            resp = requests.get(self.api + "stock/intraday/latest/" + stock + '/')

            # Check HTTP status code
            self.assertEqual(resp.status_code, 200)

            # Check the initial keys in the JSON object
            json_keys1 = list(resp.json().keys())
            self.assertEqual(json_keys1, ['model', 'pk', 'fields'])

            # Check the keys of the value mapped to fields
            json_keys2 = list(resp.json()['fields'].keys())
            self.assertEqual(json_keys2, ['stock_id', 'date', 'open', 'high', 'low', 'close', 'volume'])

            # Check if the date is within 2 hours of the current datetime in GMT
            req_date_str = resp.json()['fields']['date']
            req_date = datetime.strptime(req_date_str, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)

            # Calculate the time difference
            current_datetime_utc = datetime.utcnow().replace(tzinfo=timezone.utc)
            time_difference = current_datetime_utc - req_date

            # Check if the time difference is within the allowed range (2 hours)
            self.assertLessEqual(time_difference, timedelta(hours=2))

    def test_api_intradayChart(self):
        for stock in self.stocks:
            resp = requests.get(self.api + f"stock/chart/line/intraday/{stock}/")

            # Check HTTP status code
            self.assertEqual(resp.status_code, 200)

            # Check that it returns more than 50 entries
            self.assertGreater(len(resp.json()), 50)

            # Check the formatting of the first 10 entries and spacing between 1 minute of each other
            for i in range(10):
                entry = resp.json()[i]['fields']

                # Check keys in each entry
                entry_keys = list(entry.keys())
                self.assertEqual(entry_keys, ['stock_id', 'date', 'open', 'high', 'low', 'close', 'volume'])

                # Check date formatting
                entry_date_str = entry['date']
                entry_date = datetime.strptime(entry_date_str, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)

                # Calculate the time difference between consecutive entries
                if i > 0:
                    prev_entry_date_str = resp.json()[i - 1]['fields']['date']
                    prev_entry_date = datetime.strptime(prev_entry_date_str, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
                    time_difference = entry_date - prev_entry_date

                    # Check if the time difference is approximately 2 minutes
                    self.assertLessEqual(time_difference, timedelta(minutes=2), f'{prev_entry_date_str} is more than 2 minutes from {entry_date_str} in request for {stock}')
        
    

    def test_api_stockOverview(self):
        
        for stock_symbol in self.stocks:
            resp = requests.get(self.api + f"stock/overview/{stock_symbol}/")

            # Check HTTP status code
            self.assertEqual(resp.status_code, 200)

            # Check the structure of the response
            expected_keys = ['model', 'pk', 'fields']
            self.assertEqual(list(resp.json().keys()), expected_keys)

            # Check the fields in the response
            fields = resp.json()['fields']

            expected_fields = {
                "symbol", "asset_type", "name", "description", "cik", "exchange", "currency", "country", "sector",
                "industry", "address", "fiscal_year_end", "latest_quarter", "market_capitalization", "ebitda",
                "pe_ratio", "peg_ratio", "book_value", "dividend_per_share", "dividend_yield", "eps",
                "revenue_per_share_ttm", "profit_margin", "operating_margin_ttm", "return_on_assets_ttm",
                "return_on_equity_ttm", "revenue_ttm", "gross_profit_ttm", "diluted_eps_ttm",
                "quarterly_earnings_growth_yoy", "quarterly_revenue_growth_yoy", "analyst_target_price",
                "trailing_pe", "forward_pe", "price_to_sales_ratio_ttm", "price_to_book_ratio",
                "ev_to_revenue", "ev_to_ebitda", "beta", "week_52_high", "week_52_low", "day_50_moving_average",
                "day_200_moving_average", "shares_outstanding", "dividend_date", "ex_dividend_date"
            }

            self.assertSetEqual(set(fields.keys()), expected_fields)

            # Add additional checks for specific data values if needed
            # For example, check if market_capitalization is an integer, etc.

            # Check the data type of market_capitalization
            self.assertIsInstance(fields["market_capitalization"], int)

   


if __name__ == '__main__':
    api = "http://localhost:8000/api/"
    # resp = requests.get(api+"stock/list/")
    # print(resp.json())
    #resp = requests.get(api+"stock/overview/simple/"+'AMZN'+'/')
    #print(resp.json().keys())
    unittest.main()