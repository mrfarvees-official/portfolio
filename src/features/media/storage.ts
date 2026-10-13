import "server-only";
import path from "node:path";
export const uploadDirectory = path.join(process.cwd(),".data","uploads");
export function imageType(bytes: Buffer): {ext:string;mime:string} | null {
  if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return {ext:"png",mime:"image/png"};
  if(bytes[0]===255 && bytes[1]===216 && bytes[2]===255) return {ext:"jpg",mime:"image/jpeg"};
  if(["GIF87a","GIF89a"].includes(bytes.subarray(0,6).toString())) return {ext:"gif",mime:"image/gif"};
  if(bytes.subarray(0,4).toString()==="RIFF" && bytes.subarray(8,12).toString()==="WEBP") return {ext:"webp",mime:"image/webp"};
  return null;
}
