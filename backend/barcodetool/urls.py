from django.urls import path
from . import views

urlpatterns = [
    path('generate-barcode/', views.generate_barcode, name='generate_barcode'),
]
