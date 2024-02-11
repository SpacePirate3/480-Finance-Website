import datetime
import logging
import os

from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET
from dotenv import load_dotenv
import stock_data_pull
import functions

@require_GET
def robots_txt(request):
    lines = [
        'User-Agent: *',
        'Disallow: /admin/',
        'Disallow: /membership/',
    ]

    return HttpResponse('\n'.join(lines), content_type='text/plain')


def intradaystockupdate(request):
    lastUpdate = functions.lastIntraday("AAPL")
    date = datetime.datetime.now()
    difference = lastUpdate - date
    if difference.seconds/60 > 1:
        functions.eachstock(functions.fetch_intraday_data)
    return HttpResponse(200)

def maintenance(request):
    return render(request, 'maintenance.html')
