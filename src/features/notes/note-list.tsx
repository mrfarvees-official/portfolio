import { getNotes } from "./queries";
import { getSettings } from "../settings/queries";
import { NoteCard } from "./note-card";
export async function NoteList() {
  const [notes,s]=await Promise.all([getNotes(),getSettings()]);
  return <main id="main-content" className="container listing-page"><h1>Dev notes</h1><p className="lead">{s.notes.intro}</p><div className="three-grid">{notes.map(n=><NoteCard key={n.id} note={n}/>)}</div>{!notes.length && <p>No notes published yet.</p>}</main>;
}
