import "dotenv/config";
import mysql from "mysql2/promise";
import { defaults } from "../lib/settings";

// Additive migration: no dropped columns, tables or existing content.
async function main() {
  const connection=await mysql.createConnection(process.env.DATABASE_URL!);
  try {
    const additions: Record<string,Record<string,string>>={
      projects:{cover_alt:"varchar(300)",gallery:"json",contact_text:"text",sections_enabled:"boolean NOT NULL DEFAULT false",in_progress:"boolean NOT NULL DEFAULT false"},
      notes:{excerpt:"text",cover_image:"varchar(300)",cover_alt:"varchar(300)"},
    };
    for(const [table,columns] of Object.entries(additions)) {
      const [rows]=await connection.query<mysql.RowDataPacket[]>(`SHOW COLUMNS FROM \`${table}\``);
      const existing=new Set(rows.map(r=>r.Field));
      for(const [column,type] of Object.entries(columns)) if(!existing.has(column)) {
        await connection.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${type}`);
        // Preserve the original seeded "In progress" project when introducing
        // the dedicated status field. This only runs when the column is new.
        if (table === "projects" && column === "in_progress") {
          await connection.query("UPDATE projects SET in_progress = true WHERE badge = 'In progress'");
        }
        console.log(`Added ${table}.${column}`);
      }
    }
    await connection.query("CREATE TABLE IF NOT EXISTS media (id int AUTO_INCREMENT PRIMARY KEY, src varchar(300) NOT NULL, name varchar(200) NOT NULL, alt varchar(300) NOT NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP)");
    await connection.query(`CREATE TABLE IF NOT EXISTS project_sections (
      id int AUTO_INCREMENT PRIMARY KEY,
      project_id int NOT NULL,
      title varchar(200) NOT NULL,
      body longtext NOT NULL,
      image_src varchar(300),
      image_alt varchar(300),
      image_caption varchar(500),
      sort int NOT NULL DEFAULT 0,
      published boolean NOT NULL DEFAULT true,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      INDEX project_sections_order_idx (project_id, sort, id),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )`);
    await connection.query(`CREATE TABLE IF NOT EXISTS experiences (
      id int AUTO_INCREMENT PRIMARY KEY,
      title varchar(200) NOT NULL,
      kind varchar(20) NOT NULL DEFAULT 'Employment',
      organization varchar(160),
      role varchar(120),
      started_at varchar(20),
      ended_at varchar(20),
      ongoing boolean NOT NULL DEFAULT false,
      summary text,
      problem text,
      description text,
      outcome text,
      tags json,
      published boolean NOT NULL DEFAULT false,
      sort int DEFAULT 0,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    )`);
    await connection.query(`CREATE TABLE IF NOT EXISTS social_links (
      id int AUTO_INCREMENT PRIMARY KEY,
      name varchar(80) NOT NULL,
      label varchar(16) NOT NULL,
      href varchar(2048) NOT NULL,
      published boolean NOT NULL DEFAULT true,
      sort int NOT NULL DEFAULT 0,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      INDEX social_links_order_idx (published, sort, id)
    )`);
    const [socialCountRows] = await connection.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS total FROM social_links");
    if (Number(socialCountRows[0]?.total ?? 0) === 0) {
      const [siteRows] = await connection.query<mysql.RowDataPacket[]>("SELECT value FROM settings WHERE `key` = 'site' LIMIT 1");
      let legacySocials: unknown = siteRows[0]?.value;
      if (typeof legacySocials === "string") {
        try { legacySocials = JSON.parse(legacySocials); } catch { legacySocials = null; }
      }
      const fromSettings = legacySocials && typeof legacySocials === "object" && Array.isArray((legacySocials as {socials?:unknown}).socials)
        ? (legacySocials as {socials:Array<{name?:string;label?:string;href?:string}>}).socials
        : [];
      const initialSocials = fromSettings.length ? fromSettings : defaults.site.socials;
      const platformNames: Record<string,string> = { GH:"GitHub", in:"LinkedIn", X:"X" };
      for (const [sort, social] of initialSocials.entries()) {
        if (!social.label || !social.href) continue;
        await connection.query("INSERT INTO social_links (name, label, href, published, sort) VALUES (?, ?, ?, true, ?)", [social.name || platformNames[social.label] || social.label, social.label, social.href, sort + 1]);
      }
      console.log("Migrated site social links into social_links.");
    }
    const [experienceColumns] = await connection.query<mysql.RowDataPacket[]>("SHOW COLUMNS FROM experiences");
    const experienceExisting = new Set(experienceColumns.map(column => column.Field));
    for (const [column, type] of Object.entries({organization_logo:"varchar(2048)",organization_url:"varchar(300)"})) {
      if (!experienceExisting.has(column)) { await connection.query(`ALTER TABLE experiences ADD COLUMN \`${column}\` ${type}`); console.log(`Added experiences.${column}`); }
    }
    if (!experienceExisting.has("slug")) {
      // Add the slug as nullable, backfill it from each title, then lock it down.
      await connection.query("ALTER TABLE experiences ADD COLUMN slug varchar(140) NULL");
      const [rows] = await connection.query<mysql.RowDataPacket[]>("SELECT id, title FROM experiences ORDER BY id");
      const used = new Set<string>();
      for (const row of rows) {
        const base = String(row.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "experience";
        const slug = used.has(base) ? `${base}-${row.id}` : base;
        used.add(slug);
        await connection.query("UPDATE experiences SET slug = ? WHERE id = ?", [slug, row.id]);
      }
      await connection.query("ALTER TABLE experiences MODIFY COLUMN slug varchar(140) NOT NULL, ADD UNIQUE INDEX experiences_slug_unique (slug)");
      console.log("Added experiences.slug");
    }
    await connection.query(`CREATE TABLE IF NOT EXISTS resumes (
      id int AUTO_INCREMENT PRIMARY KEY,
      src varchar(2048) NOT NULL,
      public_id varchar(255),
      asset_id varchar(128),
      name varchar(200) NOT NULL,
      size_bytes int,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    )`);
    const [mediaColumns] = await connection.query<mysql.RowDataPacket[]>("SHOW COLUMNS FROM media");
    const mediaExisting = new Set(mediaColumns.map(column => column.Field));
    for (const [column, type] of Object.entries({provider:"varchar(20) NOT NULL DEFAULT 'external'",public_id:"varchar(255)",asset_id:"varchar(128)"})) {
      if (!mediaExisting.has(column)) await connection.query(`ALTER TABLE media ADD COLUMN \`${column}\` ${type}`);
    }
    // Widen image URL fields without shrinking or replacing existing values.
    for (const [table, column, nullable] of [["media","src",false],["projects","cover_image",true],["notes","cover_image",true],["project_sections","image_src",true]] as const) {
      const [columns] = await connection.query<mysql.RowDataPacket[]>(`SHOW COLUMNS FROM \`${table}\``);
      const current = columns.find(field => field.Field === column);
      const length = /^varchar\((\d+)\)$/i.exec(current?.Type ?? "");
      if (length && Number(length[1]) < 2048) await connection.query(`ALTER TABLE \`${table}\` MODIFY COLUMN \`${column}\` varchar(2048) ${nullable ? "NULL" : "NOT NULL"}`);
    }
    console.log("Additive migration complete.");
  } finally { await connection.end(); }
}
main().catch(()=>{console.error("Migration failed. Check DATABASE_URL and database permissions.");process.exitCode=1;});
