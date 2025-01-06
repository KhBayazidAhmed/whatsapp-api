import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type Entry = {
  _id: string;
  nationalId: string;
  nameEnglish: string;
  user: {
    whatsAppNumber: string;
  };
};

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const response = await fetch(
    `${process.env.API_BASE_URL}/nid/search-by-nid-number/?q=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Add the Bearer token here
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch NID data");
  }
  const data = await response.json();
  if (data.failedAuth) {
    redirect("/login");
  }
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Search Result</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Serial Number</TableHead>
              <TableHead>NID Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>User WhatsApp</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry: Entry, index: number) => (
              <TableRow key={entry._id} className="text-nowrap">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{entry.nationalId}</TableCell>
                <TableCell>{entry.nameEnglish}</TableCell>
                <TableCell>{entry.user.whatsAppNumber}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/edit-nid/${entry._id}`}>
                    <Button variant="default" className="mr-2 mb-2 sm:mb-0">
                      Edit
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
