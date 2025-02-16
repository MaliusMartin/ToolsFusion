from django.db import models

class QRC(models.Model):
    data = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.data[:100]

