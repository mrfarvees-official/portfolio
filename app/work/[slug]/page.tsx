import { notFound } from "next/navigation";
import { getProject, getNextProject } from "../../../src/features/projects/queries";
import { ProjectDetail } from "../../../src/features/projects/project-detail";
import { getPublishedSections } from "../../../src/features/project-content/queries";
export const instant = false;
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const p = await getProject((await params).slug);
  return { title: p?.title ?? "Not found", description: p?.caseIntro ?? p?.summary ?? undefined };
}
export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const [next, sections] = await Promise.all([getNextProject(slug), project.sectionsEnabled ? getPublishedSections(project.id) : Promise.resolve([])]);
  return <ProjectDetail project={project} next={next} sections={sections}/>;
}
