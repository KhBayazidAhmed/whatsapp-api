"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function changeStatusAction(_initial: any, formData: FormData) {
  const id = formData.get("id");
  const response = await fetch(`${process.env.API_BASE_URL}/users/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
    },
    credentials: "same-origin",
    body: JSON.stringify({
      id,
    }),
  });
  if (!response.ok) {
    return {
      error: "Failed to change status",
    };
  }
  const data = await response.json();
  if (data.failedAuth) {
    redirect("/login");
  }
  revalidatePath("/create-account");
  return {
    message: "Status changed successfully",
  };
}
