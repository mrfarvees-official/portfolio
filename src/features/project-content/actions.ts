"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../../db";
import { projects, projectSections } from "../../db/schema";
import { isAdmin } from "../auth/session";
import type { ActionState } from "../admin/actions";
import { parseSection } from "./validation";

function ids(form: FormData) {
  const projectId = Number(form.get("projectId")), id = Number(form.get("id"));
  if (!Number.isSafeInteger(projectId) || projectId < 1 || !Number.isSafeInteger(id) || id < 0) throw new Error("Invalid section reference.");
  return { projectId, id };
}
function actionError(error: unknown): ActionState {
  return { error: error instanceof Error && !("query" in error) && !error.cause ? error.message : "Could not save the section. Check your database connection." };
}
export async function saveSection(_state: ActionState, form: FormData): Promise<ActionState> {
  try {
    if (!await isAdmin()) throw new Error("Sign in to manage case-study content.");
    const { projectId, id } = ids(form);
    const values = { ...parseSection(form), projectId } as typeof projectSections.$inferInsert;
    await db.transaction(async tx => {
      const [project] = await tx.select().from(projects).where(eq(projects.id, projectId)).limit(1);
      if (!project) throw new Error("Project not found.");
      if (id) {
        const condition = and(eq(projectSections.id, id), eq(projectSections.projectId, projectId));
        const [section] = await tx.select().from(projectSections).where(condition).limit(1);
        if (!section) throw new Error("Section not found. Refresh the editor.");
        await tx.update(projectSections).set(values).where(condition);
      } else {
        await tx.insert(projectSections).values(values);
      }
      await tx.update(projects).set({ sectionsEnabled: true }).where(eq(projects.id, projectId));
    });
    revalidatePath("/", "layout");
    return { success: id ? "Section updated." : "Section added." };
  } catch (error) { return actionError(error); }
}
export async function removeSection(_state: ActionState, form: FormData): Promise<ActionState> {
  try {
    if (!await isAdmin()) throw new Error("Sign in to manage case-study content.");
    const { projectId, id } = ids(form);
    if (!id) throw new Error("Choose a section to remove.");
    await db.transaction(async tx => {
      const condition = and(eq(projectSections.id, id), eq(projectSections.projectId, projectId));
      const [section] = await tx.select().from(projectSections).where(condition).limit(1);
      if (!section) throw new Error("Section not found. Refresh the editor.");
      await tx.delete(projectSections).where(condition);
      // An intentionally empty case study must not fall back to old placeholder text.
      await tx.update(projects).set({ sectionsEnabled: true }).where(eq(projects.id, projectId));
    });
    revalidatePath("/", "layout");
    return { success: "Section removed." };
  } catch (error) { return actionError(error); }
}
