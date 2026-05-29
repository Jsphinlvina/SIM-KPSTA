from django.db import models


class ScheduleEvent(models.Model):
    EVENT_GUIDANCE = 'guidance'
    EVENT_DEFENSE = 'defense'
    EVENT_TYPE_CHOICES = (
        (EVENT_GUIDANCE, 'Bimbingan'),
        (EVENT_DEFENSE, 'Sidang'),
    )

    STATUS_SCHEDULED = 'scheduled'
    STATUS_ONGOING = 'ongoing'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_CHOICES = (
        (STATUS_SCHEDULED, 'Dijadwalkan'),
        (STATUS_ONGOING, 'Berlangsung'),
        (STATUS_COMPLETED, 'Selesai'),
        (STATUS_CANCELLED, 'Dibatalkan'),
    )

    bimbingan_aktif_id = models.IntegerField()
    lecturer_id = models.IntegerField()
    student_id = models.IntegerField(null=True, blank=True)
    coordinator_id = models.IntegerField(null=True, blank=True)
    event_type = models.CharField(max_length=16, choices=EVENT_TYPE_CHOICES, default=EVENT_GUIDANCE)
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=255, blank=True)
    meeting_link = models.CharField(max_length=500, blank=True, default='')
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_SCHEDULED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f'ScheduleEvent(id={self.id}, type={self.event_type}, status={self.status})'
