import Link from "next/link";
import { registry, isCollection, type Field } from "./registry";
import { getRecords, getMedia, getSocialLinks } from "./queries";
import { RecordEditor, SettingsEditor, SocialLinksManager } from "./editor";
import { getSettings } from "../settings/queries";
import { logout } from "./actions";
import { MediaManager } from "../media/media-manager";
import { notFound,redirect } from "next/navigation";
import { isAdmin } from "../../lib/auth";
import { ProjectContentManager } from "../project-content/manager";
function settingFields(object: Record<string,unknown>, prefix = ""): { fields: Field[]; record: Record<string,unknown> } {
  const fields: Field[] = [], record: Record<string,unknown> = {};
  for(const [name,value] of Object.entries(object)) {
    if (!prefix && name === "socials") continue;
    const path = prefix ? `${prefix}.${name}` : name;
    if(value && typeof value === "object" && !Array.isArray(value)) {
      const nested = settingFields(value as Record<string,unknown>,path); fields.push(...nested.fields); Object.assign(record,nested.record);
    } else {
      fields.push({name:path,label:path.replace(/([A-Z])/g," $1").replaceAll("."," / "),type:Array.isArray(value) ? "json" : name === "photo" ? "image" : /headline|subtext|^p[12]$|text|intro|tagline/i.test(name) ? "textarea" : "text",hint:Array.isArray(value) ? 'JSON links: [{"label":"Work","href":"/#work"}]' : undefined}); record[path]=value;
    }
  }
  return {fields,record};
}
export async function Admin({ feature, projectSlug }: { feature: string; projectSlug?: string }) {
  if (!await isAdmin()) redirect("/admin/login");
  if(!isCollection(feature) && feature !== "settings" && feature !== "media" && feature !== "project-content") notFound();
  const media = await getMedia();
  const settingsData = feature === "settings" ? await Promise.all([getSettings(),getSocialLinks()]) : null;
  const title = isCollection(feature) ? registry[feature].label : feature === "settings" ? "Site settings" : feature === "project-content" ? "Case-study content" : "Media library";
  return <main id="main-content" className="container admin-page"><div className="admin-heading"><div><small className="eyebrow">PORTFOLIO / ADMIN</small><h1>{title}</h1></div><div className="actions"><Link className="text-link" href="/">View site ↗</Link><form action={logout}><button className="button button-secondary">Sign out</button></form></div></div><nav className="admin-nav" aria-label="Content features">{[...Object.entries(registry).map(([key,value])=>[key,value.label]),["project-content","Case-study content"],["settings","Site settings"],["media","Media"]].map(([key,label])=><Link key={key} href={`/admin/${key}`} aria-current={key === feature ? "page" : undefined}>{label}</Link>)}</nav>
  {isCollection(feature) ? <><p className="notice">Edit existing content below, or create a new entry. Projects, experience and notes only appear publicly when Published is checked.{feature === "experience" ? " Experience entries cover employment and freelance work. They have no project images, only an optional company logo and website, and each gets its own page at /experience/your-slug." : ""}</p>{(await getRecords(feature)).map(r=><RecordEditor key={String(r.id)} feature={feature} fields={registry[feature].fields} record={r} media={media}/>)}<RecordEditor feature={feature} fields={registry[feature].fields} media={media}/></> : feature === "project-content" ? <ProjectContentManager slug={projectSlug} media={media}/> : feature === "settings" && settingsData ? <><SocialLinksManager records={settingsData[1]} media={media}/>{Object.entries(settingsData[0]).map(([section,value])=><SettingsEditor key={section} section={section} {...settingFields(value)} media={media}/>)}</> : <MediaManager items={media}/>}
  </main>;
}
