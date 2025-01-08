from io import BytesIO
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import base64  # Import this for base64 encoding
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







#//////////////////////////////////////////////////////////////////////

#{Alternative to generate_qr json string response Generated a QR code from the input data.
# Converted this QR code into a PNG image.
# Encoded this image into base64 format.
# Returned this data in JSON format.}



# @csrf_exempt
# def generate_qr(request):
#     if request.method == "POST":
#         try:
#             body = json.loads(request.body)
#             data = body.get('data', '')
#             if not data:
#                 return JsonResponse({"error": "No data provided"}, status=400)

#             # Create QR code in database
#             QRC.objects.create(data=data)

#             # Generate the QR code
#             qr = qrcode.QRCode(
#                 version=1,
#                 error_correction=qrcode.constants.ERROR_CORRECT_L,
#                 box_size=10,
#                 border=4,
#             )
#             qr.add_data(data)
#             qr.make(fit=True)
#             img = qr.make_image(fill_color="black", back_color="white")

#             # Save QR code to memory
#             buffer = BytesIO()
#             img.save(buffer, format="PNG")
#             buffer.seek(0)

#             # Correctly encode the image data to base64
#             image_data = base64.b64encode(buffer.getvalue()).decode('utf-8')  # Decode to string

#             return JsonResponse({
#                 "qrCode": f"data:image/png;base64,{image_data}"
#             })
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)
#     else:
#         return JsonResponse({"error": "Invalid request method"}, status=405)

