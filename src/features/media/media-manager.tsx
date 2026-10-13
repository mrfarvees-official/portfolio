"use client";
import { useActionState, useState } from "react";
import { saveMedia, updateMedia } from "./actions";
import type { media } from "../../db/schema";
function MediaCard({ item }: { item: typeof media.$inferSelect }) {
  const [state, action, pending] = useActionState(updateMedia, {});
  const [copied, setCopied] = useState(false);
  return <article className="media-card panel">
    <img src={item.src} alt={item.alt}/>
    <span className="badge">{item.provider === "cloudinary" ? "Cloudinary" : "Image URL"}</span>
    <code>{item.src}</code>
    <button type="button" className="button button-secondary" onClick={async () => {
      try { await navigator.clipboard.writeText(item.src); setCopied(true); } catch { setCopied(false); }
    }}>{copied ? "Copied" : "Copy image URL"}</button>
    <form action={action}>
      <input type="hidden" name="id" value={item.id}/>
      <label className="field">Name<input name="name" defaultValue={item.name} required maxLength={200}/></label>
      <label className="field">Image description<input name="alt" defaultValue={item.alt} required maxLength={300}/></label>
      <button className="button" disabled={pending}>Save details</button>
      {(state.error || state.success) && <p role="status">{state.error || state.success}</p>}
    </form>
  </article>;
}
export function MediaManager({ items }: { items: (typeof media.$inferSelect)[] }) {
  const [name, setName] = useState("");
  const [alt, setAlt] = useState("");
  const [src, setSrc] = useState("");
  const [state, action, pending] = useActionState(async (previous: {error?:string;success?:string}, form: FormData) => {
    const result = await saveMedia(previous, form);
    if (result.success) { setName(""); setAlt(""); setSrc(""); }
    return result;
  }, {});
  return <>
    <div className="editor panel"><h2>Add an image</h2>
      <form action={action}>
        <div className="field-grid">
          <label className="field">Name<input name="name" value={name} onChange={event=>setName(event.target.value)} required maxLength={200}/></label>
          <label className="field">Image description<input name="alt" value={alt} onChange={event=>setAlt(event.target.value)} required maxLength={300}/></label>
          <label className="field">Upload to Cloudinary<input name="file" type="file" accept="image/png,image/jpeg,image/gif,image/webp"/><small>PNG, JPEG, GIF or WebP, up to 5 MB.</small></label>
          <label className="field">Or existing Cloudinary / image URL<input name="src" value={src} onChange={event=>setSrc(event.target.value)} placeholder="https://..." maxLength={2048}/></label>
        </div>
        <button className="button" disabled={pending}>{pending ? "Adding..." : "Add image"}</button>
        {(state.error || state.success) && <p className="notice" role="status">{state.error || state.success}</p>}
      </form>
    </div>
    <div className="media-grid">{items.map(item=><MediaCard key={item.id} item={item}/>)}</div>
    {!items.length && <p>No images yet. Uploaded images can be selected in project, note and site editors.</p>}
  </>;
}
