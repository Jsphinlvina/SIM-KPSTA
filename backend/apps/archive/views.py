from django.http import JsonResponse


def placeholder(_request):
    return JsonResponse({'success': True, 'data': None, 'message': 'archive app belum diimplementasi (Fitur 11)'})
