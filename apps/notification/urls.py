from django.urls import path

from .views import (
    DeleteNotificationView,
    MarkAllAsReadView,
    MarkAsReadView,
    NotificationListView,
    UnreadNotificationListView,
)

urlpatterns = [
    path('', NotificationListView.as_view()),
    path('unread/', UnreadNotificationListView.as_view()),
    path('mark-all-as-read/', MarkAllAsReadView.as_view()),
    path('<int:notification_id>/mark-as-read/', MarkAsReadView.as_view()),
    path('<int:notification_id>/', DeleteNotificationView.as_view()),
]
