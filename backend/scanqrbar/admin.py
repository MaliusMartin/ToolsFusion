from django.contrib import admin
from .models import ScannedCode


class ScannedCodeAdmin(admin.ModelAdmin):
    list_display = ('data', 'created_at')
    search_fields = ('data', 'created_at')
    list_filter = ('created_at',)


admin.site.register(ScannedCode, ScannedCodeAdmin)