import { getProjects } from "../../../src/features/projects/queries";
import { toPublicProject } from "../../../src/features/projects/public-project";

export async function GET() {
  const projects = (await getProjects()).map(toPublicProject);
  return Response.json({ projects }, {
    headers: { "Cache-Control": "no-store" },
  });
}
