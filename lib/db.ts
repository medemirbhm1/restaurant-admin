import "@/lib/config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { users } from "./schema";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });

export type NewUser = typeof users.$inferInsert;
export type NewSupplement = typeof schema.supplements

export const insertUser = async (userData: NewUser) => {
  return await db.insert(users).values(userData).returning();
};
