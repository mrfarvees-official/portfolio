import "server-only";
import { connection } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "../../db";
import { resumes } from "../../db/schema";
export async function getResumes() { await connection(); return db.select().from(resumes).orderBy(desc(resumes.id)); }
export async function getLatestResume() { const all = await getResumes(); return all[0] ?? null; }
