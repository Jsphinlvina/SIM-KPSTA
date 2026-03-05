from rest_framework.views import APIView
from rest_framework.response import Response

class DummyTopicView(APIView):
    def get(self, request):
        data = [
            {
                "id": 1,
                "title": "Sistem Informasi KP",
                "topic_type": "KP",
                "quota": 2
            }
        ]
        return Response(data)