import { ParsedData } from "./formatTheString.js";
import getAddressString from "./helper/makingAddress.js";
import { Client, MessageMedia } from "whatsapp-web.js";
import path from "path";
import fetchImagesWithRetry from "./helper/fetchImagesWithRetryForImageExtraction.js";

type UserData = {
  nameEnglish: string;
  nameBangla: string;
  fatherName: string;
  motherName: string;
  nationalId: string;
  address: string;
  bloodGroup?: string;
  birthPlace: string;
  userImage: string;
  userSign: string;
  dateOfBirth: string;
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

  const AddressObj =
    parsedData.voterAt === "present"
      ? parsedData.presentAddress
      : parsedData.permanentAddress;
  const addressString = getAddressString(AddressObj);

  // Fetch images with retries
  const images = await fetchImagesWithRetry(media.data);
  if (!images?.images || images.images.length < 2) {
    throw new Error("Failed to fetch sufficient images.");
  }

  const userData: UserData = {
    ...parsedData,
    address: addressString,
    userImage: getImageBase64(images.images[0]),
    userSign: getImageBase64(images.images[1]),
  };

  const __dirname = path.resolve();
  const page = client?.pupBrowser?.newPage
    ? await client?.pupBrowser?.newPage()
    : null;
  if (!page) {
    throw new Error("Failed to create a new Puppeteer page.");
  }

  try {
    const filePath = path.resolve(__dirname, "./htmlNidTemplate/index.html");
    await page.goto(`file://${filePath}`, { waitUntil: "networkidle0" });

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
      document.getElementById("userPhoto")!.setAttribute("src", user.userImage);
      document.getElementById("userSign")!.setAttribute("src", user.userSign);
      document.getElementById("dateOfBirth")!.innerHTML = user.dateOfBirth;

      // Barcode generation
      if (typeof window.barCodeGenerateForNid === "function") {
        window.barCodeGenerateForNid(
          `<pin>${user.pin}</pin><name>${user.nameEnglish}</name><DOB>${user.dateOfBirth}</DOB><FP></FP><F>Right Index</F><TYPE></TYPE><V>2.0</V> <ds>302c0214103fc01240542ed736c0b48858c1c03d80006215021416e73728de9618fedcd368c88d8f3a2e72096d</ds>`
        );
      }

      // // Fit text within containers
      // function fitTextToContainer(con: string, textEle: string) {
      //   const container = document.getElementById(con);
      //   const text = document.getElementById(textEle);
      //   if (!container || !text) return;

      //   let fontSize = textEle === "nameBangla" ? 18 : 14;
      //   text.style.fontSize = fontSize + "px";
      //   text.style.whiteSpace = "nowrap";

      //   while (
      //     text.offsetWidth > container.clientWidth ||
      //     text.offsetHeight > container.clientHeight
      //   ) {
      //     fontSize--;
      //     text.style.fontSize = fontSize + "px";
      //     if (fontSize <= 0) {
      //       console.warn("Font size reached zero; text may not fit.");
      //       break;
      //     }
      //   }
      // }

      // fitTextToContainer("english_name_container", "nameEnglish");
      // fitTextToContainer("bangla_name_container", "nameBangla");
    }, userData);

    const pdfBuffer: Buffer = await page.pdf();
    return pdfBuffer.toString("base64");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    await page.close();
  }
}

const getImageBase64 = (image: { base64: string; filename: string }) => {
  if (!image || !image.base64) {
    throw new Error("Invalid image data");
  }
  return `data:image/png;base64,${image.base64}`;
};
