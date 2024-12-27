"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type UserData = {
  nameEnglish: string;
  nameBangla: string;
  fatherName: string;
  motherName: string;
  nationalId: string;
  nidAddress: string;
  bloodGroup?: string;
  birthPlace: string;
  userImage?: string;
  userSign?: string;
  dateOfBirth: string;
  pin: string;
  whatsAppNumber: string;
};
export default async function generateNid(values: UserData) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  const url = `${process.env.API_BASE_URL}/nid/generateNid`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.failedAuth) {
      redirect("/login");
    }
  } catch (error) {
    console.error("Error:", error); // Handle any error that occurs
  }
}
