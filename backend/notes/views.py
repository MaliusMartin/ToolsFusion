from rest_framework.viewsets import ModelViewSet
from .models import Note, Notification
from .serializers import NoteSerializer, NotificationSerializer

class NoteViewSet(ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class NotificationViewSet(ModelViewSet):
    queryset = Notification.objects.filter(is_active=True)  # Only active notifications
    serializer_class = NotificationSerializer
