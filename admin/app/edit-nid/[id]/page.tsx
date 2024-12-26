import React from "react";
import EditNidForm from "./EditNidFrom";

type PageProps = {
  params: Promise<{ id: string }>;
};
export default async function page({ params }: PageProps) {
  const id = (await params).id;
  const response = await fetch(
    `${process.env.API_BASE_URL}/nid/search/?q=${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch NID data");
  }
  const data = await response.json();

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
