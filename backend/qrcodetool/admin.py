from django.contrib import admin

# Register your models here.
from .models import QRC

class QRCodeAdmin(admin.ModelAdmin):
    list_display = ('data', 'created_at')
    search_fields = ('data', 'created_at')
    list_filter = ('created_at',)

admin.site.register(QRC)