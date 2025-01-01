from rest_framework import serializers
from .models import ScannedCode

class ScannedCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScannedCode
        fields = '__all__'
