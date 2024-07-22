import { db } from "@/lib/db";
import {
  ordersToMenuItems,
  ordersToMenuItemsToSupplements,
  reservations,
} from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (
      !body?.fullName ||
      !body?.phone ||
      !body?.dateTime ||
      !body?.placesNb 
    ) {
      throw new Error("Missing fields");
    }
    const {
      fullName,
      phone,
      placesNb,
      notes,
    } = body;
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
