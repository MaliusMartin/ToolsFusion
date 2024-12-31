from io import BytesIO
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import QRC 
import qrcode

@csrf_exempt
def generate_qr(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            data = body.get('data', '')
            if not data:
                return JsonResponse({"error": "No data provided"}, status=400)

            # Create QR code in database
            QRC.objects.create(data=data)  # Use the renamed model here

            # Generate the QR code
            from qrcode import QRCode as QRCodeGenerator  # Rename here
            qr = QRCodeGenerator(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(data)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")

            # Save QR code to memory
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            buffer.seek(0)
            
            return HttpResponse(buffer, content_type="image/png")
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)