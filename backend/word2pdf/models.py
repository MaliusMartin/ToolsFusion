from django.db import models

class FileConversionD2P(models.Model):
    uploaded_file = models.FileField(upload_to="uploaded_files/")
    converted_file = models.FileField(upload_to="converted_files/", blank=True, null=True)
    conversion_type = models.CharField(max_length=50, default="Word to PDF")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversion: {self.conversion_type} - {self.uploaded_file.name}"

class FileConversionP2D(models.Model):
    uploaded_file = models.FileField(upload_to="uploaded_files/")
    converted_file = models.FileField(upload_to="converted_files/", blank=True, null=True)
    conversion_type = models.CharField(max_length=50, default="PDF to word")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversion: {self.conversion_type} - {self.uploaded_file.name}"