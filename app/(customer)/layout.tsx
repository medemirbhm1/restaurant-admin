import { ChefHat, MapPin, Phone } from "lucide-react";
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
      <footer className="py-6 w-full px-4 md:px-6 border-t">
        <div className="text-xs text-foreground font-medium flex justify-between flex-wrap gap-4">
          <div>Arabesque</div>
          <div className="flex gap-6 gap-y-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              0656707748
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Rue Didouche Mourad, Mascara
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
