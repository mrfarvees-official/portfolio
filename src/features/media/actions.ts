"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../../db";
import { media } from "../../db/schema";
import { isAdmin } from "../../lib/auth";
import { safeUrl } from "../admin/validation";
import type { ActionState } from "../admin/actions";
import { imageType } from "./storage";
import { getCloudinaryConfig, uploadImage, rollbackUpload, CloudinaryError } from "./cloudinary";
import type { CloudinaryAsset } from "./cloudinary-api";

export async function saveMedia(_state: ActionState, form: FormData): Promise<ActionState> {
  try {
    if (!await isAdmin()) return {error:"Sign in to manage media."};
    const alt = String(form.get("alt") ?? "").trim();
    const name = String(form.get("name") ?? "").trim();
    if (!alt || alt.length > 300 || !name || name.length > 200) return {error:"Add a name and an image description (up to 300 characters)."};
    const file = form.get("file");
    let src = String(form.get("src") ?? "").trim();
    let uploaded: CloudinaryAsset | undefined;
    if (file instanceof File && file.size) {
      if (file.size > 5 * 1024 * 1024) return {error:"Choose an image smaller than 5 MB."};
      const bytes = Buffer.from(await file.arrayBuffer());
      const type = imageType(bytes);
      if (!type) return {error:"Use a PNG, JPEG, GIF or WebP image."};
      const config = getCloudinaryConfig();
      // Use the detected format rather than trusting the submitted filename/MIME.
      const validatedFile = new File([new Uint8Array(bytes)], "image." + type.ext, {type:type.mime});
      uploaded = await uploadImage(validatedFile, config);
      src = uploaded.src;
    } else {
      if (!src || src.length > 2048) return {error:"Choose a file or enter an image URL (up to 2048 characters)."};
      safeUrl(src, true);
    }
    try {
      await db.insert(media).values({
        src, name, alt,
        provider: uploaded || (src.startsWith("https://") && new URL(src).hostname === "res.cloudinary.com") ? "cloudinary" : "external",
        publicId: uploaded?.publicId ?? null,
        assetId: uploaded?.assetId ?? null,
      });
    } catch {
      if (uploaded) {
        try { await rollbackUpload(uploaded.publicId, getCloudinaryConfig()); }
        catch { console.error("Could not clean up a Cloudinary upload after its database save failed."); }
      }
      return {error:"Could not save the image to the database. Please try again."};
    }
    revalidatePath("/admin/media");
    return {success:"Added " + name + ". Use " + src + " in your content."};
  } catch (error) {
    return {error:error instanceof CloudinaryError ? error.message : "Could not add the image. Check the image URL and database access."};
  }
}
export async function updateMedia(_state: ActionState, form: FormData): Promise<ActionState> {
  if (!await isAdmin()) return {error:"Sign in to manage media."};
  const id = Number(form.get("id")), alt = String(form.get("alt") ?? "").trim(), name = String(form.get("name") ?? "").trim();
  if (!Number.isSafeInteger(id) || id < 1 || !alt || alt.length > 300 || !name || name.length > 200) return {error:"Enter a valid name and description."};
  try { await db.update(media).set({alt,name}).where(eq(media.id,id)); revalidatePath("/admin/media"); return {success:"Image details saved."}; }
  catch { return {error:"Could not update image details."}; }
}
