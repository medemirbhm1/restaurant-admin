import React from "react";
import CategoryForm from "./components/CategoryForm";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { menuItemCategory } from "@/lib/schema";

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
    category = await db.query.menuItemCategory.findFirst({
      where: eq(menuItemCategory.id, idInt),
      columns: {
        name: true,
        description: true,
        imgUrl: true,
      },
    });
  }
  return (
    <div>
      <CategoryForm initialData={category} id={id} />
    </div>
  );
}

export default page;
