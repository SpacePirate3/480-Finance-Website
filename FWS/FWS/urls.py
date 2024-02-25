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
    path('api/stock/overview/<str:symbol>/', views.stock_overview, name='stock_overview'),
    path('api/stock/historical/<str:symbol>/', views.historical_data, name='historical_data'),
    path('api/stock/intraday/<str:symbol>/', views.intraday_data, name='intraday_data'),
    path('api/stock/list/', views.stock_list, name='stock_list'),

    # ... add other URL patterns as needed ...
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
