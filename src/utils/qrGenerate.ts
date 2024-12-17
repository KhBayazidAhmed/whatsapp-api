import QRCode from "qrcode";
// Function to generate a Base64 QR code
async function generateQRCode(data: string) {
  try {
    // Generate QR code as a Base64 string
    const base64Image = await QRCode.toDataURL(data);
    // Optionally, remove the Base64 prefix to get only the image data
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    return base64Data;
  } catch (err) {
    console.error("Error generating QR Code:", err);
    return "";
  }
}

export default generateQRCode;
