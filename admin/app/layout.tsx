import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "User Management System",
  description: "A system for managing users and NID information",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto mt-4 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
