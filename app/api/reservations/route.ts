import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { reservations } from "@/lib/schema";
import { desc, inArray } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const token = cookies().get("token");

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const page = parseInt(searchParams.get("page") || "1");
    const ids = searchParams.get("ids")?.split(",").map(Number);
    if ((!ids || !ids.length) && !(await isAdmin(token?.value))) {
      throw new Error("Unauthorized");
    }
    const queryRes = await db
      .select()
      .from(reservations)
      .where(ids ? inArray(reservations.id, ids) : undefined)
      .limit(11)
      .offset((page - 1) * 10)
      .orderBy(desc(reservations.id))
      .execute();
    const next = queryRes.length === 11;
    return Response.json(
      {
        reservations: queryRes.slice(0, 10),
        next,
      },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    console.log(err);
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.fullName || !body?.phone || !body?.dateTime || !body?.placesNb) {
      throw new Error("Missing fields");
    }
    const { fullName, phone, placesNb, notes } = body;
    const dateTime = new Date(body.dateTime);
    const reservation = await db
      .insert(reservations)
      .values({
        fullName,
        phone,
        dateTime,
        placesNb,
        notes,
      })
      .returning();

    return Response.json(
      {
        ok: true,
        id: reservation[0].id,
      },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    console.log(err);
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
