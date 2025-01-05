import { getDocument, OPS, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import sharp from "sharp";

// Type to represent extracted image data
interface ExtractedImage {
  base64: string;
  filename: string;
}

// Function to extract image from PDF page and convert to base64 using sharp
async function extractImageBase64(
  img: any,
  name: string
): Promise<string | null> {
  const { width, height, data } = img;
  const bytes = data.length;
  const channels = bytes / (width * height);

  // Skip unsupported image formats
  if (![1, 3, 4].includes(channels)) {
    console.warn(
      `Skipping unsupported image channel count: ${channels} for ${name}`
    );
    return null;
  }

  try {
    const base64 = await sharp(data, {
      raw: { width, height, channels: channels as 1 | 3 | 4 | 2 },
    })
      .png({ quality: 60, compressionLevel: 9 })
      .toBuffer()
      .then((buffer) => buffer.toString("base64"));
    return base64;
  } catch (err: any) {
    console.error(`Error converting image ${name} to base64:`, err.message);
    return null;
  }
}

// Function to handle the extraction of all images from a given PDF page
async function extractImagesFromPage(
  page: PDFPageProxy,
  images: ExtractedImage[]
): Promise<void> {
  const ops = await page.getOperatorList();

  // Loop over each operation and process images sequentially
  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject) {
      const name: string = ops.argsArray[i][0];
      let img = page.commonObjs.has(name)
        ? page.commonObjs.get(name)
        : page.objs.get(name);

      try {
        if (!img || !img.data) {
          console.warn(`Image ${name} not resolved yet.`);
          continue; // Skip this iteration if the image is not ready
        }

        const base64 = await extractImageBase64(img, name);
        if (base64) {
          images.push({
            base64,
            filename: `${name}.png`,
          });
          console.log(`Image ${name} extracted successfully.`);
        }
      } catch (innerError: any) {
        console.error(`Error processing image ${name}:`, innerError.message);
      }
    }
  }
}

// Main function to extract images from the PDF document
export default async function extractAndSaveImages(
  pdfBuffer: Uint8Array
): Promise<ExtractedImage[]> {
  const images: ExtractedImage[] = [];
  console.log("PDF image extraction started...");

  try {
    // Load the PDF document
    const doc: PDFDocumentProxy = await getDocument({ data: pdfBuffer })
      .promise;

    const pageCount = doc.numPages;
    console.log(`PDF loaded successfully with ${pageCount} page(s).`);

    // Loop through all pages in the PDF and extract images sequentially
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page: PDFPageProxy = await doc.getPage(pageNum);
      await extractImagesFromPage(page, images); // Extract images from the current page
    }

    console.log(`Image extraction completed. Total images: ${images.length}`);
  } catch (error: any) {
    console.error("Error while extracting images from PDF:", error.message);
    throw error;
  }

  return images;
}
