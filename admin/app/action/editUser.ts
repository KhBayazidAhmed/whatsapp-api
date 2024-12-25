"use server";

import { revalidatePath } from "next/cache";

export default async function editUser(formData: FormData) {
  const response = await fetch(`${process.env.API_BASE_URL}/users/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      id: formData.get("id"),
      name: formData.get("name"),
      whatsAppNumber: formData.get("whatsAppNumber"),
      price: formData.get("price"),
      balance: formData.get("balance"),
    }),
  });

  if (!response.ok) {
    throw new Error("fail to adit ");
  }
  revalidatePath("/create-account");
}
