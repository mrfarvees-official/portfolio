import type { projectSections } from "../../db/schema";
type Section = Pick<typeof projectSections.$inferSelect, "title" | "body" | "imageSrc" | "imageAlt" | "imageCaption">;
function escapeText(value: string) { return value.replace(/[\\`*_{}\[\]<>]/g, "\\$&"); }
export function sectionsToMarkdown(sections: Section[]) {
  return sections.map(section => {
    let body = "## " + escapeText(section.title.replace(/[\r\n]+/g, " ")) + "\n\n" + section.body;
    if (section.imageSrc) {
      body += "\n\n![" + escapeText(section.imageAlt || section.title) + "](<" + encodeURI(section.imageSrc) + ">)";
      if (section.imageCaption) body += "\n\n*" + escapeText(section.imageCaption) + "*";
    }
    return body;
  }).join("\n\n");
}
