import { notFound } from "next/navigation";
import { getExperience } from "../../../src/features/experience/queries";
import { ExperienceDetail } from "../../../src/features/experience/experience-detail";
export const instant = false;
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const e = await getExperience((await params).slug);
  return { title: e?.title ?? "Not found", description: e?.summary ?? undefined };
}
export default async function ExperiencePage({ params }: Props) {
  const e = await getExperience((await params).slug);
  if (!e) notFound();
  return <ExperienceDetail experience={e}/>;
}
