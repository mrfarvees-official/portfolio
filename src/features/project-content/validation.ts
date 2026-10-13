import { parseFields } from "../admin/validation";
import { sectionFields } from "./fields";
export function parseSection(form: FormData): Record<string, unknown> & { body: string } {
  const parsed = parseFields(sectionFields, form);
  if (parsed.imageSrc && !parsed.imageAlt) throw new Error("Add a description for the section image.");
  return { ...parsed, body: String(parsed.body ?? "") };
}
