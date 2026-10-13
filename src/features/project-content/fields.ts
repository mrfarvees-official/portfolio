import type { Field } from "../admin/registry";
export const sectionFields: Field[] = [
  { name: "title", label: "Section heading", required: true, max: 200 },
  { name: "body", label: "Content (Markdown)", type: "textarea", hint: "Write paragraphs, lists and code blocks. Use ### for subheadings; the section heading is added automatically." },
  { name: "imageSrc", label: "Section image", type: "image", max: 2048 },
  { name: "imageAlt", label: "Image description", max: 300 },
  { name: "imageCaption", label: "Image caption", max: 500 },
  { name: "sort", label: "Display order", type: "number", hint: "Lower numbers appear first. Entries with the same order use creation order." },
  { name: "published", label: "Show on case-study page", type: "checkbox" },
];
