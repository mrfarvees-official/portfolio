import { getSettings } from "../settings/queries";
import { getProjects } from "../projects/queries";
import { getExperiences } from "../experience/queries";
import { getLatestResume } from "../resume/queries";
import { Experience } from "../experience/experience";
import { getServices } from "../services/queries";
import { getSkillGroups } from "../skills/queries";
import { getNotes } from "../notes/queries";
import { Hero } from "../hero/hero";
import { ProjectCard } from "../projects/project-card";
import { NoteCard } from "../notes/note-card";
import { Services } from "../services/services";
import { About } from "../about/about";
import { Skills } from "../skills/skills";
import { Contact } from "../contact/contact";
import { Section, ButtonLink } from "../../components/ui";
export async function Home() {
  const [s,work,experiences,resume,services,skills,notes] = await Promise.all([getSettings(),getProjects(),getExperiences(),getLatestResume(),getServices(),getSkillGroups(),getNotes(3)]);
  return <main id="main-content"><Hero hero={s.hero} hasResume={!!resume}/><Experience intro={s.experience.intro} items={experiences}/><Section id="work" title="Work" intro={s.work.intro}><div className="project-grid">{work.map(p => <ProjectCard key={p.id} project={p}/>)}</div>{!work.length && <p>Projects are on the way.</p>}</Section><Services heading={s.services.heading} items={services}/><About about={s.about}/><Skills intro={s.skills.intro} groups={skills}/><Section id="notes" title="Dev notes" intro={s.notes.intro}><div className="three-grid">{notes.map(n => <NoteCard key={n.id} note={n}/>)}</div><div className="section-action"><ButtonLink href="/notes" secondary>All notes</ButtonLink></div></Section><Contact cta={s.cta}/></main>;
}
