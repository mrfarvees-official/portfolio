import "server-only";
import { connection } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "../../db";
import { skillGroups } from "../../db/schema";
export async function getSkillGroups() { await connection(); return db.select().from(skillGroups).orderBy(asc(skillGroups.sort)); }
