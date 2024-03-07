from django.contrib import admin
from .models import IntradayData, HistoricalData, StockOverview
# Register your models here.

admin.site.register(IntradayData)
admin.site.register(HistoricalData)
admin.site.register(StockOverview)