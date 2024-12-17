import base64
from flask import Flask, request, jsonify
import fitz  
import pytesseract
import pdf2image
from PIL import Image, ImageEnhance, ImageFilter

app = Flask(__name__)

# Function to extract text from PDF using PyMuPDF and OCR
def extract_text_from_pdf(pdf_bytes):
    text = ""
    pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
    
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        page_text = page.get_text()
        
        if page_text.strip():
            text += page_text
        else:
            # Fallback to OCR for this page if text is empty
            ocr_text = extract_text_from_images(pdf_bytes, page_num)
            text += ocr_text
    
    return text

# Preprocess images to enhance OCR accuracy
def preprocess_image(image):
    image = image.convert("L")  # Convert to grayscale
    image = image.filter(ImageFilter.SHARPEN)  # Sharpen image
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2)  # Increase contrast
    return image

# Function to extract text from images in the PDF using Tesseract
def extract_text_from_images(pdf_bytes, specific_page=None):
    text = ""
    
    # Convert PDF bytes to PIL images
    pages = pdf2image.convert_from_bytes(pdf_bytes, 300)
    
    if specific_page is not None:
        pages = [pages[specific_page]]  # Process only one page
    
    for page in pages:
        preprocessed_image = preprocess_image(page)
        page_text = pytesseract.image_to_string(preprocessed_image, lang='eng+ben')
        text += page_text
    
    return text

# API to process base64 PDF
@app.route('/process_pdf_base64', methods=['POST'])
def process_pdf_base64():
    # Get the base64-encoded PDF from the request
    data = request.get_json()
    if 'pdf_base64' not in data:
        return jsonify({"error": "No PDF base64 provided"}), 400
    
    pdf_base64 = data['pdf_base64']
    
    try:
        # Decode the base64 PDF
        pdf_bytes = base64.b64decode(pdf_base64)
        
        # Extract text and images
        text = extract_text_from_pdf(pdf_bytes)
        
        return jsonify({
            "text": text,
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
