from django.contrib import admin
from .models import FileConversionD2P, FileConversionP2D


class FileConversionAdmin(admin.ModelAdmin):
    list_display = ('uploaded_file', 'converted_file', 'conversion_type', 'created_at')
    search_fields = ('uploaded_file', 'converted_file', 'conversion_type', 'created_at')
    list_filter = ('created_at',)
    readonly_fields = ('converted_file',)

class FileConversionP2DAdmin(admin.ModelAdmin):
    list_display = ('uploaded_file', 'converted_file', 'conversion_type', 'created_at')
    search_fields = ('uploaded_file', 'converted_file', 'conversion_type', 'created_at')
    list_filter = ('created_at',)
    readonly_fields = ('converted_file',)


admin.site.register(FileConversionD2P, FileConversionAdmin)
admin.site.register(FileConversionP2D, FileConversionP2DAdmin)