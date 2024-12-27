"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function balanceAdd(_init: any, formData: FormData) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/balance/add-balance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the Bearer token here
        },
        credentials: "same-origin",
        body: JSON.stringify({
          id: formData.get("id"),
          amount: Number(formData.get("amount")),
        }),
      }
    );

    const data = await response.json();
    if (data.failedAuth) {
      redirect("/login");
    }
    // Revalidate path after successful update
    revalidatePath("/create-account");

    return {
      message: data.message || "Balance added successfully", // Success message
    };
  } catch (error) {
    console.error("Error adding balance:", error);

    // Return error message
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
