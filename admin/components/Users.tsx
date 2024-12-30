import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserEdit from "./UserEdit";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface User {
  _id: string;
  name: string;
  whatsAppNumber: string;
  role: "user" | "admin";
  balance: number;
  price: number;
  isActive: boolean;
}
async function getUsers() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const response = await fetch(`${process.env.API_BASE_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "same-origin",
  });

  const data = await response.json();
  if (data.failedAuth) {
    redirect("/login");
  }
  return data;
}
export default async function Users() {
  const users = (await getUsers()).reverse();
  return (
    <div>
      <h1 className="border text-xl text-center rounded-md bg-primary text-white p-2 mb-4">
        All Users{" "}
      </h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Serial Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>whatsAppNumber</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((entry: User, index: number) => (
              <TableRow key={entry._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.whatsAppNumber}</TableCell>
                <TableCell>{entry.role}</TableCell>
                <TableCell>{entry.balance}</TableCell>
                <TableCell>
                  {entry.isActive ? "Active" : "Deactivated"}
                </TableCell>
                <TableCell className="text-right">
                  <UserEdit user={entry} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
