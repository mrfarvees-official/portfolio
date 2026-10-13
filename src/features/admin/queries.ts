import "server-only";
import { db } from "../../db";
import { projects,experiences,notes,services,skillGroups,media,socialLinks } from "../../db/schema";
import { asc,desc } from "drizzle-orm";
import type { Collection } from "./registry";
export async function getRecords(feature: Collection): Promise<Record<string,unknown>[]> {
  switch (feature) {
    case "projects": return db.select().from(projects).orderBy(asc(projects.sort));
    case "experience": return db.select().from(experiences).orderBy(asc(experiences.sort), desc(experiences.id));
    case "notes": return db.select().from(notes).orderBy(desc(notes.publishedAt));
    case "services": return db.select().from(services).orderBy(asc(services.sort));
    case "skills": return db.select().from(skillGroups).orderBy(asc(skillGroups.sort));
  }
}
export const getMedia = () => db.select().from(media).orderBy(desc(media.id));
export const getSocialLinks = () => db.select().from(socialLinks).orderBy(asc(socialLinks.sort), asc(socialLinks.id));
