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
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return (
    <div>
      <EditNidForm nidData={data} />
    </div>
  );
}
