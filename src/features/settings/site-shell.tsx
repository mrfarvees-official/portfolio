import Link from "next/link";
import { connection } from "next/server";
import { techIcon } from "../../components/tech-icons";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";
import type { Settings } from "../../lib/settings";
function SocialIcon({ name, label }: { name: string; label: string }) {
  const Icon = techIcon(name) ?? techIcon(label);
  return Icon ? <Icon aria-hidden="true" focusable="false"/> : <span aria-hidden="true">{label}</span>;
}
function Brand({ site }: { site: Settings["site"] }) {
  return (
    <Link className="brand" href="/" aria-label={`${site.brand}${site.brandAccent} home`}>
      <img className="brand-logo" src="/logo-cobalt.svg" alt="" width={40} height={40} />
      <span>{site.brand}<em>{site.brandAccent}</em></span>
    </Link>
  );
}
export function SiteHeader({ site }: { site: Settings["site"] }) {
  return <header className="site-header"><div className="container header-inner"><Brand site={site}/><nav aria-label="Main navigation"><NavLinks items={site.nav}/><ThemeToggle/></nav></div></header>;
}
export async function SiteFooter({ site }: { site: Settings["site"] }) {
  await connection();
  const year = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Colombo" }).format(new Date());
  // Support the template and legacy database values containing a fixed year.
  const copyright = site.copyright.includes("{year}")
    ? site.copyright.replaceAll("{year}", year)
    : site.copyright.replace(/^(©\s*)\d{4}\b/, (_match, prefix: string) => `${prefix}${year}`);
  return <footer className="site-footer"><div className="container"><div className="footer-top"><Brand site={site}/><nav aria-label="Footer navigation">{site.nav.map(n => <Link key={n.label} href={n.href}>{n.label}</Link>)}</nav></div><p>{site.tagline}</p><div className="footer-bottom"><small>{copyright}</small><div className="social-links" aria-label="Social media">{site.socials.map(x => <a key={`${x.name}-${x.href}`} href={x.href} aria-label={x.name} title={x.name} {...(/^https?:/i.test(x.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}><SocialIcon name={x.name} label={x.label}/></a>)}</div></div></div></footer>;
}
