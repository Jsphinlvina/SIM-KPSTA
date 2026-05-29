from django.db.models import Q

from apps.archive.models import ArchiveRecord


def search(keyword):
    if not keyword:
        return ArchiveRecord.objects.none()
    return ArchiveRecord.objects.filter(
        Q(title__icontains=keyword) | Q(source_type__icontains=keyword),
    )
