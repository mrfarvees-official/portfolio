"use client";
import { useActionState } from "react";
import { saveResume, deleteResume } from "./actions";
import type { resumes } from "../../db/schema";
type Resume = typeof resumes.$inferSelect;
function size(bytes: number | null) { return bytes ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : ""; }
function ResumeRow({ item, latest }: { item: Resume; latest: boolean }) {
  const [state, action, pending] = useActionState(deleteResume, {});
  return <article className="editor panel">
    <p><strong>{item.name}.pdf</strong> {latest && <span className="badge badge-blue">Current</span>}</p>
    <small>Uploaded {item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 16).replace("T", " ") + " UTC" : ""} {size(item.sizeBytes) && `· ${size(item.sizeBytes)}`}</small>
    <div className="actions"><a className="text-link" href={item.src} target="_blank" rel="noopener noreferrer">Preview ↗</a>
      <form action={action} onSubmit={e => { if (!confirm("Delete this resume? This cannot be undone.")) e.preventDefault(); }}><input type="hidden" name="id" value={item.id}/><button className="button button-secondary" disabled={pending}>{pending ? "Deleting…" : "Delete"}</button></form></div>
    {(state.error || state.success) && <p className="notice" role="status">{state.error || state.success}</p>}
  </article>;
}
export function ResumeManager({ items }: { items: Resume[] }) {
  const [state, action, pending] = useActionState(saveResume, {});
  return <>
    <p className="notice">Upload a PDF to Cloudinary. The newest upload is the one visitors get from the <strong>Download resume</strong> button in the hero. Upload a new file any time to replace it. Older versions are kept until you delete them.{!items.length && " No resume uploaded yet, so the button is hidden on the site."}</p>
    <div className="editor panel"><h2>Upload a new resume</h2>
      <form action={action}>
        <div className="field-grid">
          <label className="field">Download file name<input name="name" defaultValue="Saroath-Farvees-Resume" required maxLength={100}/><small>Visitors see this name when the file downloads (.pdf is added).</small></label>
          <label className="field">PDF file<input name="file" type="file" accept="application/pdf" required/><small>PDF only, up to 10 MB.</small></label>
        </div>
        {(state.error || state.success) && <p className="notice" role="status">{state.error || state.success}</p>}
        <button className="button" disabled={pending}>{pending ? "Uploading…" : "Upload resume"}</button>
      </form></div>
    {items.map((item, i) => <ResumeRow key={item.id} item={item} latest={i === 0}/>)}
  </>;
}
