from .models import BRC
from rest_framework import serializers

class BarcodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BRC
        fields = '__all__'