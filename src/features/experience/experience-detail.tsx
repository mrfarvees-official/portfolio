import Link from "next/link";
import type { experiences } from "../../db/schema";
import { Tags } from "../../components/ui";
import { period } from "./experience";
type Item = typeof experiences.$inferSelect;
export function ExperienceDetail({ experience: e }: { experience: Item }) {
  const blocks: [string, string | null][] = [["Problem solved", e.problem], ["What I did", e.description], ["Outcome", e.outcome]];
  return <main id="main-content" className="container detail-page">
    <div className="detail-heading">
      <Link className="text-link back-link" href="/#experience">← Experience</Link>
      {e.organizationLogo && <div className="experience-logo experience-logo-lg"><img src={e.organizationLogo} alt={e.organization ? `${e.organization} logo` : ""} width={64} height={64}/></div>}
      <div className="experience-meta"><span className={`badge${e.kind === "Freelance" ? " badge-blue" : ""}`}>{e.kind}</span>{period(e) && <small className="eyebrow">{period(e)}</small>}</div>
      <h1>{e.title}</h1>
      {e.summary && <p className="lead">{e.summary}</p>}
      <dl className="project-meta panel">{[["Role", e.role], ["Company", e.organization], ["Period", period(e)]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl>
      <Tags items={e.tags}/>
      {e.organizationUrl && <div className="actions"><a className="button button-secondary" href={e.organizationUrl} target="_blank" rel="noopener noreferrer">Visit {e.organization || "company"} ↗</a></div>}
    </div>
    <div className="experience-detail">
      {blocks.filter(([, text]) => text).map(([heading, text]) => <section className="experience-detail-block" key={heading}><h2>{heading}</h2><p>{text}</p></section>)}
    </div>
    <section className="case-contact panel"><h2>Want something like this built?</h2><p>Tell me what you're working on.</p><Link className="button" href="/#contact">Get in touch →</Link></section>
  </main>;
}
