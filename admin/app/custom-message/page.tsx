"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import sendMessageRequest from "../action/sendMessage";

export default function CustomMessagePage() {
  const [state, formAction, isPending] = useActionState(
    sendMessageRequest,
    null
  );

  return (
    <div className="max-w-md mx-auto w-full px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Custom Message</h1>
      <form action={formAction} className="space-y-4">
        <Textarea
          placeholder="Enter your custom message here"
          rows={5}
          className="w-full"
          name="message"
          disabled={isPending} // Disable while pending
        />
        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? "Sending..." : "Send"}
        </Button>
        {/* Display success or error messages */}
        {state?.message && (
          <p className="text-green-500 mt-2">{state.message}</p>
        )}
        {state?.error && <p className="text-red-500 mt-2">{state.error}</p>}
      </form>
    </div>
  );
}
