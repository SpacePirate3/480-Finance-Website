from rest_framework import serializers
from .models import StockOverview, IntradayData, HistoricalData

class StockOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockOverview
        fields = '__all__'

class IntradayDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntradayData
        fields = '__all__'

class HistoricalDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalData
        fields = '__all__'
