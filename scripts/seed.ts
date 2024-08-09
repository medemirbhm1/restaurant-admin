import { hashPassword } from "@/lib/auth/password";
import { NewUser, insertUser, db } from "@/lib/db";
import {
  orders,
  ordersToMenuItems,
  ordersToMenuItemsToSupplements,
  supplements,
  users,
} from "@/lib/schema";
import { sql } from "drizzle-orm";

const main = async () => {
 
  const password = await hashPassword("admin");

  await db.insert(users).values({
    firstname: "admin",
    lastname: "admin",
    username: "admin",
    phone: "1234567890",
    type: "superadmin",
    password,
  })

  process.exit();
};

main();
