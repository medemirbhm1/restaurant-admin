import Nav from "@/components/ui/Nav";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Nav />
      <div className="p-8">

      {children}
      </div>
    </div>
  );
}

export default Layout;
