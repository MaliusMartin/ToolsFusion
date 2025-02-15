from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('qrcodetool.urls')),
    path('', include('barcodetool.urls')),
    path('', include('scanqrbar.urls')),
    path('', include('word2pdf.urls')),
    path('', include('notes.urls')),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
