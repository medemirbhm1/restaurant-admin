import "@/lib/config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { user } from "./schema";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });

export type NewUser = typeof user.$inferInsert;

export const insertUser = async (userData: NewUser) => {
  return await db.insert(user).values(userData).returning();
};
