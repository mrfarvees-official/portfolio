import { Admin } from "../../../src/features/admin/admin";
export const instant = false;
export default async function AdminFeature({ params, searchParams }: { params: Promise<{feature:string}>; searchParams: Promise<{project?:string}> }) {
  const [route, query] = await Promise.all([params, searchParams]);
  return <Admin feature={route.feature} projectSlug={query.project}/>;
}
