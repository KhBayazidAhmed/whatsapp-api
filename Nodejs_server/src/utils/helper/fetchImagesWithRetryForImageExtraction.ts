import logger from "../logger.js";

type apiResponseImagExtraction = {
  message?: string;
  images?: ExtractedImage[];
  error?: string;
  details?: string;
};

interface ExtractedImage {
  base64: string;
  filename: string;
}

const fetchImagesWithRetry = async (
  pdfBase64: string,
  retries: number = 3
): Promise<apiResponseImagExtraction | null> => {
  const IMAGE_API_URL = process.env.IMAGE_API_URL || "http://127.0.0.1:4000";

  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await fetch(`${IMAGE_API_URL}/extract-images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfBase64: pdfBase64 }),
      });

      if (!response.ok) {
        logger.error(`Failed to fetch images. Status: ${response.status}`);
        return null;
      }

      const images = (await response.json()) as apiResponseImagExtraction;

      if (images.images) {
        return images;
      }
    } catch (error) {
      logger.error(`Request failed on attempt ${attempt + 1}: ${error}`);
    }

    attempt++;
    if (attempt < retries) {
      logger.info(`Retrying... (${attempt + 1}/${retries})`);
    }
  }

  logger.error("Max retries reached, no images found.");
  return null;
};

export default fetchImagesWithRetry;
