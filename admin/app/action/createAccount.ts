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
          name: formData.get("name"),
          whatsAppNumber: formData.get("whatsAppNumber"),
          password: formData.get("password"),
          price: formData.get("price"),
        }),
        credentials: "same-origin",
      }
    );

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
