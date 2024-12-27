/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function sendMessageRequest(
  _initialState: any,
  formData: FormData
) {
  const message = formData.get("message");
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const apiUrl = `${process.env.API_BASE_URL}/whatsapp/send-message`; // Replace with your API URL
  if (!message) {
    return {
      error: "Message is required", // Send error response if message is missing
    };
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorMessage = `Server responded with status ${response.status}`;
      console.error(errorMessage);
      return { error: errorMessage }; // Include status in error
    }
    const responseData = await response.json();
    if (responseData.failedAuth) {
      redirect("/login");
    }
    return {
      message: responseData.message || "Message sent successfully!", // Default success message
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error sending message request:", errorMessage);
    return { error: errorMessage };
  }
}
