"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../../db";
import { resumes } from "../../db/schema";
import { isAdmin } from "../../lib/auth";
import type { ActionState } from "../admin/actions";
import { getCloudinaryConfig, uploadDocument, deleteDocument, CloudinaryError } from "../media/cloudinary";
const MAX_BYTES = 10 * 1024 * 1024;
function refresh() { revalidatePath("/", "layout"); }
export async function saveResume(_state: ActionState, form: FormData): Promise<ActionState> {
  try {
    if (!await isAdmin()) return { error: "Sign in to manage the resume." };
    const name = String(form.get("name") ?? "").trim().replace(/\.pdf$/i, "");
    if (!name || name.length > 100 || !/^[\w .()-]+$/.test(name)) return { error: "Enter a file name using letters, numbers, spaces, dots, hyphens or underscores (up to 100 characters)." };
    const file = form.get("file");
    if (!(file instanceof File) || !file.size) return { error: "Choose a PDF file to upload." };
    if (file.size > MAX_BYTES) return { error: "Choose a PDF smaller than 10 MB." };
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.subarray(0, 5).toString() !== "%PDF-") return { error: "That file is not a PDF." };
    const uploaded = await uploadDocument(new File([new Uint8Array(bytes)], "resume.pdf", { type: "application/pdf" }), getCloudinaryConfig());
    try {
      await db.insert(resumes).values({ src: uploaded.src, publicId: uploaded.publicId, assetId: uploaded.assetId, name, sizeBytes: file.size });
    } catch {
      try { await deleteDocument(uploaded.publicId, getCloudinaryConfig()); } catch { console.error("Could not clean up a resume upload after its database save failed."); }
      return { error: "Could not save the resume to the database. Please try again." };
    }
    refresh();
    return { success: "Resume uploaded. Visitors now download this version." };
  } catch (error) {
    return { error: error instanceof CloudinaryError ? error.message : "Could not upload the resume. Check your Cloudinary settings." };
  }
}
export async function deleteResume(_state: ActionState, form: FormData): Promise<ActionState> {
  try {
    if (!await isAdmin()) return { error: "Sign in to manage the resume." };
    const id = Number(form.get("id"));
    if (!Number.isSafeInteger(id) || id < 1) return { error: "Invalid resume." };
    const [row] = await db.select().from(resumes).where(eq(resumes.id, id)).limit(1);
    if (!row) return { error: "Resume not found. Refresh the page." };
    await db.delete(resumes).where(eq(resumes.id, id));
    if (row.publicId) { try { await deleteDocument(row.publicId, getCloudinaryConfig()); } catch { console.error("Could not delete a resume file from Cloudinary."); } }
    refresh();
    return { success: "Resume deleted." };
  } catch { return { error: "Could not delete the resume." }; }
}
