import type { projects } from "../../db/schema";

type Project = typeof projects.$inferSelect;

export type PublicProject = Pick<Project,
  "id" | "slug" | "title" | "type" | "badge" | "summary" | "tags" |
  "liveUrl" | "liveLabel" | "sourceUrl" | "coverImage" | "coverAlt" |
  "coverStyle" | "startedAt" | "inProgress" | "sort"
>;

export function toPublicProject(project: Project): PublicProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    type: project.type,
    badge: project.badge,
    summary: project.summary,
    tags: project.tags,
    liveUrl: project.liveUrl,
    liveLabel: project.liveLabel,
    sourceUrl: project.sourceUrl,
    coverImage: project.coverImage,
    coverAlt: project.coverAlt,
    coverStyle: project.coverStyle,
    startedAt: project.startedAt,
    inProgress: project.inProgress,
    sort: project.sort,
  };
}
