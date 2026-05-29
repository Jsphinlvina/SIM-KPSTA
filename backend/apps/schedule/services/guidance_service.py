from apps.notification import events
from apps.notification.services import notification_service
from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.guidance_schedule_manager import GuidanceScheduleManager


def _notify_lecturer(event, event_name, message):
    notification_service.notify(event_name, {
        'user_id': event.lecturer_id,
        'message': message,
        'type': 'bimbingan',
    })


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


def create_schedule(data):
    event = GuidanceScheduleManager.get_instance().create_schedule(data)
    _notify_lecturer(
        event, events.GUIDANCE_SCHEDULE_CREATED,
        f'Jadwal bimbingan dibuat untuk {event.date} {event.time:%H:%M}.',
    )
    return event


def update_schedule(event, data):
    return GuidanceScheduleManager.get_instance().update_details(event, data)


def delete_schedule(event):
    event.delete()


def start_schedule(event):
    return GuidanceScheduleManager.get_instance().start_schedule(event)


def complete_schedule(event):
    event = GuidanceScheduleManager.get_instance().complete_schedule(event)
    _notify_lecturer(
        event, events.GUIDANCE_SCHEDULE_COMPLETED,
        f'Jadwal bimbingan pada {event.date} {event.time:%H:%M} telah diselesaikan.',
    )
    return event


def cancel_schedule(event):
    event = GuidanceScheduleManager.get_instance().cancel_schedule(event)
    _notify_lecturer(
        event, events.GUIDANCE_SCHEDULE_CANCELLED,
        f'Jadwal bimbingan pada {event.date} {event.time:%H:%M} dibatalkan.',
    )
    return event


def reschedule(event, new_date, new_time):
    event = GuidanceScheduleManager.get_instance().reschedule(event, new_date, new_time)
    _notify_lecturer(
        event, events.GUIDANCE_SCHEDULE_UPDATED,
        f'Jadwal bimbingan dijadwalkan ulang menjadi {event.date} {event.time:%H:%M}.',
    )
    return event
