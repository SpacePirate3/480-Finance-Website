import json
from datetime import datetime
import matplotlib.pyplot as plt

# Read the JSON file
with open('aapl_data_compact.json', 'r') as file:
    aapl_data = json.load(file)

# Extract the symbol
symbol = aapl_data['Meta Data']['2. Symbol']

# Extract dates and highs/lows
aapl_dict = aapl_data['Time Series (Daily)']
aapl_dates, highs, lows = [], [], []
for date in aapl_dict:
    aapl_dates.append(datetime.strptime(date, '%Y-%m-%d'))
    highs.append(float(aapl_dict[date]['2. high']))
    lows.append(float(aapl_dict[date]['3. low']))

# Using a mid-dark grey background
plt.style.use('dark_background')
fig, ax = plt.subplots()
fig.patch.set_facecolor('#3A3A3A')  # Mid-dark grey background for the figure
ax.set_facecolor('#3A3A3A')  # Mid-dark grey background for the axes

# Plotting highs in neon green and lows in neon red
ax.plot(aapl_dates, highs, color='#39FF14', label='Highs')  # Neon green for highs
ax.plot(aapl_dates, lows, color='#FF073A', label='Lows')  # Neon red for lows
ax.fill_between(aapl_dates, highs, lows, facecolor='#FF073A', alpha=0.1)  # Lighter shade for the area

# Formatting the plot
ax.set_title(f"Daily High and Low Stock Prices - {symbol}", fontsize=20, color='white')
ax.set_xlabel('Date', fontsize=16, color='white')
ax.set_ylabel('Price (USD)', fontsize=16, color='white')
ax.tick_params(axis='both', colors='white')
plt.xticks(rotation=45)
plt.yticks(fontsize=10)
plt.ylim(min(lows) - 5, max(highs) + 5)  # Adding some padding to ylim
plt.legend()

# Displaying the plot
plt.show()