from django.http import JsonResponse


def placeholder(_request):
    return JsonResponse({'success': True, 'data': None, 'message': 'notification endpoint diimplementasi minggu 2'})
