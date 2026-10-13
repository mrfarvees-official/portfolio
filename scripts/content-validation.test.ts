import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFields,safeUrl } from "../src/features/admin/validation";
import { registry } from "../src/features/admin/registry";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Markdown,Contents } from "../src/components/markdown";
import { parseSection } from "../src/features/project-content/validation";
import { sectionsToMarkdown } from "../src/features/project-content/markdown";

test("URLs reject executable schemes and protocol-relative destinations",()=>{
  for(const url of ["javascript:alert(1)","data:text/html,test","//untrusted.test/image.png","file:///etc/passwd"]) assert.throws(()=>safeUrl(url,true));
  for(const url of ["/media/example.png","https://example.com/image.png"]) assert.equal(safeUrl(url,true),url);
  assert.equal(safeUrl("mailto:hello@example.com"),"mailto:hello@example.com");
});
test("required content, slugs and reading times are validated",()=>{
  const form=new FormData();
  assert.throws(()=>parseFields(registry.notes.fields,form),/Title/);
  form.set("title","Example note");form.set("slug","Invalid Slug");
  assert.throws(()=>parseFields(registry.notes.fields,form),/lowercase/);
  form.set("slug","example-note");form.set("readMins","0");
  assert.throws(()=>parseFields(registry.notes.fields,form),/whole number/);
  form.set("readMins","5");
  const result=parseFields(registry.notes.fields,form);
  assert.equal(result.published,false);assert.equal(result.slug,"example-note");
  form.set("published","on");assert.equal(parseFields(registry.notes.fields,form).published,true);
});
test("gallery parsing requires accessible descriptions and safe image paths",()=>{
  const field=registry.projects.fields.filter(f=>f.name==="gallery");
  const form=new FormData();form.set("gallery","/images/example.png | A project dashboard | Main view");
  assert.deepEqual(parseFields(field,form).gallery,[{src:"/images/example.png",alt:"A project dashboard",caption:"Main view"}]);
  form.set("gallery","/images/example.png");assert.throws(()=>parseFields(field,form),/description/);
  form.set("gallery","javascript:alert(1) | Invalid | Test");assert.throws(()=>parseFields(field,form));
});

test("formatted and repeated Markdown headings resolve to the same article anchors",()=>{
  const body="## Same **heading**\n\nText.\n\n### Same [heading](https://example.com)\n\n```text\n## Not a heading\n```";
  const article=renderToStaticMarkup(createElement(Markdown,{body}));
  const contents=renderToStaticMarkup(createElement(Contents,{body}));
  for(const id of ["same-heading","same-heading-1"]) { assert.ok(article.includes(`id=\"${id}\"`));assert.ok(contents.includes(`href=\"#${id}\"`)); }
  assert.ok(!contents.includes("Not a heading"));
});

test("case-study sections validate their image and preserve an intentionally empty body",()=>{
  const form=new FormData();form.set("title","A section");
  assert.equal(parseSection(form).body,"");
  form.set("imageSrc","javascript:alert(1)");assert.throws(()=>parseSection(form));
  form.set("imageSrc","/images/case-dashboard.svg");assert.throws(()=>parseSection(form),/description/);
  form.set("imageAlt","Dashboard");assert.equal(parseSection(form).imageSrc,"/images/case-dashboard.svg");
  form.set("sort","-1");assert.throws(()=>parseSection(form),/whole number/);
});
test("section headings and screenshots compose into one article and contents list",()=>{
  const section={title:"A section",body:"### A detail\n\nText.",imageSrc:"/images/case-dashboard.svg",imageAlt:"Dashboard [view]",imageCaption:"Sample screen"};
  const body=sectionsToMarkdown([section,{...section,body:"Second section.",imageSrc:null}]);
  const article=renderToStaticMarkup(createElement(Markdown,{body}));
  const contents=renderToStaticMarkup(createElement(Contents,{body}));
  for(const id of ["a-section","a-detail","a-section-1"]) { assert.ok(article.includes(`id=\"${id}\"`));assert.ok(contents.includes(`href=\"#${id}\"`)); }
  assert.ok(article.includes('alt="Dashboard [view]"'));
  assert.equal(sectionsToMarkdown([]),"");
});
