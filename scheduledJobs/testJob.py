from apscheduler.schedulers.blocking import BlockingScheduler

sched = BlockingScheduler()

@sched.scheduled_job('cron', day_of_week='mon', hour=1)
def scheduled_job():
    print('Testing a job that starts on Mondays at 1am.')

@sched.scheduled_job('cron', day_of_week='mon', hour=6)
def scheduled_job():
    print('Testing a job that starts on Mondays at 6am UTC.')

sched.start()
