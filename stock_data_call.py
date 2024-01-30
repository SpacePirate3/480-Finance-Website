"""
Optional: outputsize

By default, outputsize=compact. 

Strings compact and full are accepted with the following specifications: 
    'compact' returns only the latest 100 data points 
    'full' returns the full-length time series of 20+ years of historical data. 

The "compact" option is recommended if you would like to reduce the data size of each API call.

To Pull Stock:
    Edit function to desired pull type.
    Edit symbol to desired stock acronym.
"""

import requests
import json
import re
import os

# URL for the API request
url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=full&apikey=NMBJV9I1JXOWWEZ6'

# Extracting the stock symbol (source) from the URL
source_match = re.search(r'symbol=([A-Za-z0-9]+)', url)
if source_match:
    source = source_match.group(1)
else:
    print("Could not determine the source from the URL.")
    source = "default"

# Directory where .json will be saved
directory = 'stock_history'

# Modified filename based on the source
filename = f'{directory}/{source.lower()}_data_full.json'

# Making the API request
response = requests.get(url)

# Checking if the request was successful
if response.status_code == 200:
    data = response.json()
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)
    print(f"Data saved to {filename}")
else:
    print(f"Failed to retrieve data, status code: {response.status_code}")