from django.db import models

class ScannedCode(models.Model):
    image = models.ImageField(upload_to='uploads/')
    data = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.data
