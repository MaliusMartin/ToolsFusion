from django.contrib import admin
from .models import Barcode

@admin.register(Barcode)
class BarcodeAdmin(admin.ModelAdmin):
    list_display = ('data', 'barcode_type', 'created_at')
    search_fields = ('data',)
    list_filter = ('barcode_type', 'created_at')
