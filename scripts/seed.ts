import { hashPassword } from "@/lib/auth/password";
import { NewUser, insertUser, db } from "@/lib/db";
import {
  orders,
  ordersToMenuItems,
  ordersToMenuItemsToSupplements,
  supplements,
} from "@/lib/schema";
import { sql } from "drizzle-orm";

const main = async () => {
  await db.delete(ordersToMenuItemsToSupplements).where(sql`1 = 1`);
  await db.delete(ordersToMenuItems).where(sql`1 = 1`);
  await db.delete(orders).where(sql`1 = 1`);
  process.exit();
};

main();
