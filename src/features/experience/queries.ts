import "server-only";
import { connection } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { experiences } from "../../db/schema";
export async function getExperience(slug: string) {
  await connection();
  const [e] = await db.select().from(experiences).where(eq(experiences.slug, slug)).limit(1);
  return e?.published ? e : null;
}
export async function getExperiences() { await connection(); return db.select().from(experiences).where(eq(experiences.published, true)).orderBy(asc(experiences.sort), desc(experiences.id)); }
