"use client";
import Link from "next/link";
import { CircleUser, Menu, Sandwich, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

function Nav() {
  const router = useRouter();
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Sandwich className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Accueil
        </Link>
        <Link
          href="/dashboard/orders"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Commandes
        </Link>
        <Link
          href="/dashboard/reservations"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Réservations
        </Link>
        <Link
          href="/dashboard/categories"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Catégories
        </Link>
        <Link
          href="/dashboard/menu"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Menu
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Sandwich className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground"
            >
              Accueil
            </Link>
            <Link
              href="/dasboard/orders"
              className="text-muted-foreground hover:text-foreground"
            >
              Commandes
            </Link>
            <Link
              href="/dasboard/reservations"
              className="text-muted-foreground hover:text-foreground"
            >
              Réservations
            </Link>
            <Link
              href="/dashboard/categories"
              className="text-muted-foreground hover:text-foreground"
            >
              Catégories
            </Link>
            <Link
              href="/dashboard/menu"
              className="text-muted-foreground hover:text-foreground"
            >
              Menu
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Ouvrir d&apos;utilisateur</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await fetch("/api/auth/logout", {
                    method: "POST",
                  });
                  router.push("/");
                } catch (err) {
                  console.error(err);
                  return null;
                }
              }}
            >
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Nav;
