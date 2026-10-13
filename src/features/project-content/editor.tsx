"use client";
import { useActionState } from "react";
import { Fields } from "../admin/editor";
import { saveSection, removeSection } from "./actions";
import { sectionFields } from "./fields";
import type { media, projectSections } from "../../db/schema";
type Media = Pick<typeof media.$inferSelect, "src" | "name" | "alt">;
export function SectionEditor({ projectId, section, media, nextOrder = 0 }: {
  projectId: number; section?: typeof projectSections.$inferSelect; media: Media[]; nextOrder?: number;
}) {
  const [state, action, pending] = useActionState(saveSection, {});
  const [deleteState, deleteAction, deleting] = useActionState(removeSection, {});
  return <details className="editor panel" open={!section}>
    <summary>{section ? `${section.sort}. ${section.title}${section.published ? "" : " (hidden)"}` : "Add section"}</summary>
    <form action={action} data-section-id={section?.id ?? "new"}>
      <input type="hidden" name="projectId" value={projectId}/><input type="hidden" name="id" value={section?.id ?? 0}/>
      <Fields fields={sectionFields} record={section ?? {sort:nextOrder,published:true}} media={media}/>
      {(state.error || state.success) && <p className="notice" role="status">{state.error || state.success}</p>}
      <button className="button" disabled={pending || deleting}>{pending ? "Saving…" : section ? "Save section" : "Add section"}</button>
    </form>
    {section && <form action={deleteAction} data-remove-section={section.id} onSubmit={event => {
      if (!window.confirm(`Remove “${section.title}”? This deletes this section's text and image reference.`)) event.preventDefault();
    }}><input type="hidden" name="projectId" value={projectId}/><input type="hidden" name="id" value={section.id}/>
      <button className="button button-secondary" disabled={pending || deleting}>{deleting ? "Removing…" : "Remove section"}</button>
      {(deleteState.error || deleteState.success) && <p className="notice" role="status">{deleteState.error || deleteState.success}</p>}
    </form>}
  </details>;
}
