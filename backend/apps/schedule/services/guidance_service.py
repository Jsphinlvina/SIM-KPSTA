from apps.notification import events
from apps.notification.services import notification_service
from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.guidance_schedule_manager import GuidanceScheduleManager


def _manager():
    return GuidanceScheduleManager.get_instance()


def _notify(event, notification_event, message):
    notification_service.notify(notification_event, {
        'user_id': event.lecturer_id,
        'message': message,
        'type': 'bimbingan',
    })


def create_schedule(data):
    event = _manager().create_schedule(data)
    _notify(event, events.GUIDANCE_SCHEDULE_CREATED,
            f'Jadwal bimbingan baru pada {event.date} {event.time:%H:%M}')
    return event


def list_schedules():
    return ScheduleEvent.objects.filter(event_type=ScheduleEvent.EVENT_GUIDANCE)


def get_schedule(schedule_id):
    return ScheduleEvent.objects.filter(
        id=schedule_id, event_type=ScheduleEvent.EVENT_GUIDANCE,
    ).first()


def list_by_bimbingan(bimbingan_aktif_id):
    return ScheduleEvent.objects.filter(
        event_type=ScheduleEvent.EVENT_GUIDANCE, bimbingan_aktif_id=bimbingan_aktif_id,
    )


def update_schedule(event, data):
    for field in ('location', 'notes'):
        if field in data:
            setattr(event, field, data[field])
    event.save()
    return event


def delete_schedule(event):
    event.delete()


def start_schedule(event):
    return _manager().start_schedule(event)


def complete_schedule(event):
    event = _manager().complete_schedule(event)
    _notify(event, events.GUIDANCE_SCHEDULE_COMPLETED,
            f'Bimbingan pada {event.date} {event.time:%H:%M} telah selesai')
    return event


def cancel_schedule(event):
    event = _manager().cancel_schedule(event)
    _notify(event, events.GUIDANCE_SCHEDULE_CANCELLED,
            f'Jadwal bimbingan pada {event.date} {event.time:%H:%M} dibatalkan')
    return event


def reschedule(event, new_date, new_time):
    event = _manager().reschedule(event, new_date, new_time)
    _notify(event, events.GUIDANCE_SCHEDULE_UPDATED,
            f'Jadwal bimbingan dipindah ke {event.date} {event.time:%H:%M}')
    return event
