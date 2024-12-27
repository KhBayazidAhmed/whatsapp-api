import { Client } from "whatsapp-web.js";
import path from "path";
import logger from "./logger.js";

type UserData = {
  nameEnglish: string;
  nameBangla: string;
  fatherName: string;
  motherName: string;
  nationalId: string;
  nidAddress: string;
  bloodGroup?: string;
  birthPlace: string;
  userImage: string;
  userSign?: string;
  dateOfBirth: string;
  pin: string;
};

declare global {
  interface Window {
    barCodeGenerateForNid: (param: string) => void;
  }
}

export default async function generatePDF(
  userData: UserData,
  client: Client
): Promise<string> {
  const __dirname = path.resolve();
  const page = client?.pupBrowser?.newPage
    ? await client?.pupBrowser?.newPage()
    : null;

  if (!page) {
    logger.error("Failed to create a new Puppeteer page.");
    throw new Error("Failed to create a new Puppeteer page.");
  }

  try {
    const filePath = path.resolve(__dirname, "./htmlNidTemplate/index.html");
    await page.goto(`file://${filePath}`, { waitUntil: "networkidle0" });

    await page.evaluate((user) => {
      document.getElementById("nameEnglish")!.innerHTML =
        user.nameEnglish.replaceAll("\n", " ");
      document.getElementById("nameBangla")!.innerHTML =
        user.nameBangla.replaceAll("\n", " ");
      document.getElementById("fatherName")!.innerHTML =
        user.fatherName.replaceAll("\n", " ");
      document.getElementById("motherName")!.innerHTML =
        user.motherName.replaceAll("\n", " ");
      document.getElementById("nidNumber")!.innerHTML =
        user.nationalId.replaceAll("\n", " ");
      document.getElementById("address")!.innerHTML = user.nidAddress
        .replaceAll("\n", " ")
        .trim();
      document.getElementById("bloodGroup")!.innerHTML = user.bloodGroup || "";
      document.getElementById("birthPlace")!.innerHTML =
        user.birthPlace.replaceAll("\n", " ");
      document.getElementById("userPhoto")!.setAttribute("src", user.userImage);
      document.getElementById("dateOfBirth")!.innerHTML =
        user.dateOfBirth.replaceAll("\n", " ");
      const userSignElement = document.getElementById("userSign");
      if (userSignElement) {
        if (user.userSign) {
          userSignElement.setAttribute("src", user.userSign);
          userSignElement.style.display = "block";
        } else {
          userSignElement.style.display = "none";
        }
      }

      // Barcode generation
      if (typeof window.barCodeGenerateForNid === "function") {
        window.barCodeGenerateForNid(
          `<pin>${user.pin}</pin><name>${user.nameEnglish}</name><DOB>${user.dateOfBirth}</DOB><FP></FP><F>Right Index</F><TYPE></TYPE><V>2.0</V> <ds>302c0214103fc01240542ed736c0b48858c1c03d80006215021416e73728de9618fedcd368c88d8f3a2e72096d</ds>`
        );
      }

      function fitTextToContainer(con: string, textEle: string) {
        const container = document.getElementById(con);
        const text = document.getElementById(textEle);
        if (!container || !text) return;

        // Set an initial font size in pt based on the element
        let fontSize = textEle === "nameBangla" ? 12.4 : 10.2; // Start font size in pt
        text.style.fontSize = fontSize + "pt"; // Apply initial font size
        // Reduce font size until the text fits within the container
        while (
          text.offsetWidth > container.clientWidth || // Check if text overflows width
          text.offsetHeight > container.clientHeight // Check if text overflows height
        ) {
          fontSize -= 0.1; // Decrease font size in 0.1pt increments
          text.style.fontSize = fontSize + "pt"; // Apply updated font size

          // Prevent infinite loop if text cannot fit
          if (fontSize <= 0.1) {
            break;
          }
        }
      }

      // Apply the function to the containers and elements
      fitTextToContainer("english_name_container", "nameEnglish");
      fitTextToContainer("bangla_name_container", "nameBangla");
    }, userData);

    const pdfBuffer: Buffer = await page.pdf({
      omitBackground: true,
    });
    return pdfBuffer.toString("base64");
  } catch (error) {
    logger.error("Error generating PDF:", error);
    throw error;
  } finally {
    await page.close();
  }
}
