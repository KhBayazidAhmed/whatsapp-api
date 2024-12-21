async function extractTextFromBase64(pdfBase64: string): Promise<any | null> {
  const PYTHON_SERVICE_URL = process.env.PYTHON_URL || "http://127.0.0.1:8000";
  console.log(PYTHON_SERVICE_URL);
  try {
    const response = await fetch(`${PYTHON_SERVICE_URL}/process_pdf_base64`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pdf_base64: pdfBase64 }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error while calling Flask API:", error.message);
    }
    throw error;
  }
}
export default extractTextFromBase64;
