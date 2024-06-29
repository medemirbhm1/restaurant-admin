import React from "react";
import CategoryForm from "../components/CategoryForm";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { menuItemCategories } from "@/lib/schema";
import { redirect } from "next/navigation";

async function page({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  let category = null;
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
  }
  const supplements = await db.query.supplements.findMany();
  return (
    <div>
      <CategoryForm initialData={category} id={id} supplements={supplements} />
    </div>
  );
}

export default page;
