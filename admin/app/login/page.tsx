import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  return (
    <div className="max-w-md mx-auto w-full px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form
        action={async (formData: FormData) => {
          "use server";
          const whatsAppNumber = formData.get("whatsAppNumber");
          const password = formData.get("password");
          const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              whatsAppNumber,
              password,
            }),
          });
          if (!res.ok) {
            throw new Error("Failed to login");
          }
          const data = await res.json();
          if (!data.token) {
            throw new Error("Failed to login");
          }
          (await cookies()).set("token", data.token);
          redirect("/");
        }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
          <Input
            id="whatsappNumber"
            type="tel"
            name="whatsAppNumber"
            required
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            className="w-full"
          />
        </div>
        <SubmitButton />
        {/* <Button type="submit" className="w-full">
          Login
        </Button> */}
      </form>
    </div>
  );
}
