class ScheduleState:
    name = None

    def start(self, event):
        raise NotImplementedError

    def complete(self, event):
        raise NotImplementedError

    def cancel(self, event):
        raise NotImplementedError

    def reschedule(self, event):
        raise NotImplementedError
