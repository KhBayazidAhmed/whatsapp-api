export type Address = {
  homeHolding?: string;
  villageRoad?: string;
  additionalVillageRoad?: string;
  mouzaMoholla?: string;
  additionalMouzaMoholla?: string;
  postOffice?: string;
  postalCode?: string;
  upozila?: string;
  cityCorporation?: string;
  district?: string;
};

function convertToBengaliNumbers(number: string | undefined): string {
  if (!number) return "";
  const bengaliNumbersMap: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  return number.replace(/[0-9]/g, (digit) => bengaliNumbersMap[digit]);
}

function getAddressString(address: Address): string {
  // Convert home or holding information, if available
  const houseHolding = address.homeHolding
    ? `${convertToBengaliNumbers(
        address.homeHolding === "-"
          ? " "
          : "বাসা/হোল্ডিং: " + address.homeHolding + ","
      )} `
    : "";

  // Handle village or road information
  const villageOrRoad =
    address.villageRoad?.trim() || address.additionalVillageRoad?.trim() || "";

  const mouzaOrMoholla =
    address.mouzaMoholla?.trim() ||
    address.additionalMouzaMoholla?.trim() ||
    "";

  let villageRoad =
    villageOrRoad && mouzaOrMoholla && villageOrRoad === mouzaOrMoholla
      ? villageOrRoad
      : [villageOrRoad, mouzaOrMoholla].filter(Boolean).join(", ");
  villageRoad = villageRoad.replaceAll("-,", "");
  // Construct the post office and district address
  const postOfficeAddress = `${
    address.postOffice || ""
  } - ${convertToBengaliNumbers(address.postalCode || "")}${
    address.upozila ? `, ${address.upozila}` : ""
  }${address.cityCorporation ? `, ${address.cityCorporation}` : ""}${
    address.district ? `, ${address.district}` : ""
  }`;

  // Combine all parts into the final address string
  return `${houseHolding}গ্রাম/রাস্তা: ${villageRoad}, ডাকঘর: ${postOfficeAddress}`;
}
export default getAddressString;
