import "server-only";
import { connection } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "../../db";
import { projects } from "../../db/schema";
export async function getProjects() { await connection(); return db.select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.sort), asc(projects.id)); }
export async function getProject(slug: string) {
  await connection();
  const [p] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return p?.published ? p : null;
}
export async function getNextProject(slug: string) {
  const all = await getProjects();
  return all.length > 1 ? all[(all.findIndex(p => p.slug === slug) + 1) % all.length] : null;
}
