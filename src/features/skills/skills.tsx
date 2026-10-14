import type { skillGroups } from "../../db/schema";
import { Section, Tags } from "../../components/ui";
export function Skills({
  intro,
  groups,
}: {
  intro: string;
  groups: (typeof skillGroups.$inferSelect)[];
}) {
  const items = [...new Set(groups.flatMap((g) => g.items ?? []))];
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)].filter(
    (r) => r.length,
  );
  return (
    <Section id="skills" title="Skills" intro={intro} sand>
      <div className="skills-marquee">
        {rows.map((row, i) => (
          <div className={`marquee-row${i % 2 ? " reverse" : ""}`} key={i}>
            <div
              className="marquee-track"
              style={{ animationDuration: `${Math.max(30, row.length * 4)}s` }}
            >
              <Tags items={row} />
              <div aria-hidden="true">
                <Tags items={row} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
