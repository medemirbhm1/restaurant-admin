import React from "react";
import CategoryForm from "../components/CategoryForm";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { menuItemCategories, supplements } from "@/lib/schema";
import { redirect } from "next/navigation";

async function page({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  let category = null;
  let categorySupplements = null;
  const idInt = parseInt(id);
  if (!isNaN(idInt)) {
    category = await db.query.menuItemCategories.findFirst({
      where: eq(menuItemCategories.id, idInt),
      columns: {
        name: true,
        description: true,
        imgUrl: true,
        id: true,
      },
      with: {
        supplements: true,
      },
    });
    if (!category) {
      return redirect("/dashboard/categories");
    }
    categorySupplements = await db.query.supplements.findMany({
      where: eq(supplements.categoryId, idInt),
    });
  }
  return (
    <div>
      <CategoryForm
        initialData={category}
        id={id}
        supplements={categorySupplements}
      />
    </div>
  );
}

export default page;
