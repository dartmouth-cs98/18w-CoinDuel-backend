from apscheduler.schedulers.blocking import BlockingScheduler

sched = BlockingScheduler()

@sched.scheduled_job('cron', day_of_week='fri', hour=17)
def scheduled_job():
    print('Game ends Friday at 5pm.')

sched.start()
