from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, NotificationViewSet

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]
