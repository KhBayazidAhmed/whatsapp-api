"use client";
import { balanceAdd } from "@/app/action/balanceAdd";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "./SubmitButton";
import editUser from "@/app/action/editUser";
interface User {
  _id: string;
  name: string;
  whatsAppNumber: string;
  role: "user" | "admin";
  balance: number;
  price: number;
}
export default function UserEdit({ user }: { user: User }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <div>
        <UserEditButton user={user} />
      </div>
      <div>
        <UserAddBalanceButton _id={user._id} currentBalance={user.balance} />
      </div>
    </div>
  );
}
function UserEditButton({ user }: { user: User }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={editUser}>
          <DialogHeader>
            <DialogTitle className="text-center">Edit profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter name"
                className="col-span-3"
                defaultValue={user.name}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="WhatsAppNumber" className="text-right">
                Number
              </Label>
              <Input
                id="WhatsAppNumber"
                name="whatsAppNumber"
                placeholder="WhatsApp number"
                className="col-span-3"
                defaultValue={user.whatsAppNumber}
              />
            </div>
            <input hidden type="text" name="id" defaultValue={user._id} />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Balance
              </Label>
              <Input
                id="balance"
                className="col-span-3"
                type="number"
                name="balance"
                placeholder="balance"
                defaultValue={user.balance}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                className="col-span-3"
                type="number"
                name="price"
                placeholder="price"
                defaultValue={user.price}
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton />
            {/* <Button type="submit">Save changes</Button> */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function UserAddBalanceButton({
  _id,
  currentBalance,
}: {
  _id: string;
  currentBalance: number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Balance</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={balanceAdd}>
          <DialogHeader>
            <DialogTitle>Add Balance</DialogTitle>
            <DialogDescription>
              Current Balance = {currentBalance}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Balance
              </Label>
              <Input
                id="balance"
                defaultValue="add balance"
                className="col-span-3"
                type="number"
                name="amount"
              />
            </div>
          </div>
          <input hidden name="id" type="id" defaultValue={_id} />
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
