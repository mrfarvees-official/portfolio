import "server-only";
import { connection } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "../../db";
import { timeline } from "../../db/schema";
export async function getTimeline() { await connection(); return db.select().from(timeline).orderBy(asc(timeline.sort)); }
