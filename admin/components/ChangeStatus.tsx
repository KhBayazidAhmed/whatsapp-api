import { changeStatusAction } from "@/app/action/changeStatus";
import { Button } from "./ui/button";

import { useActionState } from "react";
interface User {
  _id: string;
  name: string;
  whatsAppNumber: string;
  role: "user" | "admin";
  balance: number;
  price: number;
  isActive: boolean;
}
export default function ChangeStatus({ user }: { user: User }) {
  const [status, formAction, isPending] = useActionState(
    changeStatusAction,
    null
  );

  return (
    <form action={formAction} className="flex items-center gap-4">
      <input type="hidden" name="id" value={user._id} />
      <Button variant={user.isActive ? "destructive" : "default"}>
        {isPending
          ? user.isActive
            ? "Deactivating..."
            : "Activating..."
          : user.isActive
          ? "Deactivate"
          : "Activate"}
      </Button>
      {status?.error && <p className="text-red-500 mt-2">{status.error}</p>}
      {status?.message && (
        <p className="text-green-500 mt-2">{status.message}</p>
      )}
    </form>
  );
}
