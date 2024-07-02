import React from "react";
import MenuItemForm from "../components/MenuItemForm";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { menuItems } from "@/lib/schema";
import { redirect } from "next/navigation";

async function page({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  let menuItem = null;
  const idInt = parseInt(id);
  if (!isNaN(idInt)) {
    menuItem = await db.query.menuItems.findFirst({
      where: eq(menuItems.id, idInt),
    });

    if (!menuItem) {
      return redirect("/dashboard/menu");
    }
  }
  const categories = await db.query.menuItemCategories.findMany();
  return (
    <div>
      <MenuItemForm initialData={menuItem} id={id} categories={categories} />
    </div>
  );
}

export default page;
