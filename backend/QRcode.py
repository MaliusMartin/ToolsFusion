import qrcode

# Information to encode in the QR code
data = "https://www.django-rest-framework.org/tutorial/quickstart/#serializers"

# Create the QR code object
qr = qrcode.QRCode(
    version=1,  # Adjust version for larger data or error correction if needed
    error_correction=qrcode.constants.ERROR_CORRECT_L,  # Adjust error correction level
    box_size=10,  # Adjust pixel size for smaller or larger QR code
)

# Add data to the QR code
qr.add_data(data)
qr.make(fit=True)  # Make sure the data fits in the QR code

# Create an image from the QR code data
img = qr.make_image(fill_color="black", back_color="white")

# Save the image to a file
img.save("qr_code2.png")

print("QR code generated successfully!")
