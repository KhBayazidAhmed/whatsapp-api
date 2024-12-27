import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

async function getLogs() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const res = await fetch(`${process.env.API_BASE_URL}/logs`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    (await cookies()).delete("token");
    redirect("/login");
  }
  const data = await res.json();
  if (data.failedAuth) {
    redirect("/login");
  }
  return data.data;
}

const levelStyles: Record<string, string> = {
  info: "bg-blue-50 text-blue-700",
  warning: "bg-yellow-50 text-yellow-700",
  error: "bg-red-50 text-red-700",
  default: "bg-gray-50 text-gray-700",
};

export default async function LogsPage() {
  const paginatedLogs = await getLogs();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Application Logs</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.map((log: LogEntry, index: number) => (
              <TableRow
                key={index}
                className={levelStyles[log.level] || levelStyles.default}
              >
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{log.level}</TableCell>
                <TableCell>{log.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
