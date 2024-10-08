import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { menuItemCategories } from "@/lib/schema";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = cookies().get("token");
    if (!(await isAdmin(token?.value))) {
      throw new Error("Unauthorized");
    }
    if (!body?.name || !body?.description || !body?.imgUrl) {
      throw new Error("Missing fields");
    }
    const { name, description, imgUrl } = body;
    const category = await db
      .insert(menuItemCategories)
      .values({
        name,
        description,
        imgUrl,
      })
      .returning();
    return Response.json(
      {
        ok: true,
        id: category[0].id,
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
