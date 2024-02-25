import schedule
import time
from FWS import stock_data_pull


def update_daily():
    stock_data_pull.update_daily()


def update_intraday():
    stock_data_pull.update_intraday()

schedule.every(5).minutes.do(update_intraday)
schedule.every().day.at("9:15").do(update_daily)
def start_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(60)