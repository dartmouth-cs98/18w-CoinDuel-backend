from apscheduler.schedulers.blocking import BlockingScheduler

sched = BlockingScheduler()

@sched.scheduled_job('cron', day_of_week='mon', hour=1, minute=5)
def scheduled_job1():
    print('Testing a job that starts on Mondays at 1am.')

@sched.scheduled_job('cron', day_of_week='mon', hour=6, minute=5)
def scheduled_job2():
    print('Testing a job that starts on Mondays at 6am UTC.')

sched.start()
