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
  console.log(IMAGE_API_URL);
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
      const images = (await response.json()) as apiResponseImagExtraction;

      if (images.images) {
        return images;
      } else {
        console.log("No images found, retrying...");
      }
    } catch (error) {
      console.log("Request failed, retrying...", error);
    }
    attempt++;
    if (attempt < retries) {
      console.log(`Retrying... (${attempt + 1}/${retries})`);
    }
  }
  console.log("Max retries reached, no images found.");
  return null;
};
export default fetchImagesWithRetry;
