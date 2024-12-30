"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function editUser(_initial: any, formData: FormData) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/users/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        id: formData.get("id"),
        name: formData.get("name"),
        whatsAppNumber: formData.get("whatsAppNumber"),
        price: formData.get("price"),
        balance: formData.get("balance"),
        stockBalance: formData.get("stockBalance"),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to edit user");
    }

    const data = await response.json();
    if (data.failedAuth) {
      redirect("/login");
    }
    // Revalidate path after successful update
    revalidatePath("/create-account");

    return {
      message: data.message || "User updated successfully", // Success message
    };
  } catch (error) {
    console.error("Error editing user:", error);

    // Return error message
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
