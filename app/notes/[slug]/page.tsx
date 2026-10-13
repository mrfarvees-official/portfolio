import { notFound } from "next/navigation";
import { getNote } from "../../../src/features/notes/queries";
import { NoteDetail } from "../../../src/features/notes/note-detail";
export const instant = false;
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const note = await getNote((await params).slug);
  return { title: note?.title ?? "Not found", description: note?.excerpt ?? undefined };
}
export default async function Note({ params }: Props) {
  const n = await getNote((await params).slug);
  if (!n) notFound();
  return <NoteDetail note={n}/>;
}
