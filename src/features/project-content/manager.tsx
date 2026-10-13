import Link from "next/link";
import { db } from "../../db";
import { projects, type media as mediaTable } from "../../db/schema";
import { asc } from "drizzle-orm";
import { getEditableSections } from "./queries";
import { SectionEditor } from "./editor";
export async function ProjectContentManager({ slug, media }: { slug?: string; media: (typeof mediaTable.$inferSelect)[] }) {
  const all = await db.select().from(projects).orderBy(asc(projects.sort), asc(projects.id));
  const project = slug ? all.find(p => p.slug === slug) : all[0];
  return <>
    <form method="get" className="editor panel"><div className="field-grid"><label className="field">Project<select name="project" defaultValue={project?.slug ?? ""}>{all.map(p => <option key={p.id} value={p.slug}>{p.title}</option>)}</select></label></div><button className="button">Open project</button></form>
    {project ? <>
      <div className="notice"><h2>{project.title}</h2><p>Add, edit, hide, reorder or remove sections. Section images are optional; upload them in Media first.</p><Link className="text-link" href={`/work/${project.slug}`}>View case study ↗</Link></div>
      {!project.sectionsEnabled && <p className="notice">This project still uses its legacy body. Adding the first section switches the page to these sections; the legacy body is retained in the database.</p>}
      <SectionList projectId={project.id} media={media}/>
    </> : <p className="notice">{all.length ? "Project not found. Choose a project above." : "Create a project first."}</p>}
  </>;
}
async function SectionList({ projectId, media }: { projectId: number; media: (typeof mediaTable.$inferSelect)[] }) {
  const sections = await getEditableSections(projectId);
  return <>{sections.map(section => <SectionEditor key={section.id} projectId={projectId} section={section} media={media}/>)}<SectionEditor key={`new-${projectId}-${sections.length}`} projectId={projectId} media={media} nextOrder={(sections.at(-1)?.sort ?? 0) + 10}/></>;
}
