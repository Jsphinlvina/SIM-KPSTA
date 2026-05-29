from apps.archive.models import ArchiveRecord
from apps.archive.patterns.state import get_state


def create_record(data):
    return ArchiveRecord.objects.create(
        source_type=data['source_type'],
        source_id=data['source_id'],
        title=data['title'],
        student_id=data.get('student_id'),
        lecturer_id=data.get('lecturer_id'),
        state=ArchiveRecord.STATE_ACTIVE,
    )


def list_records():
    return ArchiveRecord.objects.all()


def get_record(record_id):
    return ArchiveRecord.objects.filter(id=record_id).first()


def list_by_student(student_id):
    return ArchiveRecord.objects.filter(student_id=student_id)


def list_by_lecturer(lecturer_id):
    return ArchiveRecord.objects.filter(lecturer_id=lecturer_id)


def archive_record(record):
    get_state(record.state).archive(record)
    record.save()
    return record


def restore_record(record):
    get_state(record.state).restore(record)
    record.save()
    return record


def delete_record(record):
    get_state(record.state).delete(record)
    record.save()
    return record
