import { hashPassword } from "@/lib/auth/password";
import { NewUser, insertUser, db } from "@/lib/db";
import { menuItemCategory } from "@/lib/schema";
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
  await await db.execute(sql`DELETE from "menuItemCategory" where true`);
  process.exit();
};

main();
