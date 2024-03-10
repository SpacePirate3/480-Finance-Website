import unittest
from dotenv import load_dotenv
import os
import requests

import mysql.connector
import time

# Load environment variables from .env file
load_dotenv()




class TestEnvironment(unittest.TestCase):
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
    def test_(self):
        self.assertEqual(os.getenv("DB_NAME",False),"StockData")
    def test_(self):
        self.assertEqual(os.getenv("DB_PORT",False),"3306")

if __name__ == '__main__':
    unittest.main()