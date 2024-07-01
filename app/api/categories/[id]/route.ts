import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { menuItemCategories, supplements } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";

export async function DELETE(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const token = cookies().get("token");
    if (!(await isAdmin(token?.value))) {
      throw new Error("Unauthorized");
    }
    const idInt = parseInt(id);
    if (isNaN(idInt)) {
      throw new Error("Invalid ID");
    }
    await db.delete(menuItemCategories).where(eq(menuItemCategories.id, idInt));
    return Response.json(
      {
        ok: true,
      },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return Response.json(
      {
        error: err.message,
      },
      {
        status: 400,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const token = cookies().get("token");
    if (!(await isAdmin(token?.value))) {
      throw new Error("Unauthorized");
    }
    const idInt = parseInt(id);
    if (isNaN(idInt)) {
      throw new Error("Invalid ID");
    }
    const data: {
      name: string;
      description: string;
      imgUrl: string;
      supplements: number[];
    } = await request.json();
    const { name, description, imgUrl } = data;
    let categorySupplements;
    if (data.supplements.length !== 0) {
      categorySupplements = data.supplements.join(", ");
    } else {
      categorySupplements = "NULL";
    }
    await Promise.all([
      db
        .update(menuItemCategories)
        .set({
          name,
          description,
          imgUrl,
        })
        .where(eq(menuItemCategories.id, idInt)),
      db.execute(sql`
        UPDATE supplements
        SET "enabled" = CASE
          WHEN "id" IN (${sql.raw(categorySupplements)}) THEN TRUE
          ELSE FALSE
        END
        WHERE "categoryId" = ${idInt};
        `),
    ]);
    return Response.json(
      {
        ok: true,
      },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    console.log(err.message);
    return Response.json(
      {
        error: err.message,
      },
      {
        status: 400,
      }
    );
  }
}
