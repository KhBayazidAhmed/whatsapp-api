"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createAccountAction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _initialState: any,
  formData: FormData
) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const name = formData.get("name");
  const whatsAppNumber = formData.get("whatsAppNumber") as string;
  const price = formData.get("price");
  if (!name || !whatsAppNumber) {
    return { error: "All fields are required" };
  }
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/auth/create-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          whatsAppNumber: whatsAppNumber.trim(),
          price,
        }),
        credentials: "same-origin",
      }
    );
    if (!response.ok) {
      return {
        error: "Failed to create account",
      };
    }
    const data = await response.json();
    if (data.failedAuth) {
      redirect("/login");
    }

    // Revalidate path after successful account creation
    revalidatePath("/create-account");

    return { message: "Account created successfully" };
  } catch (error) {
    console.error("Error creating account:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
