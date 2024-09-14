import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  orders,
  ordersToMenuItems,
  ordersToMenuItemsToSupplements,
} from "@/lib/schema";
import { desc, inArray, sql } from "drizzle-orm";
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
      .from(orders)
      .where(ids ? inArray(orders.id, ids) : undefined)
      .limit(11)
      .offset((page - 1) * 10)
      .orderBy(desc(orders.id))
      .execute();
    const next = queryRes.length === 11;
    return Response.json(
      {
        orders: queryRes.slice(0, 10),
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
    if (
      !body.clientFullName ||
      !body.clientPhone ||
      !body.type ||
      (body.type === "delivery" && !body.address) ||
      !body.orderItems.length
    ) {
      throw new Error("Missing fields");
    }
    const {
      clientFullName,
      clientPhone,
      type,
      address,
      notes,
      orderItems: orderItemsToInsert,
    } = body;
    const today = new Date().toISOString().slice(0, 10);
    const countQuery = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM orders
      WHERE DATE("createdAt") = ${today}
      `);
    const todayOrdersCount = countQuery.rows[0] as { count: string };
    const order = await db
      .insert(orders)
      .values({
        clientFullName,
        clientPhone,
        status: "pending",
        notes,
        type,
        address,
        number: +todayOrdersCount.count + 1,
      })
      .returning();
    const orderItems = await db
      .insert(ordersToMenuItems)
      .values(
        orderItemsToInsert.map((item: { id: number; quantity: number }) => ({
          orderId: order[0].id,
          menuItemId: item.id,
          quantity: item.quantity,
        }))
      )
      .returning();
    const orderItemsToInsertWithId = orderItemsToInsert.map(
      (item: { id: number; quantity: number }, index: number) => ({
        ...item,
        id: orderItems[index].id,
      })
    );
    if (
      orderItemsToInsertWithId.some((item: any) => item.supplements?.length)
    ) {
      await db.insert(ordersToMenuItemsToSupplements).values(
        orderItemsToInsertWithId.flatMap(
          (item: { id: number; supplements: number[] }) =>
            item.supplements.map((supplementId) => ({
              orderToMenuItemId: item.id,
              supplementId,
            }))
        )
      );
    }
    return Response.json(
      {
        ok: true,
        orderId: order[0].id,
        orderNumber: order[0].number,
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
