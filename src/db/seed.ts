import { db, pool } from "./index";
import { eq } from "drizzle-orm";
import { settings, projects, projectSections, services, skillGroups, timeline, notes, media, socialLinks } from "./schema";
import { peopleOpsIntro, peopleOpsSummary, peopleOpsSections } from "../features/project-content/peopleops-seed";
import { reconLiteIntro, reconLiteSummary, reconLiteSections } from "../features/project-content/reconlite-seed";
import { defaults } from "../lib/settings";
import { caseStudyTemplate, projectSeeds } from "../features/projects/seed-content";
import { noteTemplate, noteSeeds } from "../features/notes/seed-content";

async function main() {
  for (const [key,value] of Object.entries(defaults)) {
    await db.insert(settings).values({key,value}).onDuplicateKeyUpdate({set:{key}});
    const [row] = await db.select().from(settings).where(eq(settings.key,key)).limit(1);
    const current = row?.value as Record<string,unknown> | undefined;
    // Upgrade scaffold identity only; preserve values changed through the admin.
    if (current && key === "site") {
      const personalized = { ...current };
      if (current.brand === "yourname") personalized.brand = defaults.site.brand;
      if (current.brandAccent === ".dev") personalized.brandAccent = defaults.site.brandAccent;
      if (current.copyright === "© 2026 Your Name") personalized.copyright = defaults.site.copyright;
      if (Array.isArray(current.socials)) personalized.socials = current.socials.map(link => link.label === "GH" && link.href === "#" ? { ...link, href: defaults.site.socials[0].href } : link);
      await db.update(settings).set({value:personalized}).where(eq(settings.key,key));
    }
    if (current && key === "hero") {
      const personalized = { ...current };
      if (current.headline === "Hi, I'm [Your Name]. I build web software that ships and stays up.") personalized.headline = defaults.hero.headline;
      if (current.handle === "[your handle]") personalized.handle = defaults.hero.handle;
      if (!current.photoAlt || current.photoAlt === "Developer portrait") personalized.photoAlt = defaults.hero.photoAlt;
      if (current.subtext === "Full-stack developer working with founders and small teams.") personalized.subtext = defaults.hero.subtext;
      await db.update(settings).set({value:personalized}).where(eq(settings.key,key));
    }
    if (current && key === "about" && (!current.p1 || !current.p2)) {
      await db.update(settings).set({value:{...current,p1:current.p1 || defaults.about.p1,p2:current.p2 || defaults.about.p2}}).where(eq(settings.key,key));
    }
  }
  if (!(await db.select({id:socialLinks.id}).from(socialLinks).limit(1)).length) {
    await db.insert(socialLinks).values(defaults.site.socials.map((social,sort) => ({...social,sort:sort+1,published:true})));
  }
  // Replace the original first-project scaffold without discarding its article/images.
  const [peopleops] = await db.select().from(projects).where(eq(projects.slug,"peopleops")).limit(1);
  const [scaffold] = await db.select().from(projects).where(eq(projects.slug,"project-one")).limit(1);
  if (!peopleops && scaffold?.title === "[Project one]") {
    await db.transaction(async tx => {
      await tx.update(projects).set({
        ...projectSeeds[0], liveUrl:null, startedAt:"[Mon YYYY]", sort:1,
      }).where(eq(projects.id,scaffold.id));
      const links = await tx.select().from(timeline).where(eq(timeline.projectSlug,"project-one"));
      for (const link of links) await tx.update(timeline).set({projectSlug:"peopleops",...(link.title === "[Project one]" ? {title:"PeopleOps"} : {})}).where(eq(timeline.id,link.id));
    });
  }
  for (const [i,seed] of projectSeeds.entries()) {
    const [existing] = await db.select().from(projects).where(eq(projects.slug,seed.slug)).limit(1);
    if (!existing) await db.insert(projects).values({startedAt:"[Mon YYYY]",role:"Developer",caseIntro:"[Two sentences: what the project is, who it is for, and what makes it worth a look.]",...seed,caseBody:caseStudyTemplate,contactText:"[One sentence on what you build and who you build it for.] Tell me what you're working on.",published:true,sort:i+1});
    else {
      // Only fill empty fields or the exact original scaffold; preserve edited content.
      const patch: Partial<typeof projects.$inferInsert> = {};
      const original = "## The problem\n\nText.\n\n## What it does\n\n- **Feature one.** Text.\n\n## Decisions that shaped it\n\n### Decision one\n\nText.\n\n### Decision two\n\nText.\n\n## Deployment\n\nText.\n\n## Result\n\nText.\n\n## What I'd do next\n\n- Improvement one";
      if (!existing.caseBody || existing.caseBody === original) patch.caseBody = caseStudyTemplate;
      if (!existing.contactText) patch.contactText = "[One sentence on what you build and who you build it for.] Tell me what you're working on.";
      if (Object.keys(patch).length) await db.update(projects).set(patch).where(eq(projects.id,existing.id));
    }
  }
  await db.transaction(async tx => {
    const [project] = await tx.select().from(projects).where(eq(projects.slug,"peopleops")).limit(1).for("update");
    if (!project || project.sectionsEnabled) return;
    const existingSections = await tx.select().from(projectSections).where(eq(projectSections.projectId,project.id));
    if (!existingSections.length) {
      const customBody = project.caseBody && project.caseBody !== caseStudyTemplate;
      const sections = customBody ? [{title:"Case study",body:project.caseBody!}] : peopleOpsSections;
      await tx.insert(projectSections).values(sections.map((section,i) => ({...section,projectId:project.id,sort:(i+1)*10,published:true})));
    }
    const patch: Partial<typeof projects.$inferInsert> = {sectionsEnabled:true};
    if (!project.caseIntro || project.caseIntro.startsWith("[Two sentences:") || project.caseIntro === "PeopleOps is my first project. Explore the source code on GitHub.") patch.caseIntro=peopleOpsIntro;
    if (!project.summary || project.summary === "PeopleOps — my first project.") patch.summary=peopleOpsSummary;
    if (!project.type || project.type === "Project") patch.type="HR platform";
    if (!project.tags?.length) patch.tags=["Next.js","React","TypeScript","Prisma","MySQL","Docker"];
    if (!project.contactText || project.contactText === "[One sentence on what you build and who you build it for.] Tell me what you're working on.") patch.contactText="Need an internal tool that brings business workflows and access rules together? Tell me what you are building.";
    if (project.startedAt === "[Mon YYYY]") patch.startedAt=null;
    await tx.update(projects).set(patch).where(eq(projects.id,project.id));
  });
  await db.transaction(async tx => {
    const [project] = await tx.select().from(projects).where(eq(projects.slug,"reconlite")).limit(1).for("update");
    if (!project) return;
    const existingSections = await tx.select().from(projectSections).where(eq(projectSections.projectId,project.id));
    if (!existingSections.length) {
      await tx.insert(projectSections).values(reconLiteSections.map((section,i) => ({...section,projectId:project.id,sort:(i+1)*10,published:true})));
    }
    const patch: Partial<typeof projects.$inferInsert> = {sectionsEnabled:true};
    if (!project.caseIntro || project.caseIntro.startsWith("[Two sentences:")) patch.caseIntro=reconLiteIntro;
    if (!project.summary || project.summary.startsWith("[One or two sentences:")) patch.summary=reconLiteSummary;
    if (!project.contactText || project.contactText.startsWith("[One sentence")) patch.contactText="Need a security-focused developer tool or a safer way to inspect public web configuration? Tell me what you are building.";
    await tx.update(projects).set(patch).where(eq(projects.id,project.id));
  });
  const serviceSeeds = [
    {title:"Web apps",body:"You bring the idea. I design the data, build the interface and the backend, and hand over something you can run.",ctaLabel:"Start a project"},
    {title:"Fix and rescue",body:"Code that works on your laptop and breaks in production? I find what's wrong, fix it and leave notes so it stays fixed.",ctaLabel:"Rescue my project"},
    {title:"APIs and bots",body:"Backends, integrations and chat bots that connect your tools and take repetitive work off your team.",ctaLabel:"Talk about my idea"},
  ];
  for (const [i,s] of serviceSeeds.entries()) if (!(await db.select().from(services).where(eq(services.title,s.title)).limit(1)).length) await db.insert(services).values({...s,ctaHref:"/#contact",sort:i+1});
  const groups = [
    {label:"Languages",items:["JavaScript","TypeScript","Python","Go"]},
    {label:"Backend",items:["Node.js","Express","NestJS","Socket.io"]},
    {label:"Frontend",items:["React","Next.js","HTML","CSS"]},
    {label:"Databases",items:["PostgreSQL","MongoDB","SQLite","Supabase"]},
    {label:"Tools",items:["Git","Docker","Linux","CI/CD"]},
  ];
  for(const [i,g] of groups.entries()) if (!(await db.select().from(skillGroups).where(eq(skillGroups.label,g.label)).limit(1)).length) await db.insert(skillGroups).values({...g,sort:i+1});
  for(const [i,p] of projectSeeds.entries()) if (!(await db.select().from(timeline).where(eq(timeline.title,p.title)).limit(1)).length) await db.insert(timeline).values({title:p.title,dateLabel:"startedAt" in p ? p.startedAt : "[Mon YYYY]",projectSlug:p.slug,inProgress:"inProgress" in p ? Boolean(p.inProgress) : false,sort:i+1});
  for(const [i,n] of noteSeeds.entries()) {
    const [existing] = await db.select().from(notes).where(eq(notes.slug,n.slug)).limit(1);
    if(!existing) await db.insert(notes).values({...n,body:noteTemplate,published:true,publishedAt:new Date(Date.UTC(2026,0,3-i))});
    else if(!existing.body || existing.body === "Write-up goes here.") await db.update(notes).set({body:noteTemplate}).where(eq(notes.id,existing.id));
  }
  for(const item of [
    {src:"/images/case-dashboard.svg",name:"Dashboard placeholder",alt:"Illustrative dashboard placeholder; replace with a real project screenshot"},
    {src:"/images/case-detail.svg",name:"Feature detail placeholder",alt:"Illustrative feature detail placeholder; replace with a real project screenshot"},
  ]) if (!(await db.select().from(media).where(eq(media.src,item.src)).limit(1)).length) await db.insert(media).values(item);
  console.log("Seed complete. Existing edited content was preserved.");
}
main().catch(()=>{console.error("Seed failed. Check the database connection and run db:migrate first.");process.exitCode=1;}).finally(()=>pool.end());
