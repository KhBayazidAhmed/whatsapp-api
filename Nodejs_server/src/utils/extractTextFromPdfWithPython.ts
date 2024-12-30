import logger from "./logger.js";

async function extractTextFromBase64(pdfBase64: string): Promise<any | null> {
  const PYTHON_SERVICE_URL = process.env.PYTHON_URL;
  try {
    const response = await fetch(`${PYTHON_SERVICE_URL}/process_pdf_base64`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pdf_base64: pdfBase64 }),
    });

    if (!response.ok) {
      logger.error(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error while calling Flask API:", error.message);
    }
    throw error;
  }
}

export default extractTextFromBase64;
