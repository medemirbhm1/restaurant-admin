import "@/lib/config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { user } from "./schema";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });
