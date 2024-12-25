"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <div>
      {" "}
      <Button type="submit" disabled={pending}>
        {pending ? "Updating" : "Change Save"}
      </Button>
    </div>
  );
}
