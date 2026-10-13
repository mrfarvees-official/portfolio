import Link from "next/link";
import type { projects, projectSections } from "../../db/schema";
import { sectionsToMarkdown } from "../project-content/markdown";
import { ButtonLink, Tags } from "../../components/ui";
import { Markdown, Contents } from "../../components/markdown";
import { ProjectCover } from "./project-card";
type Project = typeof projects.$inferSelect;
export function ProjectDetail({ project: p, next, sections = [] }: { project: Project; next: Project | null; sections?: (typeof projectSections.$inferSelect)[] }) {
  const body = p.sectionsEnabled ? sectionsToMarkdown(sections) : p.caseBody ?? "";
  return <main id="main-content" className="container detail-page"><div className="detail-heading"><Link className="text-link back-link" href="/#work">← Work</Link><span className="badge badge-blue">Case study</span><h1>{p.title}</h1><p className="lead">{p.caseIntro || p.summary}</p><dl className="project-meta panel">{[["Type",p.type],["Started",p.startedAt],["Role",p.role]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl><Tags items={p.tags}/><div className="actions">{p.liveUrl && <ButtonLink href={p.liveUrl}>Visit live site ↗</ButtonLink>}{p.sourceUrl && <ButtonLink href={p.sourceUrl} secondary>Source code</ButtonLink>}</div><ProjectCover project={p} large/></div><div className="article-grid"><article><Markdown body={body}/>{(p.gallery ?? []).map((image,i) => <figure className="article-image" key={`${image.src}-${i}`}><img src={image.src} alt={image.alt} loading="lazy"/>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</article><Contents body={body}/></div><section className="case-contact panel"><h2>Want something like this built?</h2><p>{p.contactText || "Tell me what you're working on."}</p><ButtonLink href="/#contact">Get in touch →</ButtonLink></section>{next && <Link className="next-project panel" href={`/work/${next.slug}`}><small className="eyebrow">Next case study</small><h2>{next.title} →</h2><p>{next.type}</p></Link>}</main>;
}
