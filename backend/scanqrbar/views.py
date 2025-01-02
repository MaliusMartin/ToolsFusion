import cv2
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.conf import settings

@csrf_exempt
def scan_image(request):
    if request.method == "POST" and request.FILES.get('image'):
        try:
            # Save uploaded image temporarily
            uploaded_image = request.FILES['image']
            temp_path = default_storage.save(uploaded_image.name, uploaded_image)
            temp_full_path = os.path.join(settings.MEDIA_ROOT, temp_path)

            # Load the image using OpenCV
            image = cv2.imread(temp_full_path)

            # Initialize results
            results = {
                "qr_code": None,
                "barcode": None,
            }

            # QR Code Detection
            qr_detector = cv2.QRCodeDetector()
            qr_data, qr_bbox, _ = qr_detector.detectAndDecode(image)
            if qr_data:
                results["qr_code"] = {"data": qr_data, "bbox": qr_bbox.tolist() if qr_bbox is not None else None}

            # Barcode Detection
            barcode_detector = cv2.barcode_BarcodeDetector()
            barcode_result = barcode_detector.detectAndDecode(image)

            # Adjust for three return values
            if len(barcode_result) == 3:
                ok, barcodes, points = barcode_result
                if ok and barcodes:
                    results["barcode"] = [
                        {"data": barcodes[i], "points": points[i].tolist() if points[i] is not None else None}
                        for i in range(len(barcodes))
                    ]

            # Clean up the temporary file
            default_storage.delete(temp_path)

            # Check if any code was detected
            if results["qr_code"] or results["barcode"]:
                return JsonResponse({"success": True, "results": results})
            else:
                return JsonResponse({"success": False, "error": "No QR code or barcode found"})

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Invalid request method or no image provided"}, status=400)

































# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.core.files.storage import default_storage
# from pyzbar.pyzbar import decode
# from PIL import Image
# import os
# from .models import ScannedCode

# @csrf_exempt
# def scan_image(request):
#     if request.method == "POST" and request.FILES.get('image'):
#         try:
#             # Save uploaded image
#             uploaded_image = request.FILES['image']
#             temp_path = default_storage.save(uploaded_image.name, uploaded_image)
            
#             # Open and decode image
#             image_path = os.path.join(default_storage.location, temp_path)
#             image = Image.open(image_path)
#             decoded_objects = decode(image)
#             ScannedCode.objects.create(data=decoded_objects[0].data.decode('utf-8'), image=temp_path)

#             # Process decoded data
#             if decoded_objects:
#                 data = decoded_objects[0].data.decode('utf-8')  # Get the first decoded result
#                 os.remove(image_path)  # Clean up the temporary file
#                 return JsonResponse({"success": True, "data": data})
#             else:
#                 os.remove(image_path)  # Clean up the temporary file
#                 return JsonResponse({"success": False, "error": "No valid QR or barcode found"}, status=400)
#         except Exception as e:
#             return JsonResponse({"success": False, "error": str(e)}, status=500)
#     return JsonResponse({"success": False, "error": "Invalid request method or no image provided"}, status=400)











