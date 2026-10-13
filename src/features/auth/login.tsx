import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { createSession } from "./session";
async function login(form: FormData) {
  "use server";
  const configured=process.env.ADMIN_PASSWORD;
  if(!configured) redirect("/admin/login?error=1");
  const a=Buffer.from(String(form.get("password") ?? "")), b=Buffer.from(configured);
  if(a.length===b.length && timingSafeEqual(a,b)) { await createSession(); redirect("/admin/projects"); }
  redirect("/admin/login?error=1");
}
export async function Login({ searchParams }: {searchParams:Promise<{error?:string}>}) {
  const {error}=await searchParams;
  return <main id="main-content"><div className="login-panel panel"><small className="eyebrow">PORTFOLIO / ADMIN</small><h1>Welcome back.</h1><p>Sign in to manage your site.</p><form action={login}><label className="field">Password<input name="password" type="password" autoComplete="current-password" required/></label>{error && <p className="notice" role="alert">Could not sign in. Check your password.</p>}<button className="button">Sign in →</button></form></div></main>;
}
