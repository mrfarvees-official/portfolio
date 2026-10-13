import "server-only";
import { connection } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db";
import { projectSections } from "../../db/schema";
export async function getPublishedSections(projectId: number) {
  await connection();
  return db.select().from(projectSections)
    .where(and(eq(projectSections.projectId, projectId), eq(projectSections.published, true)))
    .orderBy(asc(projectSections.sort), asc(projectSections.id));
}
export async function getEditableSections(projectId: number) {
  return db.select().from(projectSections).where(eq(projectSections.projectId, projectId))
    .orderBy(asc(projectSections.sort), asc(projectSections.id));
}
