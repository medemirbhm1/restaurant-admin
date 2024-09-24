import { hashPassword } from "@/lib/auth/password";
import { NewUser, insertUser, db } from "@/lib/db";
import {
  orders,
  ordersToMenuItems,
  ordersToMenuItemsToSupplements,
  reservations,
  supplements,
  users,
} from "@/lib/schema";
import { sql } from "drizzle-orm";

const main = async () => {
  const password = await hashPassword("admin");

  await db
    .delete(reservations)
    .where(sql`1 = 1`)
    .execute();

  process.exit();
};

main();
