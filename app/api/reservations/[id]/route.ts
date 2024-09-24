import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { order, orders, ordersToMenuItems } from "@/lib/schema";
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
    await db.delete(orders).where(eq(orders.id, idInt));
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
