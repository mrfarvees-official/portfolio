"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Settings } from "../../lib/settings";
import type { PublicProject } from "../projects/public-project";

type ProjectsResponse = { projects: PublicProject[] };

export function About({ about }: { about: Settings["about"] }) {
  const [items, setItems] = useState<PublicProject[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects", { signal: controller.signal });
        if (!response.ok) throw new Error("Project API request failed");
        const data = await response.json() as ProjectsResponse;
        if (!Array.isArray(data.projects)) throw new Error("Invalid project API response");
        setItems(data.projects);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setFailed(true);
      }
    }
    void loadProjects();
    return () => controller.abort();
  }, []);

  return <section id="about" className="section"><div className="container about-grid"><div><h2>{about.heading}</h2><p>{about.p1}</p><p>{about.p2}</p></div><aside className="timeline panel" aria-busy={items === null && !failed}><h3>{about.timelineTitle}</h3>{failed ? <p className="timeline-message" role="status">Projects could not be loaded.</p> : items === null ? <p className="timeline-message" role="status">Loading projects…</p> : items.length ? items.map(project => <div className="timeline-row" key={project.id}><small className="eyebrow">{project.startedAt || "—"}</small><span><Link className="text-link" href={`/work/${project.slug}`}>{project.title}</Link>{project.inProgress && <small className="timeline-status">In progress</small>}</span></div>) : <p className="timeline-message">No projects published yet.</p>}</aside></div></section>;
}
