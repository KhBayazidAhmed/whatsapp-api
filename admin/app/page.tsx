import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/Pagination";
import { redirect } from "next/navigation";
import Link from "next/link";
import SearchButton from "@/components/SearchButton";
type GetAllNidResponse = {
  data: {
    nationalId: string;
    nameEnglish: string;
    _id: string;
    user: {
      whatsAppNumber: string;
    };
  }[];
  meta: {
    totalDocuments: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
};
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const LIMIT = 10;
async function fetchEntries(page: number) {
  const response = await fetch(
    `${process.env.API_BASE_URL}/nid/all-nid?page=${page}&limit=${LIMIT}`
  );
  const data = (await response.json()) as GetAllNidResponse;
  return data;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number((await searchParams).page);
  if (!page) {
    redirect("/?page=1");
  }
  const entries = await fetchEntries(page);
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <form
        action={async (formData: FormData) => {
          "use server";
          redirect(`/edit-nid/${formData.get("nidNumber")}`);
        }}
        className="mb-4"
      >
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            name="nidNumber"
            placeholder="Search by NID number"
            className="w-full sm:w-auto"
          />
          <SearchButton />
        </div>
      </form>
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
            {entries?.data?.map((entry, index) => (
              <TableRow key={entry._id}>
                <TableCell className="font-medium">
                  {entries.meta.currentPage * LIMIT - LIMIT + index + 1}
                </TableCell>
                <TableCell>{entry.nationalId}</TableCell>
                <TableCell>{entry.nameEnglish}</TableCell>
                <TableCell>{entry.user.whatsAppNumber}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/edit-nid/${entry.nationalId}`}>
                    <Button variant="default" className="mr-2 mb-2 sm:mb-0">
                      Edit
                    </Button>
                  </Link>

                  {/* <Button variant="default">Print</Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={entries.meta.currentPage}
        totalPages={entries.meta.totalPages}
        // onPageChange={setCurrentPage}
      />
    </div>
  );
}
