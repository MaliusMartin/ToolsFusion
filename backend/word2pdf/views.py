import os
from io import BytesIO
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.conf import settings
from docx import Document
from reportlab.pdfgen import canvas
from pdf2docx import Converter
from .models import FileConversionD2P, FileConversionP2D


@csrf_exempt
def word_to_pdf(request):
    if request.method == "POST" and request.FILES.get('file'):
        try:
            # Save the uploaded Word file temporarily
            uploaded_file = request.FILES['file']
            if not uploaded_file.name.endswith('.docx'):
                return JsonResponse({"success": False, "error": "Invalid file format. Please upload a .docx file."})

            temp_path = default_storage.save(uploaded_file.name, uploaded_file)
            temp_full_path = os.path.join(settings.MEDIA_ROOT, temp_path)

            # Load the Word document
            doc = Document(temp_full_path)
            content = ""
            for paragraph in doc.paragraphs:
                content += paragraph.text + "\n"

            # Create a PDF from the content
            pdf_buffer = BytesIO()
            pdf = canvas.Canvas(pdf_buffer)
            pdf.drawString(100, 800, "Word-to-PDF Conversion")  # Title
            y = 750
            for line in content.split("\n"):
                pdf.drawString(100, y, line)
                y -= 15  # Move down for each line
                if y < 50:  # Avoid writing below the page
                    pdf.showPage()
                    y = 750

            pdf.save()
            pdf_buffer.seek(0)

            # Clean up the temporary Word file
            default_storage.delete(temp_path)

            # Return the PDF as a response
            response = HttpResponse(pdf_buffer, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="converted.pdf"'
            return response

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Invalid request method or no file provided"}, status=400)



@csrf_exempt
def pdf_to_word(request):
    if request.method == "POST" and request.FILES.get('file'):
        try:
            print("File Received:", request.FILES.get('file'))
            # Save the uploaded PDF file
            uploaded_file = request.FILES['file']
            temp_pdf_path = default_storage.save(uploaded_file.name, uploaded_file)

            # Define paths for the Word output
            temp_word_path = f"{default_storage.location}/converted_{uploaded_file.name}.docx"

            # Convert PDF to Word
            converter = Converter(temp_pdf_path)
            converter.convert(temp_word_path, start=0, end=None)  # Convert entire PDF
            converter.close()

            # Save the converted Word file in the database
            conversion_entry = FileConversionP2D.objects.create(
                uploaded_file=uploaded_file,
                conversion_type="PDF to Word"
            )
            with open(temp_word_path, "rb") as word_file:
                conversion_entry.converted_file.save(f"converted_{uploaded_file.name}.docx", word_file)
            conversion_entry.save()

            # Clean up temporary files
            os.remove(temp_pdf_path)
            os.remove(temp_word_path)

            return JsonResponse({
                "success": True,
                "uploaded_file": conversion_entry.uploaded_file.url,
                "converted_file": conversion_entry.converted_file.url,
            })
        except Exception as e:
            print("Error:", str(e))  # Add this line for debugging
            return JsonResponse({"success": False, "error": str(e)}, status=500)
    else:
        print("File not found or invalid method")  # Add this line for debugging
        return JsonResponse({"success": False, "error": "Invalid request"})