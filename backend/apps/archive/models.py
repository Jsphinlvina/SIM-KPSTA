from django.db import models


class ArchiveRecord(models.Model):
    SOURCE_DOCUMENT = 'document'
    SOURCE_SCHEDULE = 'schedule'
    SOURCE_CHOICES = (
        (SOURCE_DOCUMENT, 'Dokumen'),
        (SOURCE_SCHEDULE, 'Jadwal'),
    )

    STATE_ACTIVE = 'active'
    STATE_ARCHIVED = 'archived'
    STATE_DELETED = 'deleted'
    STATE_CHOICES = (
        (STATE_ACTIVE, 'Aktif'),
        (STATE_ARCHIVED, 'Diarsipkan'),
        (STATE_DELETED, 'Dihapus'),
    )

    source_type = models.CharField(max_length=16, choices=SOURCE_CHOICES)
    source_id = models.IntegerField()
    title = models.CharField(max_length=255)
    student_id = models.IntegerField(null=True, blank=True)
    lecturer_id = models.IntegerField(null=True, blank=True)
    state = models.CharField(max_length=16, choices=STATE_CHOICES, default=STATE_ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'ArchiveRecord(id={self.id}, source={self.source_type}:{self.source_id}, state={self.state})'
