import { ChefHat, MapIcon, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";
import CartDialog from "./components/CartDialog";
import { Button } from "@/components/ui/button";

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
          <span className="font-semibold text-lg">Arabesque</span>
        </Link>
        <div className="ml-auto">
          <CartDialog />
        </div>
      </header>
      {children}
      <footer className="py-6 w-full px-4 md:px-6 border-t bg-black">
        <div className="container text-xs text-white font-medium flex justify-between flex-wrap gap-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-1"
            prefetch={false}
          >
            <ChefHat className="h-6 w-6" />
            <span className="font-semibold text-lg">Arabesque</span>
          </Link>
          <div className="flex gap-6 gap-y-4 flex-wrap">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              0656707748
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Bd Mouloud BEL HOUCHETE, Sidi M&apos;Hamed, Alger
            </div>
            <a href="https://maps.app.goo.gl/aPWozH7zLcxJj12b9" target="_blank">
              <Button variant="secondary">
                <MapIcon className="mr-2 h-4 w-4" /> Voir sur la carte
              </Button>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
