import { readFile } from "node:fs/promises";
import path from "node:path";
import { uploadDirectory,imageType } from "../../../src/features/media/storage";
export async function GET(_request:Request,{params}:{params:Promise<{filename:string}>}) {
  const {filename}=await params;
  if(!/^[0-9a-f-]{36}\.(png|jpg|gif|webp)$/.test(filename)) return new Response("Not found",{status:404});
  try {
    const bytes=await readFile(path.join(uploadDirectory,filename));
    const type=imageType(bytes);
    if(!type) return new Response("Not found",{status:404});
    return new Response(new Uint8Array(bytes),{headers:{"Content-Type":type.mime,"Cache-Control":"public, max-age=31536000, immutable","X-Content-Type-Options":"nosniff"}});
  } catch { return new Response("Not found",{status:404}); }
}
