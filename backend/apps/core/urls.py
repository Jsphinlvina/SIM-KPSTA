from django.urls import path
from .views import DummyTopicView

urlpatterns = [
    path('topics/', DummyTopicView.as_view(), name='dummy-topics'),
]