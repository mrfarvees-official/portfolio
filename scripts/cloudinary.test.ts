import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cloudinaryConfig, uploadImage, rollbackUpload } from "../src/features/media/cloudinary-api";
const env = {CLOUDINARY_CLOUD_NAME:"test-cloud",CLOUDINARY_API_KEY:"test-key",CLOUDINARY_API_SECRET:"test-secret",CLOUDINARY_FOLDER:"/portfolio/images/"};

test("Cloudinary configuration normalizes the folder and requires server credentials",()=>{
  assert.equal(cloudinaryConfig(env).folder,"portfolio/images");
  assert.throws(()=>cloudinaryConfig({}),/Configure/);
  assert.throws(()=>cloudinaryConfig({...env,CLOUDINARY_FOLDER:"../images"}),/folder/);
});
test("signed uploads use the asset folder and return the secure URL and IDs",async()=>{
  const config = cloudinaryConfig(env);
  const mockFetch: typeof fetch = async (url,options) => {
    assert.equal(url,"https://api.cloudinary.com/v1_1/test-cloud/image/upload");
    const form=options!.body as FormData;
    assert.equal(form.get("asset_folder"),"portfolio/images");
    assert.match(String(form.get("public_id")),/^portfolio\/images\/[0-9a-f-]{36}$/);
    assert.equal(form.get("overwrite"),"false");assert.equal(form.has("api_secret"),false);
    assert.ok(form.get("file") instanceof File);
    const expected="asset_folder=portfolio/images&overwrite=false&public_id="+form.get("public_id")+"&timestamp="+form.get("timestamp")+"test-secret";
    assert.equal(form.get("signature"),createHash("sha1").update(expected).digest("hex"));
    return Response.json({secure_url:"https://res.cloudinary.com/test-cloud/image/upload/v1/portfolio/images/example.png",public_id:form.get("public_id"),asset_id:"asset-123"});
  };
  const asset=await uploadImage(new File(["test"],"test.png"),config,mockFetch);
  assert.ok(asset.src.startsWith("https://res.cloudinary.com/"));assert.equal(asset.assetId,"asset-123");
});
test("legacy fixed folders do not double-prefix public IDs",async()=>{
  const config=cloudinaryConfig({...env,CLOUDINARY_FOLDER_MODE:"fixed"});
  const mockFetch: typeof fetch=async(_url,options)=>{
    const form=options!.body as FormData;
    assert.equal(form.get("folder"),"portfolio/images");assert.equal(form.has("asset_folder"),false);
    assert.match(String(form.get("public_id")),/^[0-9a-f-]{36}$/);
    return Response.json({secure_url:"https://res.cloudinary.com/test-cloud/image/upload/example.png",public_id:"portfolio/images/"+form.get("public_id"),asset_id:"asset-456"});
  };
  assert.ok((await uploadImage(new File(["test"],"test.png"),config,mockFetch)).publicId.startsWith("portfolio/images/"));
});
test("Cloudinary failures are sanitized and rollback is confined to the upload folder",async()=>{
  const config=cloudinaryConfig(env);
  await assert.rejects(uploadImage(new File(["test"],"test.png"),config,async()=>new Response("secret error",{status:401})),/Cloudinary rejected/);
  await assert.rejects(uploadImage(new File(["test"],"test.png"),config,async()=>Response.json({error:{message:"Invalid cloud_name Portfolio"}},{status:401})),/API Keys page/);
  let calls=0;
  const mockFetch: typeof fetch=async(_url,options)=>{calls++;assert.equal((options!.body as FormData).get("public_id"),"portfolio/images/test");return Response.json({result:"ok"});};
  await rollbackUpload("portfolio/images/test",config,mockFetch);assert.equal(calls,1);
  await assert.rejects(rollbackUpload("another-folder/test",config,mockFetch),/Invalid/);assert.equal(calls,1);
});
