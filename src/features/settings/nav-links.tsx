"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
type Item = { label: string; href: string };
// "/#work" -> "work"; a page link like "/notes" maps to the home section with the same id (the Dev notes section).
const idOf = (href: string) => (href.startsWith("/#") ? href.slice(2) : /^\/[a-z-]+$/.test(href) ? href.slice(1) : "");
// Highlights the nav item whose section is currently under the sticky header (home page), or the current page.
export function NavLinks({ items }: { items: Item[] }) {
  const pathname = usePathname();
  const [active, setActive] = useState("");
  useEffect(() => {
    if (pathname !== "/") { setActive(""); return; }
    const ids = items.map(i => idOf(i.href)).filter(id => document.getElementById(id));
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 140;
      let current = "";
      let best = -Infinity;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > best) { best = top; current = id; }
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids.at(-1) ?? current;
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [pathname, items]);
  return <>{items.map(n => {
    const id = idOf(n.href);
    const on = pathname === "/" ? !!id && active === id : n.href !== "/" && pathname.startsWith(n.href);
    return <Link key={n.label} href={n.href} className={on ? "nav-active" : undefined} aria-current={on ? (pathname === "/" ? "location" : "page") : undefined}>{n.label}</Link>;
  })}</>;
}
