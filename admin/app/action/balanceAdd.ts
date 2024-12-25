"use server";

import { revalidatePath } from "next/cache";

export async function balanceAdd(formData: FormData) {
  console.log(formData);
  const response = await fetch(
    `${process.env.API_BASE_URL}/balance/add-balance`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        id: formData.get("id"),
        amount: Number(formData.get("amount")),
      }),
    }
  );

  const data = await response.json();
  console.log(data);
  revalidatePath("/create-account");
}
