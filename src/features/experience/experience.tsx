import Link from "next/link";
import type { experiences } from "../../db/schema";
import { Section, Tags } from "../../components/ui";
type Item = typeof experiences.$inferSelect;
export function period(e: Item) { const end = e.ongoing ? "Present" : e.endedAt; return [e.startedAt, end].filter(Boolean).join(" – "); }
export function Experience({ intro, items }: { intro: string; items: Item[] }) {
  if (!items.length) return null;
  return <Section id="experience" title="Experience" intro={intro}><div className="experience-list">{items.map(e => <article className={`experience-card panel${e.organizationLogo ? " has-logo" : ""}`} key={e.id}>
    {e.organizationLogo && <div className="experience-logo"><img src={e.organizationLogo} alt={e.organization ? `${e.organization} logo` : ""} width={64} height={64} loading="lazy"/></div>}
    <div className="experience-content">
      <div className="experience-meta"><span className={`badge${e.kind === "Freelance" ? " badge-blue" : ""}`}>{e.kind}</span>{period(e) && <small className="eyebrow">{period(e)}</small>}</div>
      <h3>{e.title}</h3>
      {(e.organization || e.role) && <p className="experience-role">{[e.role, e.organization].filter(Boolean).join(" · ")}</p>}
      {e.summary && <p className="experience-summary">{e.summary}</p>}
      <Tags items={(e.tags ?? []).slice(0, 6)}/>
      <div className="actions"><Link className="button" href={`/experience/${e.slug}`}>View details</Link></div>
    </div>
  </article>)}</div></Section>;
}
