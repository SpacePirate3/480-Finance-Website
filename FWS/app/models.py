from django.db import models


class StockOverview(models.Model):
    symbol = models.CharField(max_length=10, unique=True)
    asset_type = models.CharField(max_length=50, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    cik = models.CharField(max_length=10, blank=True, null=True)
    exchange = models.CharField(max_length=50, blank=True, null=True)
    currency = models.CharField(max_length=10, blank=True, null=True)
    country = models.CharField(max_length=50, blank=True, null=True)
    sector = models.CharField(max_length=255, blank=True, null=True)
    industry = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    fiscal_year_end = models.CharField(max_length=10, blank=True, null=True)
    latest_quarter = models.DateField(blank=True, null=True)
    market_capitalization = models.BigIntegerField(blank=True, null=True)
    ebitda = models.BigIntegerField(blank=True, null=True)
    pe_ratio = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    peg_ratio = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    book_value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    dividend_per_share = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    dividend_yield = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    eps = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    revenue_per_share_ttm = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    profit_margin = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    operating_margin_ttm = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    return_on_assets_ttm = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    return_on_equity_ttm = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    revenue_ttm = models.BigIntegerField(blank=True, null=True)
    gross_profit_ttm = models.BigIntegerField(blank=True, null=True)
    diluted_eps_ttm = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    quarterly_earnings_growth_yoy = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    quarterly_revenue_growth_yoy = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    analyst_target_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    trailing_pe = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    forward_pe = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    price_to_sales_ratio_ttm = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    price_to_book_ratio = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    ev_to_revenue = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    ev_to_ebitda = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    beta = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    week_52_high = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    week_52_low = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    day_50_moving_average = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    day_200_moving_average = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    shares_outstanding = models.BigIntegerField(blank=True, null=True)
    dividend_date = models.DateField(blank=True, null=True)
    ex_dividend_date = models.DateField(blank=True, null=True)

    class Meta:
        db_table = 'stock_overview'
        app_label = 'app'

class IntradayData(models.Model):
    ID = models.ForeignKey(StockOverview, on_delete=models.CASCADE)
    symbol = models.CharField(max_length=10)
    date = models.DateTimeField()
    open = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    high = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    low = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    close = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    volume = models.BigIntegerField(null=True, blank=True)

    class Meta:
        db_table = 'intraday_data'
        unique_together = (('ID', 'date'),)
        app_label = 'app'

class HistoricalData(models.Model):
    ID = models.ForeignKey(StockOverview, on_delete=models.CASCADE)
    symbol = models.CharField(max_length=10)
    date = models.DateField()
    open = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    high = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    low = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    close = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    volume = models.BigIntegerField(null=True, blank=True)

    class Meta:
        db_table = 'historical_data'
        unique_together = (('ID', 'date'),)
        app_label = 'app'
