import { ParsedData } from "./formatTheString.js";
import { Page } from "puppeteer"; // Assuming Puppeteer is used for the client
import getAddressString from "./helper/makingAddress.js";
import { Client, MessageMedia } from "whatsapp-web.js";
import path from "path";
import extractAndSaveImages from "./extractImageFromPdf.js";

type UserData = {
  nameEnglish: string;
  nameBangla: string;
  fatherName: string;
  motherName: string;
  nationalId: string;
  address: string;
  bloodGroup?: string;
  birthPlace: string;
  userImage: string; // URL or base64
  userSign: string; // URL or base64
  dateOfBirth: string; // Date string, ISO format
  pin: string;
};
declare global {
  interface Window {
    barCodeGenerateForNid: (param: string) => void;
  }
}

export default async function generatePDF(
  parsedData: ParsedData,
  client: Client,
  media: MessageMedia
): Promise<string> {
  console.log("Generating PDF...");

  // getting address
  const AddressObj =
    parsedData.voterAt === "present"
      ? parsedData.presentAddress
      : parsedData.permanentAddress;
  const addressString = getAddressString(AddressObj);
  const images = await extractAndSaveImages(
    new Uint8Array(Buffer.from(media.data, "base64"))
  );
  const userData: UserData = {
    ...parsedData,
    address: addressString,
    userImage: getImageBase64(images[0]), // URL or base64
    userSign: getImageBase64(images[1]), // URL or base64
  };
  const __dirname = path.resolve();
  const page = (await client?.pupBrowser?.newPage()) as Page;
  try {
    // Create a new page for each request
    // Load HTML template
    const filePath = path.resolve(__dirname, "./htmlNidTemplate/index.html"); // Adjust the path if necessary
    await page.goto(`file://${filePath}`, {
      waitUntil: "networkidle0",
    });

    // Inject user data into the page
    await page.evaluate((user) => {
      document.getElementById("nameEnglish")!.innerHTML = user.nameEnglish;
      document.getElementById("nameBangla")!.innerHTML = user.nameBangla;
      document.getElementById("fatherName")!.innerHTML = user.fatherName;
      document.getElementById("motherName")!.innerHTML = user.motherName;
      document.getElementById("nidNumber")!.innerHTML = user.nationalId;
      document.getElementById("address")!.innerHTML = user.address
        .replaceAll("\n", " ")
        .trim();
      document.getElementById("bloodGroup")!.innerHTML = user.bloodGroup || "";
      document.getElementById("birthPlace")!.innerHTML = user.birthPlace;
      document.getElementById("userPhoto")!.setAttribute("src", user.userImage); // Ensure userImage is base64 or URL
      document.getElementById("userSign")!.setAttribute("src", user.userSign); // Ensure userSign is base64 or URL
      document.getElementById("dateOfBirth")!.innerHTML = user.dateOfBirth;

      // Function to adjust text size
      function fitTextToContainer(con: string, textEle: string) {
        const container = document.getElementById(con);
        const text = document.getElementById(textEle);

        if (!container || !text) return; // Ensure the elements exist

        let fontSize = textEle === "nameBangla" ? 18 : 14; // Start with a base font size
        text.style.fontSize = fontSize + "px";
        text.style.whiteSpace = "nowrap"; // Ensure no line wrapping

        while (
          text.offsetWidth > container.clientWidth || // Compare text width with container width
          text.offsetHeight > container.clientHeight // Compare text height with container height
        ) {
          fontSize--; // Reduce font size
          text.style.fontSize = fontSize + "px";
          console.log(fontSize);
          if (fontSize <= 0) {
            console.warn("Font size reached zero; text may not fit.");
            break; // Prevent infinite loop in extreme cases
          }
        }
      }
      if (typeof window.barCodeGenerateForNid === "function") {
        window.barCodeGenerateForNid(
          `<pin>${user.pin}</pin><name>${user.nameEnglish}</name><DOB>${user.dateOfBirth}</DOB><FP></FP><F>Right Index</F><TYPE></TYPE><V>2.0</V> <ds>302c0214103fc01240542ed736c0b48858c1c03d80006215021416e73728de9618fedcd368c88d8f3a2e72096d</ds>`
        );
      }
      // Call it immediately after data injection
      fitTextToContainer("english_name_container", "nameEnglish");
      fitTextToContainer("bangla_name_container", "nameBangla");
    }, userData);

    // Generate PDF as a buffer
    const pdfBuffer: Buffer = await page.pdf({ format: "A4" });

    // Convert the PDF buffer to base64
    const base64PDF = pdfBuffer.toString("base64");

    console.log("Returning the base64 string.");
    // Return the base64 string
    return base64PDF;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    await page.close(); // Always close the page even if pdfPage is undefined
  }
}
const getImageBase64 = (image: { base64: string; filename: string }) => {
  if (!image || !image.base64) {
    throw new Error("Invalid image data");
  }
  return `data:image/png;base64,${image.base64}`;
};
