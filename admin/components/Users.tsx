import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserEdit from "./UserEdit";

interface User {
  _id: string;
  name: string;
  whatsAppNumber: string;
  role: "user" | "admin";
  balance: number;
  price: number;
}
async function getUsers() {
  const response = await fetch(`${process.env.API_BASE_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });
  const data = (await response.json()) as User[];
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
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((entry, index) => (
              <TableRow key={entry._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.whatsAppNumber}</TableCell>
                <TableCell>{entry.role}</TableCell>
                <TableCell>{entry.balance}</TableCell>
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
