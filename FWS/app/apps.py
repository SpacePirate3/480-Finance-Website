import os

from django.apps import AppConfig


class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'
    def ready(self):
        from . import jobs
        if os.environ.get('RUN_MAIN', None) != 'true':
            jobs.start_scheduler()