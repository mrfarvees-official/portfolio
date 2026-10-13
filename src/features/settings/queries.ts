import "server-only";
import { connection } from "next/server";
import { db } from "../../db";
import { settings, socialLinks } from "../../db/schema";
import { defaults, type Settings } from "../../lib/settings";
import { asc, eq } from "drizzle-orm";
export async function getSettings(): Promise<Settings> {
  await connection();
  const out = structuredClone(defaults);
  const [settingRows, socials] = await Promise.all([
    db.select().from(settings),
    db.select().from(socialLinks).where(eq(socialLinks.published, true)).orderBy(asc(socialLinks.sort), asc(socialLinks.id)),
  ]);
  for (const row of settingRows) {
    if (Object.hasOwn(out, row.key) && row.value && typeof row.value === "object") Object.assign(out[row.key as keyof Settings], row.value);
  }
  out.site.socials = socials.map(({ name, label, href }) => ({ name, label, href }));
  return out;
}
