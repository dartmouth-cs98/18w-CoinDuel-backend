from apscheduler.schedulers.blocking import BlockingScheduler

sched = BlockingScheduler()

@sched.scheduled_job('cron', day_of_week='mon', hour=9)
def scheduled_job():
    print('Game starts Monday at 9am.')

sched.start()
