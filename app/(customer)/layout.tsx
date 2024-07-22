import { ChefHat } from "lucide-react";
import Link from "next/link";
import React from "react";
import CartDialog from "./components/CartDialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="container h-24 flex items-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-1"
          prefetch={false}
        >
          <ChefHat className="h-6 w-6" />
          <span className="font-semibold ">Arabesque</span>
        </Link>
        <div className="ml-auto">
          <CartDialog />
        </div>
      </header>
      {children}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 Acme Restaurant. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
