import Link from "next/link";
import { Markdown, Contents } from "../../components/markdown";
import { NoteMeta, type Note } from "./note-card";
export function NoteDetail({ note: n }: {note:Note}) {
  return <main id="main-content" className="container detail-page"><div className="detail-heading"><Link className="text-link back-link" href="/notes">← Notes</Link><span className="badge badge-blue">{n.category || "Dev note"}</span><h1>{n.title}</h1><NoteMeta note={n}/>{n.excerpt && <p className="lead">{n.excerpt}</p>}{n.coverImage && <figure className="article-image"><img src={n.coverImage} alt={n.coverAlt || n.title}/></figure>}</div><div className="article-grid"><article><Markdown body={n.body ?? ""}/></article><Contents body={n.body ?? ""}/></div></main>;
}
