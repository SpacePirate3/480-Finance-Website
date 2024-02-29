import datetime
import json
from django.http import JsonResponse, HttpResponse
from .models import StockOverview, HistoricalData, IntradayData
from django.core.serializers import serialize
from django.urls import path
from . import views
from FWS import stock_data_pull

def stock_overview(request, symbol):
    try:
        stock = StockOverview.objects.get(symbol=symbol)
        # Serialize the stock overview to JSON, then parse it to a dictionary
        data_json = serialize('json', [stock], use_natural_primary_keys=True)
        data_dict = json.loads(data_json)
        # Since we have only one stock, we can return the first item in the list
        return JsonResponse(data_dict[0], safe=False)
    except StockOverview.DoesNotExist:
        return JsonResponse({'error': 'Stock not found'}, status=404)
    
def stock_overview_simple(request, symbol):
    try:
        stock = StockOverview.objects.values('name', 'symbol').get(symbol=symbol)
        return JsonResponse(stock)
    except StockOverview.DoesNotExist:
        return JsonResponse({'error': 'Stock not found'}, status=404)

def stock_list(request):
    try:
        stocks = StockOverview.objects.all()
        stock_symbols = [stock.symbol for stock in stocks]
        return JsonResponse(stock_symbols, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def historical_data(request, symbol):
    try:
        stock = StockOverview.objects.get(symbol=symbol)
        data = HistoricalData.objects.filter(stock_id=stock.id).order_by('-date')
        data_json = serialize('json', data)
        data_dict = json.loads(data_json)  # Convert JSON string to dictionary
        return JsonResponse(data_dict, safe=False)
    except StockOverview.DoesNotExist:
        return JsonResponse({'error': 'Stock not found'}, status=404)

def latest_historical_data(request, symbol):
    try:
        stock = StockOverview.objects.get(symbol=symbol)
        # Fetch only the latest historical data entry for the stock
        latest_data = HistoricalData.objects.filter(stock_id=stock.id).order_by('-date').first()
        if latest_data:
            # Serialize the latest historical data to JSON and parse it to a dictionary
            data_json = serialize('json', [latest_data])  # Wrap latest_data in a list to serialize
            data_dict = json.loads(data_json)
            # Return the first item in the list since we know there's only one
            return JsonResponse(data_dict[0], safe=False)
        else:
            return JsonResponse({'error': 'No historical data found for this stock'}, status=404)
    except StockOverview.DoesNotExist:
        return JsonResponse({'error': 'Stock not found'}, status=404)

def intraday_data(request, symbol):
    try:
        stock = StockOverview.objects.get(symbol=symbol)
        intraday_data = IntradayData.objects.filter(stock_id=stock.id).order_by('-date')
        data_json = serialize('json', intraday_data)
        data_dict = json.loads(data_json)  # Convert JSON string to dictionary
        return JsonResponse(data_dict, safe=False)
    except StockOverview.DoesNotExist:
        return JsonResponse({'error': 'Stock not found'}, status=404)

def latest_intraday_data(request, symbol):
    try:
        stock = StockOverview.objects.get(symbol=symbol)
        # Fetch only the latest intraday data entry for the stock
        latest_data = IntradayData.objects.filter(stock_id=stock.id).order_by('-date').first()
        if latest_data:
            # Serialize the latest intraday data to JSON and parse it to a dictionary
            data_json = serialize('json', [latest_data])  # Wrap latest_data in a list to serialize
            data_dict = json.loads(data_json)
            # Return the first item in the list since we know there's only one
            return JsonResponse(data_dict[0], safe=False)
        else:
            return JsonResponse({'error': 'No intraday data found for this stock'}, status=404)
    except StockOverview.DoesNotExist:
        return JsonResponse({'error': 'Stock not found'}, status=404)

def candlestick_chart_data_intraday(request, symbol, period):
    try:
        stock = StockOverview.objects.get(symbol=symbol)
        intraday_data = IntradayData.objects.filter(stock_id=stock.id).order_by('-date')
        count, open,  high, low, close, volume = 0
        chart = list()
        for i in intraday_data:
            if i.high > high:
                high = i.high
            if i.low < low:
                low = i.low
            if close == 0:
                close = i.close
            if count == (period):
                open = i.open
                list.append([i.date, open, high, low, close])
                count, open, high, low, close, volume = 0
        return JsonResponse(chart, safe=False)
    except StockOverview.DoesNotExist:
        return JsonResponse({'error': 'Stock not found'}, status=404)
    
def candlestick_chart_data_daily(request, symbol, period):
    try:
        stock = StockOverview.objects.get(symbol=symbol)
        historical_data = HistoricalData.objects.filter(stock_id=stock.id).order_by('-date')
        count, open, high, low, close, volume = 0, 0, 0, 0, 0, 0
        chart = list()
        for i in historical_data:
            if i.high > high:
                high = i.high
            if i.low < low:
                low =i.low
            if close == 0:
                close = i.close
            if count == (period):
                open = i.open
                list.append([i.date, high, low, open, close])
                count, open, high, low, close, volume = 0, 0, 0, 0, 0, 0
            count += 1
        return JsonResponse(chart, safe=False)
    except StockOverview.DoesNotExist:
        return  JsonResponse({'error': 'Stock not found'}, status=404)

def line_chart_data_intraday(request, symbol):
    try:
        stock = StockOverview.objects.get(symbol=symbol)
        data = IntradayData.objects.filter(stock_id=stock.id).order_by('date')
        data_json = serialize('json', data)
        data_dict = json.loads(data_json)
        return JsonResponse(data_dict, safe=False)
    except StockOverview.DoesNotExist:
        return JsonResponse({'error': 'Stock not found'}, status=404)
