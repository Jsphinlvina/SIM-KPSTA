from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.topik.views import TopikViewSet, PeriodeSemesterViewSet

router = DefaultRouter()
router.register(r'periode-semester', PeriodeSemesterViewSet, basename='periode-semester')
router.register(r'', TopikViewSet, basename='topik')

urlpatterns = [
    path('', include(router.urls)),
]