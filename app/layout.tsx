import "./globals.css";
import { getSettings } from "../src/features/settings/queries";
import { SiteHeader, SiteFooter } from "../src/features/settings/site-shell";

export const instant = false;
export const metadata = { title: { default: "Developer portfolio", template: "%s | Portfolio" }, description: "Web software that ships and stays up." };

// Dark is the default; only an explicit saved "light" choice overrides it.
const THEME_SCRIPT = `try{if(localStorage.getItem("theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site } = await getSettings();
  return <html lang="en" data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}/></head><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader site={site}/>{children}<SiteFooter site={site}/></body></html>;
}
