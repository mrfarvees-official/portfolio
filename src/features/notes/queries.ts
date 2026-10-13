import "server-only";
import { connection } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { notes } from "../../db/schema";
export async function getNotes(limit?: number) {
  await connection();
  const q = db.select().from(notes).where(eq(notes.published, true)).orderBy(desc(notes.publishedAt), desc(notes.id));
  return limit ? q.limit(limit) : q;
}
export async function getNote(slug: string) {
  await connection();
  const [n] = await db.select().from(notes).where(eq(notes.slug, slug)).limit(1);
  return n?.published ? n : null;
}
