import uuid
from pathlib import Path

from django.conf import settings

SUBDIR = 'documents'


def save(uploaded_file):
    target_dir = Path(settings.MEDIA_ROOT) / SUBDIR
    target_dir.mkdir(parents=True, exist_ok=True)

    stored_name = f'{uuid.uuid4().hex}_{uploaded_file.name}'
    target_path = target_dir / stored_name
    with open(target_path, 'wb') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)

    file_url = f'{settings.MEDIA_URL}{SUBDIR}/{stored_name}'
    return uploaded_file.name, file_url
