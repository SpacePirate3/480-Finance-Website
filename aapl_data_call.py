import requests
import json

# URL for the API request
url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&interval=5min&apikey=NMBJV9I1JXOWWEZ6'

# Making the API request
response = requests.get(url)

# Checking if the request was successful
if response.status_code == 200:
    data = response.json()
    with open('aapl_data.json', 'w') as file:
        json.dump(data, file, indent=4)
    print("Data saved to aapl_data.json")
else:
    print(f"Failed to retrieve data, status code: {response.status_code}")