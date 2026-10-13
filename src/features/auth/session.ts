import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
export const COOKIE = "admin_session";
function secret() {
  if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not configured.");
  return new TextEncoder().encode(process.env.SESSION_SECRET);
}
export async function createSession() {
  const token = await new SignJWT({role:"admin"}).setProtectedHeader({alg:"HS256"}).setExpirationTime("7d").sign(secret());
  (await cookies()).set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:60*60*24*7});
}
export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try { const {payload} = await jwtVerify(token,secret(),{algorithms:["HS256"]}); return payload.role === "admin"; } catch { return false; }
}
