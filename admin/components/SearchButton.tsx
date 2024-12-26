"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function SearchButton() {
  const { pending } = useFormStatus();
  return (
    <div>
      {" "}
      <Button type="submit" disabled={pending}>
        {pending ? "Searching..." : "Search"}
      </Button>
    </div>
  );
}
