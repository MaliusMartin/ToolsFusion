from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from pyzbar.pyzbar import decode
from PIL import Image
import os
from .models import ScannedCode

@csrf_exempt
def scan_image(request):
    if request.method == "POST" and request.FILES.get('image'):
        try:
            # Save uploaded image
            uploaded_image = request.FILES['image']
            temp_path = default_storage.save(uploaded_image.name, uploaded_image)
            
            # Open and decode image
            image_path = os.path.join(default_storage.location, temp_path)
            image = Image.open(image_path)
            decoded_objects = decode(image)
            ScannedCode.objects.create(data=decoded_objects[0].data.decode('utf-8'), image=temp_path)

            # Process decoded data
            if decoded_objects:
                data = decoded_objects[0].data.decode('utf-8')  # Get the first decoded result
                os.remove(image_path)  # Clean up the temporary file
                return JsonResponse({"success": True, "data": data})
            else:
                os.remove(image_path)  # Clean up the temporary file
                return JsonResponse({"success": False, "error": "No valid QR or barcode found"}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
    return JsonResponse({"success": False, "error": "Invalid request method or no image provided"}, status=400)
