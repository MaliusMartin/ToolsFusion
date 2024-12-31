from rest_framework import serializers

from .models import QRC

class QRCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRC
        fields = '__all__'  
# Compare this snippet from qrcode/urls.py:
