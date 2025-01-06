"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import logout from "@/app/action/logout";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-primary sticky top-0 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/?page=1" className="text-xl font-bold">
          Admin Panel
        </Link>
        <div className="hidden md:flex space-x-5 items-center">
          <Link href="/?page=1">Home</Link>
          <Link href="/create-account">Users</Link>
          <Link href="/custom-message">Custom Message</Link>
          <Link href="/logs">Logs</Link>
          <Button
            onClick={async () => {
              await logout();
            }}
            variant="destructive"
          >
            Log out
          </Button>
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden mt-3 text-center space-y-3 ">
          <Link
            href="/"
            className="block py-2 border-b border-primary-foreground"
          >
            Home
          </Link>
          <Link
            href="/create-account"
            className="block py-2 border-b border-primary-foreground"
          >
            Users
          </Link>

          <Link
            href="/custom-message"
            className="block py-2 border-b border-primary-foreground"
          >
            Custom Message
          </Link>
          <Link
            href="/logs"
            className="block py-2 border-b border-primary-foreground"
          >
            Logs
          </Link>

          <Button
            onClick={async () => {
              await logout();
            }}
            variant="destructive"
          >
            Log out
          </Button>
        </div>
      )}
    </nav>
  );
}
