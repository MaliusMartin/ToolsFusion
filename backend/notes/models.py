from django.db import models

class Note(models.Model):
    title = models.CharField(max_length=100)  # e.g., "EAN13 Barcode"
    image = models.ImageField(upload_to='notes/', blank=True, null=True)  # Image of the note
    description = models.TextField()          # Detailed explanation
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Notification(models.Model):
    title = models.CharField(max_length=100)  # e.g., "System Update"
    message = models.TextField()              # Useful information or updates
    is_active = models.BooleanField(default=True)  # To control visibility
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
