import fitz  # PyMuPDF

# Open the PDF file
pdf_document = fitz.open("sample.pdf")

# Access the first page (you can choose any page where the image is located)
page = pdf_document[0]

# Coordinates (x, y) where you want to add the credit text (this should be adjusted based on the position of the image)
x, y = 100, 100  # You may need to change these coordinates

# Add credit text on top of the image
credit_text = "Image Credit: Your Name or Source"

# You can customize the font and size
page.insert_text((x, y), credit_text, fontsize=12, color=(0, 0, 0))  # (0, 0, 0) is black

# Save the modified PDF
pdf_document.save("edited_sample_with_credit.pdf")
