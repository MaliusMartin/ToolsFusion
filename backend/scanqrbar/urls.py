from django.urls import path
from .views import scan_image

urlpatterns = [
    path('scan/', scan_image, name='scan_image'),
]
