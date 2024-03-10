import unittest
from dotenv import load_dotenv
import os
import requests
from datetime import date
from datetime import datetime
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

    

   


if __name__ == '__main__':
    api = "http://localhost:8000/api/"
    # resp = requests.get(api+"stock/list/")
    # print(resp.json())
    #resp = requests.get(api+"stock/overview/simple/"+'AMZN'+'/')
    #print(resp.json().keys())
    unittest.main()