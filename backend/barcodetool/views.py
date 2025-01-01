from io import BytesIO
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import barcode
from barcode.writer import ImageWriter
from .models import Barcode

@csrf_exempt
def generate_barcode(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            data = body.get('data', '')
            if not data:
                return JsonResponse({"error": "No data provided"}, status=400)

            # Generate barcode
            barcode_format = barcode.get_barcode_class('code128')  # Code 128 as an example
            buffer = BytesIO()
            writer = ImageWriter()  # Generates the barcode as an image
            barcode_instance = barcode_format(data, writer=writer)
            barcode_instance.write(buffer)
            Barcode.objects.create(data=data)
            # Prepare response
            buffer.seek(0)
            return HttpResponse(buffer, content_type="image/png")
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
