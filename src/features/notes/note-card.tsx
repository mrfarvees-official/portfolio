import Link from "next/link";
import type { notes } from "../../db/schema";
export type Note = typeof notes.$inferSelect;
export function NoteMeta({ note: n }: { note: Note }) {
  return <small className="eyebrow">{n.publishedAt?.toLocaleDateString("en-GB", {day:"numeric",month:"short",year:"numeric",timeZone:"UTC"})} · {n.readMins} min read</small>;
}
export function NoteCard({ note: n }: { note: Note }) {
  return <Link className="note-card panel" href={`/notes/${n.slug}`}>{n.coverImage && <img className="note-thumbnail" src={n.coverImage} alt={n.coverAlt || n.title} loading="lazy"/>}<span className="badge">{n.category || "Dev note"}</span><h3>{n.title}</h3>{n.excerpt && <p>{n.excerpt}</p>}<NoteMeta note={n}/></Link>;
}
