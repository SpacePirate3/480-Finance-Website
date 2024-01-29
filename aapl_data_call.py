import requests
import json

"""
Optional: outputsize

By default, outputsize=compact. 

Strings compact and full are accepted with the following specifications: 
    'compact' returns only the latest 100 data points 
    'full' returns the full-length time series of 20+ years of historical data. 

The "compact" option is recommended if you would like to reduce the data size of each API call.
"""

# Here, outputsize is 'full', so all historical data will be represented
url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&outputsize=full&apikey=NMBJV9I1JXOWWEZ6'

# Making the API request
response = requests.get(url)

# Checking if the request was successful
if response.status_code == 200:
    data = response.json()
    with open('aapl_data_full.json', 'w') as file:
        json.dump(data, file, indent=4)
    print("Data saved to aapl_data_full.json")
else:
    print(f"Failed to retrieve data, status code: {response.status_code}")