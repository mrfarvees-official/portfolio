import type { projects } from "../../db/schema";
import { ButtonLink, Tags } from "../../components/ui";
type Project = typeof projects.$inferSelect;
export function ProjectCover({ project: p, large = false }: { project: Project; large?: boolean }) {
  return <div className={`project-cover cover-${p.coverStyle ?? "blue"}${large ? " cover-large" : ""}`}>
    {!large && (p.inProgress || p.badge) && <span className={`badge${p.inProgress ? " badge-progress" : ""}`}>{p.inProgress ? "In progress" : p.badge}</span>}
    {p.coverImage ? <img src={p.coverImage} alt={p.coverAlt || p.title} loading={large ? "eager" : "lazy"}/> : <div className="browser-art" aria-hidden="true"><div className="browser-bar"><i/><i/><i/></div><div className="browser-content"><span/><span/><span/><b/></div></div>}
  </div>;
}
export function ProjectCard({ project: p }: { project: Project }) {
  return <article className="project-card"><ProjectCover project={p}/><div className="card-body"><small className="eyebrow">{p.type}</small><h3>{p.title}</h3><p>{p.summary}</p><Tags items={p.tags}/><div className="actions"><ButtonLink href={`/work/${p.slug}`}>Case study</ButtonLink>{p.liveUrl && <ButtonLink href={p.liveUrl} secondary>{p.liveLabel || "Visit"}</ButtonLink>}{p.sourceUrl && <a className="text-link" href={p.sourceUrl} target="_blank" rel="noopener noreferrer">Source</a>}</div></div></article>;
}
