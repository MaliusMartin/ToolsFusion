from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .models import Note, Notification, Feedback
from .serializers import NoteSerializer, NotificationSerializer,  FeedbackSerializer




class NoteViewSet(ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class NotificationViewSet(ModelViewSet):
    queryset = Notification.objects.filter(is_active=True)  # Only active notifications
    serializer_class = NotificationSerializer

class FeedbackView(APIView):
    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Feedback submitted successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
