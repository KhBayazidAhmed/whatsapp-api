type Address = {
  division: string;
  district: string;
  rmo: string;
  cityCorporation: string;
  upozila: string;
  unionWard: string;
  mouzaMoholla: string;
  additionalMouzaMoholla: string;
  wardForUnionPorishod: string;
  villageRoad: string;
  additionalVillageRoad: string;
  homeHolding: string;
  postOffice: string;
  postalCode: string;
  region: string;
};

export type ParsedData = {
  citizen: string | null;
  nationalId: string;
  pin: string;
  status: string | null;
  afisStatus: string | null;
  lockFlag: string | null;
  voterNo: string | null;
  formNo: string | null;
  slNo: string | null;
  tag: string | null;
  nameBangla: string;
  nameEnglish: string;
  dateOfBirth: string;
  birthPlace: string;
  birthOther: string | null;
  birthRegistration: string | null;
  fatherName: string;
  motherName: string;
  spouseName: string | null;
  gender: string | null;
  marital: string | null;
  occupation: string | null;
  disability: string | null;
  disabilityOther: string | null;
  presentAddress: Address;
  permanentAddress: Address;
  education: string | null;
  identification: string | null;
  bloodGroup: string | undefined;
  tin: string | null;
  driving: string | null;
  passport: string | null;
  laptopId: string | null;
  nidFather: string | null;
  nidMother: string | null;
  nidSpouse: string | null;
  voterNoFather: string | null;
  voterNoMother: string | null;
  voterNoSpouse: string | null;
  phone: string | null;
  mobile: string | null;
  religion: string | null;
  religionOther: string | null;
  noFinger: string | null;
  noFingerPrint: string | null;
  voterArea: string | null;
  voterAt: string | null;
  nidAddress: string;
};

function formatTheString(data: string): ParsedData {
  // Helper function to extract data between start and end strings
  let string = data;
  const extractData = (
    start: string,
    end: string,
    sliceFrom = 0
  ): string | null => {
    const startIndex = string.indexOf(start, sliceFrom); // Find the start index
    const endIndex = string.indexOf(end, startIndex); // Find the end index
    if (startIndex === -1 || endIndex === -1) return null; // Return null if start or end is not found
    return string
      .slice(startIndex + start.length, endIndex) // Extract data between start and end
      .trim() // Remove leading/trailing spaces
      .replaceAll("\n", " "); // Replace newlines with spaces
  };
  const extractDataForNid = (
    start: string,
    end: string,
    sliceFrom = 0
  ): string => {
    const startIndex = string.indexOf(start, sliceFrom); // Find the start index
    const endIndex = string.indexOf(end, startIndex); // Find the end index
    return string
      .slice(startIndex + start.length, endIndex) // Extract data between start and end
      .trim() // Remove leading/trailing spaces
      .replaceAll("\n", " "); // Replace newlines with spaces
  };
  // Parse Address fields (handles both Present and Permanent Address)
  const parsePresentAddress = (): Address => {
    return {
      division: extractData(`Division`, "District") || "",
      district: extractData(`District`, "RMO") || "",
      rmo: extractData(`RMO`, "City") || "",
      cityCorporation:
        extractData(`City\nCorporation\nOr\nMunicipality`, "Upozila") || "",
      upozila: extractData(`Upozila`, "Union/Ward") || "",
      unionWard: extractData(`Union/Ward`, "Mouza/Moholla") || "",
      mouzaMoholla:
        extractData(`Mouza/Moholla`, "Additional\nMouza/Moholla") === "-"
          ? "" // If the value is "-", return empty string
          : extractData(`Mouza/Moholla`, "Additional\nMouza/Moholla") || "",
      additionalMouzaMoholla:
        extractData(`Additional\nMouza/Moholla`, "Ward For") === "-"
          ? "" // If the value is "-", return empty string
          : extractData(`Additional\nMouza/Moholla`, "Ward For") || "",
      wardForUnionPorishod:
        extractData(`Ward For\nUnion\nPorishod`, "Village/Road") || "",
      villageRoad:
        extractData(`Village/Road`, "Additional\nVillage/Road") || "",
      additionalVillageRoad:
        extractData(`Additional\nVillage/Road`, "Home/Holding\nNo") || "",
      homeHolding: extractData(`Home/Holding\nNo`, "Post Office") || "",
      postOffice: extractData(`Post Office`, "Postal Code") || "",
      postalCode: extractData(`Postal Code`, "Region")?.split(" ")[0] || "",
      region: extractData(`Region`, "Permanent Address") || "",
    };
  };
  const parsePermanentAddress = (): Address => {
    string = string.slice(string.indexOf("Permanent Address"));
    return {
      division: extractData(`Division`, "District") || "",
      district: extractData(`District`, "RMO") || "",
      rmo: extractData(`RMO`, "City") || "",
      cityCorporation:
        extractData(`City\nCorporation\nOr\nMunicipality`, "Upozila") || "",
      upozila: extractData(`Upozila`, "Union/Ward") || "",
      unionWard: extractData(`Union/Ward`, "Mouza/Moholla") || "",
      mouzaMoholla:
        extractData(`Mouza/Moholla`, "Additional\nMouza/Moholla") === "-"
          ? "" // If the value is "-", return empty string
          : extractData(`Mouza/Moholla`, "Additional\nMouza/Moholla") || "",
      additionalMouzaMoholla:
        extractData(`Additional\nMouza/Moholla`, "Ward For") === "-"
          ? "" // If the value is "-", return empty string
          : extractData(`Additional\nMouza/Moholla`, "Ward For") || "",
      wardForUnionPorishod:
        extractData(`Ward For\nUnion\nPorishod`, "Village/Road") || "",
      villageRoad:
        extractData(`Village/Road`, "Additional\nVillage/Road") || "",
      additionalVillageRoad:
        extractData(`Additional\nVillage/Road`, "Home/Holding\nNo") || "",
      homeHolding: extractData(`Home/Holding\nNo`, "Post Office") || "",
      postOffice: extractData(`Post Office`, "Postal Code") || "",
      postalCode: extractData(`Postal Code`, "Region")?.split(" ")[0] || "",
      region:
        (extractData("Region", "Education")?.split(" ") &&
          extractData("Region", "Education")?.split(" ")[0]) ||
        "",
    };
  };
  return {
    citizen: extractData("Citizen", "National ID"),
    nationalId: extractDataForNid("National ID", "Pin"),
    pin: extractDataForNid("Pin", "Status"),
    status: extractData("Status", "Afis Status"),
    afisStatus: extractData("Afis Status", "Lock Flag"),
    lockFlag: extractData("Lock Flag", "Voter No"),
    voterNo: extractData("Voter No", "Form No"),
    formNo: extractData("Form No", "Sl No"),
    slNo: extractData("Sl No", "Tag"),
    tag: extractData("Tag", "Name(Bangla)"),
    nameBangla: extractDataForNid("Name(Bangla)", "Name(English)"),
    nameEnglish: extractDataForNid("Name(English)", "Date of Birth"),
    dateOfBirth: getDateFormat(extractData("Date of Birth", "Birth Place")),
    birthPlace: extractDataForNid("Birth Place", "Birth Other"),
    birthOther: extractData("Birth Other", "Birth Registration"),
    birthRegistration: extractData("Birth Registration\nNo", "Father Name"),
    fatherName: extractDataForNid("Father Name", "Mother Name"),
    motherName: extractDataForNid("Mother Name", "Spouse Name"),
    spouseName: extractData("Spouse Name", "Gender"),
    gender: extractData("Gender", "Marital"),
    marital: extractData("Marital", "Occupation"),
    occupation: extractData("Occupation", "Disability"),
    disability: extractData("Disability", "Disability Other"),
    disabilityOther: extractData("Disability Other", "Present Address"),
    nidAddress: "",
    // Parsing Present and Permanent addresses using the parseAddress function
    presentAddress: parsePresentAddress(),
    permanentAddress: parsePermanentAddress(),

    education:
      extractData("Education", "Education Other")?.split("Smart Card")[0] ||
      extractData("Education", "Education Other"),
    identification: extractData("Identification", "Blood Group"),
    bloodGroup: extractData("Blood Group", "TIN") || undefined,
    tin: extractData("TIN", "Driving"),
    driving: extractData("Driving", "Passport"),
    passport: extractData("Passport", "Laptop ID"),
    laptopId: extractData("Laptop ID", "NID Father"),
    nidFather: extractData("NID Father", "NID Mother"),
    nidMother: extractData("NID Mother", "Nid Spouse"),
    nidSpouse: extractData("Nid Spouse", "Voter No Father"),
    voterNoFather: extractData("Voter No Father", "Voter No Mother"),
    voterNoMother: extractData("Voter No Mother", "Voter No Spouse"),
    voterNoSpouse: extractData("Voter No Spouse", "Phone"),
    phone: extractData("Phone", "Mobile"),
    mobile: extractData("Mobile", "Religion")?.split("Mobile")[1] || "",
    religion: extractData("Religion", "Religion Other"),
    religionOther: extractData("Religion Other", "Death Date Of"),
    noFinger: extractData("No Finger", "No Finger Print"),
    noFingerPrint: extractData("No Finger Print", "Voter Area"),
    voterArea: extractData("Voter Area", "Voter At"),
    // Special case: Extract voterAt using regex as a fallback
    voterAt: data.match(/Voter At\n(.*)/)?.[1] || "",
  };
}

function getDateFormat(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
  const month = date.toLocaleString("default", { month: "short" }); // Abbreviated month
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}
export default formatTheString;
