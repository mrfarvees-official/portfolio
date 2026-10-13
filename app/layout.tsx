import "./globals.css";
import { getSettings } from "../src/features/settings/queries";
import { SiteHeader, SiteFooter } from "../src/features/settings/site-shell";

export const instant = false;
export const metadata = { title: { default: "Developer portfolio", template: "%s | Portfolio" }, description: "Web software that ships and stays up." };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site } = await getSettings();
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader site={site}/>{children}<SiteFooter site={site}/></body></html>;
}
