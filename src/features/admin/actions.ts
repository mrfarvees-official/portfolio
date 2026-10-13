"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { projects,experiences,notes,services,skillGroups,settings,socialLinks } from "../../db/schema";
import { isAdmin, COOKIE } from "../../lib/auth";
import { isCollection, registry, socialFields } from "./registry";
import { parseFields, safeUrl } from "./validation";
import { defaults } from "../../lib/settings";
export type ActionState = { error?: string; success?: string };
async function requireAdmin() { if (!await isAdmin()) throw new Error("Sign in to save changes."); }
function refresh() { revalidatePath("/","layout"); }
async function experienceSlug(title: string, wanted: string | null, id: number) {
  const base = (wanted || title).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,120) || "experience";
  const taken = new Set((await db.select({id:experiences.id,slug:experiences.slug}).from(experiences)).filter(r=>r.id!==id).map(r=>r.slug));
  let slug = base, n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  return slug;
}
export async function saveRecord(_state: ActionState, form: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const feature = String(form.get("feature"));
    if (!isCollection(feature)) throw new Error("Unknown feature.");
    const values = parseFields(registry[feature].fields,form);
    const id = Number(form.get("id"));
    if (!Number.isSafeInteger(id) || id < 0) throw new Error("Invalid record.");
    switch(feature) {
      case "projects": { const v = values as typeof projects.$inferInsert; if(id) await db.update(projects).set(v).where(eq(projects.id,id)); else await db.insert(projects).values(v); break; }
      case "experience": { const v = values as typeof experiences.$inferInsert; v.slug = await experienceSlug(v.title,(values.slug as string | null) ?? null,id); if(id) await db.update(experiences).set(v).where(eq(experiences.id,id)); else await db.insert(experiences).values(v); break; }
      case "notes": { const v = values as typeof notes.$inferInsert; if(id) await db.update(notes).set(v).where(eq(notes.id,id)); else await db.insert(notes).values(v); break; }
      case "services": { const v = values as typeof services.$inferInsert; if(id) await db.update(services).set(v).where(eq(services.id,id)); else await db.insert(services).values(v); break; }
      case "skills": { const v = values as typeof skillGroups.$inferInsert; if(id) await db.update(skillGroups).set(v).where(eq(skillGroups.id,id)); else await db.insert(skillGroups).values(v); break; }
    }
    refresh(); return {success:"Saved. Changes are now visible on the site."};
  } catch(error) {
    const cause = error as { cause?: { code?: string }; code?: string };
    if (cause.code === "ER_DUP_ENTRY" || cause.cause?.code === "ER_DUP_ENTRY") return {error:"That slug is already used. Choose another."};
    if ((cause as {query?:string}).query || cause.cause) { console.error("Content save failed"); return {error:"Could not save. Check the database connection and try again."}; }
    return {error:error instanceof Error ? error.message : "Could not save."};
  }
}
export async function deleteRecord(_state: ActionState, form: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const feature = String(form.get("feature"));
    if (!isCollection(feature)) throw new Error("Unknown feature.");
    const id = Number(form.get("id"));
    if (!Number.isSafeInteger(id) || id < 1) throw new Error("Invalid record.");
    switch(feature) {
      case "projects": await db.delete(projects).where(eq(projects.id,id)); break; // case-study sections cascade
      case "experience": await db.delete(experiences).where(eq(experiences.id,id)); break;
      case "notes": await db.delete(notes).where(eq(notes.id,id)); break;
      case "services": await db.delete(services).where(eq(services.id,id)); break;
      case "skills": await db.delete(skillGroups).where(eq(skillGroups.id,id)); break;
    }
    refresh(); return {success:"Deleted."};
  } catch(error) { return {error:error instanceof Error && !('query' in error) ? error.message : "Could not delete. Check the database connection and try again."}; }
}
export async function saveSocialLink(_state: ActionState, form: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const values = parseFields(socialFields, form) as typeof socialLinks.$inferInsert;
    const id = Number(form.get("id"));
    if (!Number.isSafeInteger(id) || id < 0) throw new Error("Invalid social link.");
    if (id) await db.update(socialLinks).set(values).where(eq(socialLinks.id,id));
    else await db.insert(socialLinks).values(values);
    refresh();
    return {success:"Social link saved."};
  } catch(error) {
    return {error:error instanceof Error && !('query' in error) ? error.message : "Could not save the social link."};
  }
}
export async function deleteSocialLink(_state: ActionState, form: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const id = Number(form.get("id"));
    if (!Number.isSafeInteger(id) || id < 1) throw new Error("Invalid social link.");
    await db.delete(socialLinks).where(eq(socialLinks.id,id));
    refresh();
    return {success:"Social link deleted."};
  } catch(error) {
    return {error:error instanceof Error && !('query' in error) ? error.message : "Could not delete the social link."};
  }
}
export async function saveSettings(_state: ActionState, form: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const key = String(form.get("section"));
    if (!Object.hasOwn(defaults,key)) throw new Error("Unknown section.");
    const defaultTemplate = defaults[key as keyof typeof defaults];
    const template = key === "site"
      ? Object.fromEntries(Object.entries(defaultTemplate).filter(([name]) => name !== "socials"))
      : defaultTemplate;
    const read = (object: Record<string,unknown>, prefix = ""): Record<string,unknown> => Object.fromEntries(Object.entries(object).map(([name,value]) => {
      const path = prefix ? `${prefix}.${name}` : name;
      if (Array.isArray(value)) {
        const items: unknown = JSON.parse(String(form.get(path) || "[]"));
        if (!Array.isArray(items) || !items.every(x=>x && typeof x.label === "string" && typeof x.href === "string")) throw new Error("Navigation and social links need a JSON array of label/href objects.");
        items.forEach(x=>safeUrl(x.href)); return [name,items];
      }
      if (value && typeof value === "object") return [name,read(value as Record<string,unknown>,path)];
      const input = String(form.get(path) ?? "").trim();
      if (name === "href" || name === "photo" || name === "callHref") safeUrl(input,name === "photo");
      return [name,input];
    }));
    const value = read(template);
    await db.insert(settings).values({key,value}).onDuplicateKeyUpdate({set:{value}});
    refresh(); return {success:"Section saved."};
  } catch(error) { return {error:error instanceof SyntaxError ? "Invalid JSON in the links field." : error instanceof Error && !('query' in error) ? error.message : "Could not save settings."}; }
}
export async function logout() { await requireAdmin(); (await cookies()).delete(COOKIE); redirect("/admin/login"); }
