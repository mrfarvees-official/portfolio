import type { Field } from "./registry";
export function safeUrl(value: string, image = false) {
  if (!value) return value;
  if (/^\/(?!\/)/.test(value) || (!image && /^(#|mailto:|tel:)/i.test(value))) return value;
  try { if (["https:","http:"].includes(new URL(value).protocol)) return value; } catch {}
  throw new Error("Use a local path or an http/https URL.");
}
export function parseFields(fields: Field[], form: FormData): Record<string, unknown> {
  return Object.fromEntries(fields.map(field => {
    const value = String(form.get(field.name) ?? "").trim();
    if (field.required && !value) throw new Error(`${field.label} is required.`);
    if (field.max && value.length > field.max) throw new Error(`${field.label} must be ${field.max} characters or fewer.`);
    if (field.name === "slug" && (value || field.required) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new Error("Use lowercase letters, numbers and hyphens for the slug.");
    if (field.type === "checkbox") return [field.name, form.get(field.name) === "on"];
    if (field.type === "number") {
      const n = Number(value || (field.name === "readMins" ? 5 : 0));
      if (!Number.isSafeInteger(n) || n < 0 || n > 100000 || (field.name === "readMins" && n < 1)) throw new Error(`${field.label} must be a valid positive whole number.`);
      return [field.name,n];
    }
    if (field.type === "datetime") {
      const date = value ? new Date(`${value}Z`) : new Date();
      if (Number.isNaN(date.getTime())) throw new Error("Invalid publication date.");
      return [field.name,date];
    }
    if (field.type === "list") return [field.name,[...new Set(value.split(",").map(x=>x.trim()).filter(Boolean))]];
    if (field.type === "gallery") return [field.name,value.split("\n").filter(x=>x.trim()).map(line => {
      const [src,alt,caption] = line.split("|").map(x=>x.trim());
      if (!src || !alt) throw new Error("Each screenshot needs a URL and a description.");
      return {src:safeUrl(src,true),alt,caption:caption ?? ""};
    })];
    if (field.type === "select" && !field.options?.includes(value)) throw new Error("Invalid cover style.");
    if (field.type === "image" || /Url$|Href$|^(?:url|href)$/.test(field.name)) safeUrl(value,field.type === "image");
    return [field.name,value || null];
  }));
}
