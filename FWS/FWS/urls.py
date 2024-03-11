"""
URL configuration for FWS project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from app import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/stock/overview/<str:symbol>/', views.stock_overview, name='stock_overview'),
    path('api/stock/overview/simple/<str:symbol>/', views.stock_overview_simple, name='stock_overview_simple'),
    path('api/stock/historical/<str:symbol>/', views.historical_data, name='historical_data'),
    path('api/stock/historical/latest/<str:symbol>/', views.latest_historical_data, name='latest_historical_data'),
    path('api/stock/intraday/<str:symbol>/', views.intraday_data, name='intraday_data'),
    path('api/stock/intraday/latest/<str:symbol>/', views.latest_intraday_data, name='latest_intraday_data'),
    path('api/stock/list/', views.stock_list, name='stock_list'),
    path('api/stock/chart/candlestick/intraday/<str:symbol>/<int:period>/', views.candlestick_chart_data_intraday, name='chart_candlestick'),
    path('api/stock/chart/line/intraday/<str:symbol>/', views.line_chart_data_intraday, name='line_chart_data_intraday'),
    path('api/stock/chart/line/historical/<str:symbol>/', views.line_chart_data_daily, name='line_chart_data_historical'),
    path('api/stock/chart/candlestick/historical/<str:symbol>/<int:period>/', views.candlestick_chart_data_daily, name='chart_candlestick_daily')
    # ... add other URL patterns as needed ...
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
