class ScheduleState:
    name = None

    def handle_schedule(self, event):
        raise NotImplementedError

    def handle_cancel(self, event):
        raise NotImplementedError

    def handle_complete(self, event):
        raise NotImplementedError

    def handle_reschedule(self, event, new_date, new_time):
        raise NotImplementedError
