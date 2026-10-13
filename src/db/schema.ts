import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  json,
  timestamp,
  longtext,
  index,
} from "drizzle-orm/mysql-core";

export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 64 }).primaryKey(), // "hero", "about", "cta", "site"...
  value: json("value").notNull(),
});

export const socialLinks = mysqlTable("social_links", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  label: varchar("label", { length: 16 }).notNull(),
  href: varchar("href", { length: 2048 }).notNull(),
  published: boolean("published").notNull().default(true),
  sort: int("sort").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, table => [index("social_links_order_idx").on(table.published, table.sort, table.id)]);

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  type: varchar("type", { length: 80 }), // "Web app", "Multiplayer game"
  badge: varchar("badge", { length: 40 }), // "Live", "Playable", "In progress"
  summary: text("summary"),
  tags: json("tags").$type<string[]>().default([]),
  liveUrl: varchar("live_url", { length: 300 }),
  liveLabel: varchar("live_label", { length: 40 }), // "Visit" / "Play"
  sourceUrl: varchar("source_url", { length: 300 }),
  coverImage: varchar("cover_image", { length: 2048 }),
  coverAlt: varchar("cover_alt", { length: 300 }),
  gallery: json("gallery").$type<{ src: string; alt: string; caption: string }[]>().default([]),
  contactText: text("contact_text"),
  coverStyle: varchar("cover_style", { length: 20 }).default("blue"), // blue|dark|sand|stripes
  startedAt: varchar("started_at", { length: 20 }),
  role: varchar("role", { length: 80 }),
  caseIntro: text("case_intro"),
  caseBody: text("case_body"), // markdown
  sectionsEnabled: boolean("sections_enabled").notNull().default(false),
  inProgress: boolean("in_progress").notNull().default(false),
  published: boolean("published").default(false),
  sort: int("sort").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectSections = mysqlTable("project_sections", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  body: longtext("body").notNull(),
  imageSrc: varchar("image_src", { length: 2048 }),
  imageAlt: varchar("image_alt", { length: 300 }),
  imageCaption: varchar("image_caption", { length: 500 }),
  sort: int("sort").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, table => [index("project_sections_order_idx").on(table.projectId, table.sort, table.id)]);

// Employment and freelance engagements. Text only: no images (client work is confidential).
export const experiences = mysqlTable("experiences", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(), // short, non-explicit project name
  kind: varchar("kind", { length: 20 }).notNull().default("Employment"), // Employment | Freelance
  organization: varchar("organization", { length: 160 }), // company or client; may be generic
  organizationLogo: varchar("organization_logo", { length: 2048 }), // company icon/logo
  organizationUrl: varchar("organization_url", { length: 300 }), // company landing page
  role: varchar("role", { length: 120 }),
  startedAt: varchar("started_at", { length: 20 }),
  endedAt: varchar("ended_at", { length: 20 }),
  ongoing: boolean("ongoing").notNull().default(false),
  summary: text("summary"), // short, non-explicit overview
  problem: text("problem"), // problem solved
  description: text("description"), // what you built / did
  outcome: text("outcome"),
  tags: json("tags").$type<string[]>().default([]), // tech stack
  published: boolean("published").notNull().default(false),
  sort: int("sort").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 120 }).notNull(),
  body: text("body"),
  ctaLabel: varchar("cta_label", { length: 60 }),
  ctaHref: varchar("cta_href", { length: 200 }),
  sort: int("sort").default(0),
});

export const skillGroups = mysqlTable("skill_groups", {
  id: int("id").autoincrement().primaryKey(),
  label: varchar("label", { length: 60 }).notNull(),
  items: json("items").$type<string[]>().default([]),
  sort: int("sort").default(0),
});

export const timeline = mysqlTable("timeline", {
  id: int("id").autoincrement().primaryKey(),
  dateLabel: varchar("date_label", { length: 20 }), // "Mar 2025"
  title: varchar("title", { length: 160 }).notNull(),
  projectSlug: varchar("project_slug", { length: 120 }),
  inProgress: boolean("in_progress").default(false),
  sort: int("sort").default(0),
});

export const notes = mysqlTable("notes", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 40 }), // "Bug write-up", "Build log"
  body: text("body"), // markdown
  excerpt: text("excerpt"),
  coverImage: varchar("cover_image", { length: 2048 }),
  coverAlt: varchar("cover_alt", { length: 300 }),
  readMins: int("read_mins").default(5),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
});

export const media = mysqlTable("media", {
  id: int("id").autoincrement().primaryKey(),
  src: varchar("src", { length: 2048 }).notNull(),
  provider: varchar("provider", { length: 20 }).notNull().default("external"),
  publicId: varchar("public_id", { length: 255 }),
  assetId: varchar("asset_id", { length: 128 }),
  name: varchar("name", { length: 200 }).notNull(),
  alt: varchar("alt", { length: 300 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
