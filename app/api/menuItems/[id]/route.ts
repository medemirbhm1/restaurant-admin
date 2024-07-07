import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { menuItems, supplements } from "@/lib/schema";
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
    await db.delete(menuItems).where(eq(menuItems.id, idInt));
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
      price: number;
      categoryId: number;
      enabled: boolean;
    } = await request.json();
    if (
      !data.name ||
      !data.description ||
      !data.imgUrl ||
      !data.price ||
      !data.categoryId ||
      typeof data.enabled !== "boolean"
    ) {
      throw new Error("Missing required fields");
    }
    const { name, description, imgUrl, price, categoryId, enabled } = data;
    await db
      .update(menuItems)
      .set({
        name,
        description,
        imgUrl,
        price,
        categoryId,
        enabled,
      })
      .where(eq(menuItems.id, idInt));
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
