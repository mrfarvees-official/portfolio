import type { services } from "../../db/schema";
import { Section } from "../../components/ui";
export function Services({ heading, items }: { heading: string; items: (typeof services.$inferSelect)[] }) {
  return <Section id="services" title={heading} sand><div className="three-grid">{items.map(v => <article className="service-card panel" key={v.id}><h3>{v.title}</h3><p>{v.body}</p>{v.ctaHref && <a className="text-link" href={v.ctaHref}>{v.ctaLabel}</a>}</article>)}</div></Section>;
}
