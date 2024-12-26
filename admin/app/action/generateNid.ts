"use server";

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
  whatsAppNumber: string;
};
export default async function generateNid(values: UserData) {
  console.log("nid data", values);
  const url = `${process.env.API_BASE_URL}/nid/generateNid`;
  console.log("API URL:", url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Response:", data); // Handle the response here
  } catch (error) {
    console.error("Error:", error); // Handle any error that occurs
  }
}
