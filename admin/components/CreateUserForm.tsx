"use client";

import { createAccountAction } from "@/app/action/createAccount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
export default function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(
    createAccountAction,
    null
  );
  return (
    <div>
      {" "}
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            required
            placeholder="Name"
            name="name"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
          <Input
            id="whatsappNumber"
            name="whatsAppNumber"
            type="tel"
            required
            placeholder="WhatsApp Number"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            name="price"
            id="price"
            type="number"
            required
            placeholder="Price"
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create Account"}
        </Button>
      </form>
      {state?.message && <p className="text-green-500 mt-2">{state.message}</p>}
      {state?.error && <p className="text-red-500 mt-2">{state.error}</p>}
    </div>
  );
}
