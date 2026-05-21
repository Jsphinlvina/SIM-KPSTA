from django.core.files.storage import default_storage


def save(uploaded_file, subdir='documents'):
    path = default_storage.save(f'{subdir}/{uploaded_file.name}', uploaded_file)
    return {
        'name': uploaded_file.name,
        'path': path,
        'url': default_storage.url(path),
    }


def delete(path):
    if path and default_storage.exists(path):
        default_storage.delete(path)
