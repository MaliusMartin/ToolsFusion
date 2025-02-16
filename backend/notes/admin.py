from django.contrib import admin
from .models import Note, Notification, Feedback

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at')
    search_fields = ('title',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title',)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'email','message', 'created_at')
    search_fields = ('name', 'email')

admin.site.site_header = "My Notes Admin"
admin.site.site_title = "My Notes Admin Portal"


