import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { menuItems } from "@/lib/schema";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = cookies().get("token");
    if (!(await isAdmin(token?.value))) {
      throw new Error("Unauthorized");
    }
    if (
      !body?.name ||
      !body?.description ||
      !body?.imgUrl ||
      !body?.price ||
      !body?.categoryId
    ) {
      throw new Error("Missing fields");
    }
    const { name, description, imgUrl, price, categoryId } = body;
    const menuItem = await db
      .insert(menuItems)
      .values({
        name,
        description,
        imgUrl,
        price,
        categoryId,
      })
      .returning();
    return Response.json(
      {
        ok: true,
        id: menuItem[0].id,
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
