from django.db import models

class Barcode(models.Model):
    BARCODE_TYPES = [
        ('aztec', 'AZTEC'),
        ('ean13', 'EAN-13'),
        ('ean8', 'EAN-8'),
        ('upca', 'UPC-A'),
        ('upce', 'UPC-E'),
        ('code39', 'Code 39'),
        ('code93', 'Code 93'),
        ('code128', 'Code 128'),
        ('itf', 'ITF'),
        ('isbn10', 'ISBN-10'),
        ('isbn13', 'ISBN-13'),
        ('issn', 'ISSN'),
        ('msi', 'MSI'),
        ('pharmacode', 'Pharmacode'),
        ('codabar', 'Codabar'),
        ('data_matrix', 'Data Matrix'),
    ]

    data = models.CharField(max_length=255, help_text="Data encoded in the barcode")
    barcode_type = models.CharField(
        max_length=20, 
        choices=BARCODE_TYPES, 
        default='code128', 
        help_text="Type of the barcode (e.g., Code 128)"
    )
    image = models.ImageField(upload_to='barcodes/', blank=True, null=True, help_text="Generated barcode image")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_barcode_type_display()} - {self.data}"
