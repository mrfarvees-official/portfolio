import { createHash, randomUUID } from "node:crypto";

export type CloudinaryConfig = {
  cloudName: string; apiKey: string; apiSecret: string; folder: string; folderMode: "dynamic" | "fixed";
};
export type CloudinaryAsset = { src: string; publicId: string; assetId: string };
export class CloudinaryError extends Error {}

export function cloudinaryConfig(env: Record<string, string | undefined>): CloudinaryConfig {
  const cloudName = env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) throw new CloudinaryError("Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to upload images.");
  if (!/^[a-zA-Z0-9_-]+$/.test(cloudName)) throw new CloudinaryError("Invalid Cloudinary cloud name.");
  const folder = (env.CLOUDINARY_FOLDER || "portfolio/images").trim().replace(/^\/+|\/+$/g, "");
  if (!folder || folder.length > 200 || !folder.split("/").every(segment => /^[a-zA-Z0-9_-]+$/.test(segment) && !/^v\d+$/.test(segment))) throw new CloudinaryError("Invalid Cloudinary folder. Use a path such as portfolio/images.");
  const folderMode = env.CLOUDINARY_FOLDER_MODE || "dynamic";
  if (folderMode !== "dynamic" && folderMode !== "fixed") throw new CloudinaryError("CLOUDINARY_FOLDER_MODE must be dynamic or fixed.");
  return { cloudName, apiKey, apiSecret, folder, folderMode };
}

// Cloudinary's signed REST protocol: sort upload parameters, append the secret,
// and hash. The file and api_key are not included in the signature.
function signedForm(params: Record<string, string>, config: CloudinaryConfig) {
  const toSign = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join("&");
  const signature = createHash("sha1").update(toSign + config.apiSecret).digest("hex");
  const form = new FormData();
  for (const [key, value] of Object.entries(params)) form.set(key, value);
  form.set("signature", signature);
  form.set("api_key", config.apiKey);
  return form;
}

async function request(operation: "upload" | "destroy", form: FormData, config: CloudinaryConfig, requestFetch: typeof fetch, resource: "image" | "raw" = "image") {
  try {
    const response = await requestFetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/${resource}/${operation}`, {
      method: "POST", body: form, signal: AbortSignal.timeout(60000), cache: "no-store",
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = typeof payload?.error?.message === "string" ? payload.error.message : "";
      // Explain recognized configuration errors without exposing provider responses or secrets.
      if (/^Invalid cloud_name\b/i.test(message)) throw new CloudinaryError("Invalid Cloudinary cloud name. Copy the Cloud name from your Cloudinary API Keys page into CLOUDINARY_CLOUD_NAME, then restart the app.");
      if (/^Invalid api[_ ]key\b/i.test(message)) throw new CloudinaryError("The Cloudinary API key does not match this cloud. Check CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY.");
      throw new CloudinaryError("Cloudinary rejected the request. Check your credentials, folder mode and account settings.");
    }
    return await response.json();
  } catch (error) {
    if (error instanceof CloudinaryError) throw error;
    throw new CloudinaryError("Could not reach Cloudinary. Please try again.");
  }
}

export async function uploadImage(file: File, config: CloudinaryConfig, requestFetch: typeof fetch = fetch): Promise<CloudinaryAsset> {
  const id = randomUUID();
  const publicId = `${config.folder}/${id}`;
  const params: Record<string, string> = { timestamp: String(Math.floor(Date.now() / 1000)), overwrite: "false" };
  if (config.folderMode === "fixed") { params.folder = config.folder; params.public_id = id; }
  else { params.asset_folder = config.folder; params.public_id = publicId; }
  const form = signedForm(params, config);
  form.set("file", file);
  const result = await request("upload", form, config, requestFetch);
  if (typeof result.secure_url !== "string" || !result.secure_url.startsWith("https://") || result.secure_url.length > 2048 || result.public_id !== publicId || typeof result.asset_id !== "string" || !result.asset_id || result.asset_id.length > 128) {
    throw new CloudinaryError("Cloudinary returned an invalid upload response.");
  }
  return { src: result.secure_url, publicId: result.public_id, assetId: result.asset_id };
}

// Used only to roll back an asset just uploaded by this application if its DB save fails.
export async function rollbackUpload(publicId: string, config: CloudinaryConfig, requestFetch: typeof fetch = fetch) {
  if (!publicId.startsWith(config.folder + "/")) throw new CloudinaryError("Invalid uploaded asset reference.");
  const form = signedForm({ public_id: publicId, invalidate: "true", timestamp: String(Math.floor(Date.now() / 1000)) }, config);
  const result = await request("destroy", form, config, requestFetch);
  if (result.result !== "ok" && result.result !== "not found") throw new CloudinaryError("Could not clean up the uploaded asset.");
}

// Documents (PDF resumes) are stored as Cloudinary raw assets; the public id keeps the file extension.
export async function uploadDocument(file: File, config: CloudinaryConfig, requestFetch: typeof fetch = fetch): Promise<CloudinaryAsset> {
  const id = randomUUID();
  const publicId = `${config.folder}/resume/${id}.pdf`;
  const params: Record<string, string> = { timestamp: String(Math.floor(Date.now() / 1000)), overwrite: "false" };
  if (config.folderMode === "fixed") { params.folder = `${config.folder}/resume`; params.public_id = `${id}.pdf`; }
  else { params.asset_folder = `${config.folder}/resume`; params.public_id = publicId; }
  const form = signedForm(params, config);
  form.set("file", file);
  const result = await request("upload", form, config, requestFetch, "raw");
  if (typeof result.secure_url !== "string" || !result.secure_url.startsWith("https://") || result.secure_url.length > 2048 || typeof result.public_id !== "string" || !result.public_id.startsWith(config.folder + "/") || typeof result.asset_id !== "string" || !result.asset_id || result.asset_id.length > 128) {
    throw new CloudinaryError("Cloudinary returned an invalid upload response.");
  }
  return { src: result.secure_url, publicId: result.public_id, assetId: result.asset_id };
}
export async function deleteDocument(publicId: string, config: CloudinaryConfig, requestFetch: typeof fetch = fetch) {
  if (!publicId.startsWith(config.folder + "/")) throw new CloudinaryError("Invalid uploaded asset reference.");
  const form = signedForm({ public_id: publicId, invalidate: "true", timestamp: String(Math.floor(Date.now() / 1000)) }, config);
  const result = await request("destroy", form, config, requestFetch, "raw");
  if (result.result !== "ok" && result.result !== "not found") throw new CloudinaryError("Could not delete the file from Cloudinary.");
}
