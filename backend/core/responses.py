from rest_framework import status as http_status
from rest_framework.response import Response


def ok(data=None, message='', status=http_status.HTTP_200_OK):
    return Response({'success': True, 'data': data, 'message': message}, status=status)


def created(data=None, message='Berhasil dibuat'):
    return ok(data, message, status=http_status.HTTP_201_CREATED)


def fail(message, errors=None, status=http_status.HTTP_400_BAD_REQUEST):
    body = {'success': False, 'data': None, 'message': message}
    if errors is not None:
        body['errors'] = errors
    return Response(body, status=status)
