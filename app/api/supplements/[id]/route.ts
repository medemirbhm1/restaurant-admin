import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { supplements } from "@/lib/schema";
import { eq } from "drizzle-orm";
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
    await db.delete(supplements).where(eq(supplements.id, idInt));
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
    const {
      name,
      price,
      categoryId,
    }: { name: string; price: number; categoryId: number } =
      await request.json();

    await db
      .update(supplements)
      .set({
        name,
        price,
        categoryId,
      })
      .where(eq(supplements.id, idInt));
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
