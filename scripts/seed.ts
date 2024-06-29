import { hashPassword } from "@/lib/auth/password";
import { NewUser, insertUser, db } from "@/lib/db";
import { menuItemCategory, supplements } from "@/lib/schema";
import { sql } from "drizzle-orm";

const main = async () => {
  // const password = "emir";
  // const hashedPassword = await hashPassword(password);
  // const userData: NewUser = {
  //   username: "emir",
  //   password: hashedPassword,
  //   type: "client",
  //   firstname: "emir",
  //   lastname: "client",
  //   phone: "1234567890",
  // };
  // await insertUser(userData);
  const supp = await db
    .insert(supplements)
    .values([
      {
        name: "Fromage",
        price: 100,
        categoryId: 10,
      },
      {
        name: "Sauce",
        price: 0,
        categoryId: 10,
      },
      {
        name: "Frittes",
        price: 200,
        categoryId: 10,
      },
    ])
    .returning();
    

  process.exit();
};

main();
