import type { Settings } from "../../lib/settings";
import { ButtonLink } from "../../components/ui";
export function Contact({ cta }: { cta: Settings["cta"] }) {
  return <section id="contact" className="section section-sand"><div className="container"><div className="contact-panel panel"><h2>{cta.heading}</h2><p>{cta.text}</p><div className="actions"><ButtonLink href={cta.callHref} secondary>{cta.callLabel} ↗</ButtonLink><span>Or email me at <a href={`mailto:${cta.email}`}>{cta.email}</a></span></div><a className="text-link" href={`mailto:${cta.email}`}>Write email →</a></div></div></section>;
}
