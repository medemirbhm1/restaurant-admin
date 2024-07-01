import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { supplements } from "@/lib/schema";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = cookies().get("token");
    if (!(await isAdmin(token?.value))) {
      throw new Error("Unauthorized");
    }
    if (!body?.name || !body?.categoryId || isNaN(parseInt(body?.price))) {
      throw new Error("Missing fields");
    }
    const { name, price, categoryId } = body;
    const category = await db.insert(supplements).values({
      name,
      price,
      categoryId,
    });
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
