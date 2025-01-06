from .models import FileConversionD2P, FileConversionP2D

from rest_framework import serializers

class FileConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileConversionD2P
        fields = "__all__"

class FileConversionP2DSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileConversionP2D
        fields = "__all__"