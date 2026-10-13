"use client";
import { useActionState, useId } from "react";
import Link from "next/link";
import { saveRecord, saveSettings, deleteRecord, saveSocialLink, deleteSocialLink } from "./actions";
import { socialFields, type Field, type Collection } from "./registry";
import type { media, socialLinks } from "../../db/schema";
type Media = Pick<typeof media.$inferSelect,"src"|"name"|"alt">;
type SocialLinkRecord = typeof socialLinks.$inferSelect;
function valueOf(field: Field, value: unknown) {
  if (field.type === "list") return Array.isArray(value) ? value.join(", ") : "";
  if (field.type === "gallery") return Array.isArray(value) ? value.map(x=>`${x.src} | ${x.alt} | ${x.caption}`).join("\n") : "";
  if (field.type === "json") return JSON.stringify(value ?? [],null,2);
  if (field.type === "datetime") return value ? new Date(String(value)).toISOString().slice(0,16) : "";
  return String(value ?? (field.name === "coverStyle" ? "blue" : field.name === "readMins" ? 5 : ""));
}
export function Fields({ fields, record, media }: { fields: Field[]; record: Record<string,unknown>; media: Media[] }) {
  const mediaListId = useId();
  return <div className="field-grid">{fields.map(field => <label className={`field${["textarea","gallery","json"].includes(field.type ?? "") ? " field-wide" : ""}${field.type === "checkbox" ? " checkbox-field" : ""}`} key={field.name}>{field.label}
    {field.type === "checkbox" ? <input name={field.name} type="checkbox" defaultChecked={Boolean(record[field.name])}/> : ["textarea","gallery","json"].includes(field.type ?? "") ? <textarea className={/Body$|^body$/.test(field.name) ? "markdown-input" : ""} name={field.name} defaultValue={valueOf(field,record[field.name])} required={field.required}/> : field.type === "select" ? <select name={field.name} defaultValue={valueOf(field,record[field.name])}>{field.options?.map(o=><option key={o}>{o}</option>)}</select> : <input name={field.name} type={field.type === "number" ? "number" : field.type === "datetime" ? "datetime-local" : "text"} min={field.name === "readMins" ? 1 : 0} maxLength={field.max} required={field.required} defaultValue={valueOf(field,record[field.name])} list={field.type === "image" ? mediaListId : undefined}/>}
    {field.hint && <small>{field.hint}</small>}
    {field.type === "image" && <small>Choose an uploaded image or paste an image URL. Upload new images in Media.</small>}
  </label>)}<datalist id={mediaListId}>{media.map(m=><option key={m.src} value={m.src}>{m.name} — {m.alt}</option>)}</datalist></div>;
}
export function RecordEditor({ feature, fields, record = {}, media }: { feature: Collection; fields: Field[]; record?: Record<string,unknown>; media: Media[] }) {
  const [state,action,pending] = useActionState(saveRecord,{});
  const [delState,delAction,delPending] = useActionState(deleteRecord,{});
  const warning = feature === "projects" ? "Delete this project and all its case-study sections? This cannot be undone. (Untick Published to just hide it.)" : "Delete this entry? This cannot be undone.";
  return <details className="editor panel" open={!record.id}><summary>{String(record.title || record.label || "Add new")}{record.slug ? ` /${record.slug}` : ""}{feature === "experience" && record.kind ? ` · ${String(record.kind)}${record.published ? "" : " (hidden)"}` : ""}</summary><form action={action}><input type="hidden" name="feature" value={feature}/><input type="hidden" name="id" value={String(record.id || 0)}/><Fields fields={fields} record={record} media={media}/>{(state.error || state.success) && <p className="notice" role="status">{state.error || state.success}</p>}<div className="actions"><button className="button" disabled={pending}>{pending ? "Saving…" : record.id ? "Save changes" : "Create"}</button>{feature === "projects" && record.slug ? <Link className="text-link" href={`/admin/project-content?project=${encodeURIComponent(String(record.slug))}`}>Manage case-study sections →</Link> : null}</div></form>{record.id ? <form action={delAction} onSubmit={e=>{ if(!confirm(warning)) e.preventDefault(); }}><input type="hidden" name="feature" value={feature}/><input type="hidden" name="id" value={String(record.id)}/>{delState.error && <p className="notice" role="status">{delState.error}</p>}<button className="button button-secondary" disabled={delPending}>{delPending ? "Deleting…" : "Delete"}</button></form> : null}</details>;
}
export function SettingsEditor({ section, fields, record, media }: { section: string; fields: Field[]; record: Record<string,unknown>; media: Media[] }) {
  const [state,action,pending] = useActionState(saveSettings,{});
  return <details className="editor panel"><summary>{section[0].toUpperCase()+section.slice(1)}</summary><form action={action}><input type="hidden" name="section" value={section}/><Fields fields={fields} record={record} media={media}/>{(state.error || state.success) && <p className="notice" role="status">{state.error || state.success}</p>}<button className="button" disabled={pending}>{pending ? "Saving…" : "Save section"}</button></form></details>;
}
function SocialLinkEditor({ record, media }: { record?: SocialLinkRecord; media: Media[] }) {
  const [state,action,pending] = useActionState(saveSocialLink,{});
  const [delState,delAction,delPending] = useActionState(deleteSocialLink,{});
  return <details className="social-editor" open={!record}><summary>{record?.name || "Add social profile"}{record && !record.published ? " (hidden)" : ""}</summary><form action={action}><input type="hidden" name="id" value={record?.id ?? 0}/><Fields fields={socialFields} record={record ?? {published:true}} media={media}/>{(state.error || state.success) && <p className="notice" role="status">{state.error || state.success}</p>}<button className="button" disabled={pending}>{pending ? "Saving…" : record ? "Save changes" : "Add profile"}</button></form>{record ? <form action={delAction} onSubmit={event=>{if(!confirm(`Delete the ${record.name} social link?`)) event.preventDefault();}}><input type="hidden" name="id" value={record.id}/>{delState.error && <p className="notice" role="status">{delState.error}</p>}<button className="button button-secondary" disabled={delPending}>{delPending ? "Deleting…" : "Delete"}</button></form> : null}</details>;
}
export function SocialLinksManager({ records, media }: { records: SocialLinkRecord[]; media: Media[] }) {
  return <section className="editor panel social-manager" aria-labelledby="social-manager-title"><h2 id="social-manager-title">Social media</h2><p>Add, update, hide, reorder or remove the profile buttons shown in the site footer.</p>{records.map(record=><SocialLinkEditor key={record.id} record={record} media={media}/>)}<SocialLinkEditor media={media}/></section>;
}
