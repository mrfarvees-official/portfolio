import { connection } from "next/server";
import { getLatestResume } from "../../src/features/resume/queries";
// Streams the newest uploaded resume as a download, so the button always serves the latest version.
export async function GET() {
  await connection();
  const resume = await getLatestResume();
  if (!resume) return new Response("No resume has been uploaded yet.", { status: 404 });
  const upstream = await fetch(resume.src, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) return new Response("The resume is temporarily unavailable.", { status: 502 });
  const filename = `${resume.name.replace(/[^\w .()-]/g, "") || "Resume"}.pdf`;
  return new Response(upstream.body, { headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-store",
  } });
}
