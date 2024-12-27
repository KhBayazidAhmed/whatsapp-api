import React from "react";
import EditNidForm from "./EditNidFrom";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};
export default async function page({ params }: PageProps) {
  const id = (await params).id;
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const response = await fetch(
    `${process.env.API_BASE_URL}/nid/search/?q=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Add the Bearer token here
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch NID data");
  }
  const data = await response.json();
  if (data.failedAuth) {
    redirect("/login");
  }

  return (
    <div>
      <EditNidForm
        nidData={{
          ...data,
          dateOfBirth: new Date(data.dateOfBirth).toISOString().split("T")[0],
        }}
      />
    </div>
  );
}
