from django.conf import settings

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from django.core.management.base import BaseCommand
from django_apscheduler.jobstores import DjangoJobStore
from django_apscheduler.models import DjangoJobExecution
from app import stock_data_pull


#Scheduled Function to update Intraday Data
def intraday_update():
    print("intraday_update")
    stock_data_pull.intraday_update()
    pass
#Scheduled Function to update Daily Data
def daily_update():
    print("Daily update")
    stock_data_pull.daily_update()
    pass
#Function to clear executions that are over a week old
def delete_old_job_executions(max_age=604_800):
    DjangoJobExecution.objects.delete_old_job_executions(max_age)
#
class Command(BaseCommand):
    help = "Runs APscheduler."
    #Django command to add jobs
    def handle(self, *args, **options):
        print("Running APscheduler.")
        scheduler = BlockingScheduler(timezone=settings.TIME_ZONE)
        scheduler.add_jobstore(DjangoJobStore(), "default")
        #NOTE: ALL TIMES ARE IN UTC BUT SCHEDULING IS BASED ON NEW YORK STOCK EXCHANGE HOURS IN ETC
        #Job to update intraday data, every minute while stock exchange is open
        scheduler.add_job(intraday_update, trigger=CronTrigger(day_of_week="mon-fri", hour="14-21", minute="*/1"), id="intraday_update", max_instances=1, replace_existing=True,)
        print("scheduled intraday_update")
       #job to wipe old executions every week monday at midnight
        scheduler.add_job(
            delete_old_job_executions,
            trigger=CronTrigger(
                day_of_week="mon", hour="00", minute="00"
            ),  # Midnight on Monday, before start of the next work week.
            id="delete_old_job_executions",
            max_instances=1,
            replace_existing=True,
        )
        #job to update daily data every day monday to friday 15 minutes after exchanges close
        scheduler.add_job(daily_update, trigger=CronTrigger(day_of_week='mon-fri', hour="21", minute="45"), id="daily_update", max_instances=1, replace_existing=True,)
        print("scheduled daily_update")
        #start scheduler
        scheduler.start()