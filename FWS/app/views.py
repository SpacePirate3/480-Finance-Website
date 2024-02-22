from django.shortcuts import render
from rest_framework import generics
from .models import StockOverview, IntradayData, HistoricalData
from .serializers import StockOverviewSerializer, IntradayDataSerializer, HistoricalDataSerializer

class StockOverviewListCreate(generics.ListCreateAPIView):
    queryset = StockOverview.objects.all()
    serializer_class = StockOverviewSerializer

class IntradayDataListCreate(generics.ListCreateAPIView):
    queryset = IntradayData.objects.all()
    serializer_class = IntradayDataSerializer

class HistoricalDataListCreate(generics.ListCreateAPIView):
    queryset = HistoricalData.objects.all()
    serializer_class = HistoricalDataSerializer
