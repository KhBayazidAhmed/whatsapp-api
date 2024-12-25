import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Users from "@/components/Users";
import { revalidatePath } from "next/cache";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

export default async function CreateAccountPage() {
  return (
    <>
      <div className="max-w-md mx-auto w-full px-4 sm:px-6 lg:px-8 mb-9">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <form
          action={async (formData) => {
            "use server";
            const response = await fetch(
              `${process.env.API_BASE_URL}/auth/create-user`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: formData.get("name"),
                  whatsAppNumber: formData.get("whatsAppNumber"),
                  password: formData.get("password"),
                  price: formData.get("price"),
                }),
                credentials: "same-origin",
              }
            );
            const data = await response.json();
            if (response.ok) {
              revalidatePath("/create-account");
            } else {
              console.log(data);
            }
          }}
          className="space-y-4"
        >
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
          {/* <div>
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            id="password"
            type="password"
            required
            placeholder="Password"
            className="w-full"
          />
        </div> */}
          {/* <div>
          <Label htmlFor="balance">Balance</Label>
          <Input id="balance" type="number" required className="w-full" />
        </div> */}
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </div>
      <Users />
    </>
  );
}
