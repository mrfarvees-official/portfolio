import Link from "next/link";
import type { ReactNode } from "react";
import { techIcon, techIconAsset } from "./tech-icons";
export function ButtonLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  const external = /^https?:///i.test(href);
  return <Link className={`button${secondary ? " button-secondary" : ""}`} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</Link>;
}
export function Tags({ items }: { items: string[] | null }) {
  return <ul className="tags">{(items ?? []).map(item => {
    // "Label|icon": icon is a Simple Icons slug (e.g. rust) or an image URL/path. Without it, fall back to the built-in lookup.
    const [label, custom = ""] = item.split("|").map(part => part.trim());
    const customSrc = /^(https?:\/\/|\/(?!\/))\S+$/i.test(custom) ? custom : /^[a-z0-9.-]+$/i.test(custom) ? `https://cdn.simpleicons.org/${custom.toLowerCase()}` : "";
    const localAsset = techIconAsset(label) || "";
    const src = customSrc || localAsset;
    const Icon = src ? undefined : techIcon(label);
    return <li key={item}>{src ? <img className={`tag-icon${localAsset ? " tag-icon-wide" : ""}`} src={src} alt="" width={localAsset ? 63 : 20} height={20} loading="lazy"/> : Icon && <Icon aria-hidden="true"/>}{label}</li>;
  })}</ul>;
}
export function Section({ id, title, intro, children, sand = false }: { id: string; title: string; intro?: string; children: ReactNode; sand?: boolean }) {
  return <section id={id} className={`section${sand ? " section-sand" : ""}`}><div className="container"><h2>{title}</h2>{intro && <p className="section-intro">{intro}</p>}{children}</div></section>;
}
