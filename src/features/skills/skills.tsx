import type { skillGroups } from "../../db/schema";
import { Section, Tags } from "../../components/ui";
export function Skills({ intro, groups }: { intro: string; groups: (typeof skillGroups.$inferSelect)[] }) {
  return <Section id="skills" title="Skills" intro={intro} sand><div className="skills-table panel">{groups.map(g => <div className="skill-row" key={g.id}><h3>{g.label}</h3><Tags items={g.items}/></div>)}</div></Section>;
}
