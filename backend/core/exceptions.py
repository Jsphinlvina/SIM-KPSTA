from rest_framework.views import exception_handler


class DomainError(Exception):
    def __init__(self, message, errors=None):
        super().__init__(message)
        self.message = message
        self.errors = errors


class ScheduleConflictError(DomainError):
    pass


class InvalidStateTransitionError(DomainError):
    pass


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return None

    detail = response.data
    message = detail.get('detail') if isinstance(detail, dict) and 'detail' in detail else 'Permintaan tidak valid'
    errors = detail if not (isinstance(detail, dict) and set(detail.keys()) == {'detail'}) else None

    response.data = {
        'success': False,
        'data': None,
        'message': str(message),
    }
    if errors is not None:
        response.data['errors'] = errors
    return response
