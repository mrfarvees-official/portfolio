import "server-only";
import { connection } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "../../db";
import { services } from "../../db/schema";
export async function getServices() { await connection(); return db.select().from(services).orderBy(asc(services.sort)); }
