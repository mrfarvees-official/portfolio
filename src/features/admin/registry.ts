export type Field = { name: string; label: string; type?: "text" | "textarea" | "number" | "checkbox" | "list" | "gallery" | "image" | "select" | "datetime" | "json"; required?: boolean; options?: string[]; hint?: string; max?: number };
const text = (name: string, label: string, max = 200): Field => ({ name, label, max });
const area = (name: string, label: string, hint?: string): Field => ({name,label,type:"textarea",hint});
const sort: Field = {name:"sort",label:"Display order",type:"number"};
const published: Field = {name:"published",label:"Published",type:"checkbox"};
const slug: Field = {name:"slug",label:"URL slug",required:true,max:120,hint:"Lowercase letters, numbers and hyphens. Changing this changes the public URL."};
const title: Field = {name:"title",label:"Title",required:true,max:200};
const cover: Field[] = [{name:"coverImage",label:"Cover image",type:"image",max:2048},text("coverAlt","Cover image description",300)];
export const socialFields: Field[] = [
  {name:"name",label:"Platform / accessible name",required:true,max:80,hint:"For example: GitHub, LinkedIn or X."},
  {name:"label",label:"Short button label",required:true,max:16,hint:"For example: GH, in or X."},
  {name:"href",label:"Profile URL",required:true,max:2048},
  sort,
  published,
];
export const registry = {
  experience: { label:"Experience",fields:[{...title,label:"Project title",hint:"Keep it short and non-explicit, e.g. Internal HR platform."},{...slug,required:false,label:"URL slug (optional)",hint:"Leave empty to generate it from the title."},{name:"kind",label:"Type",type:"select",options:["Employment","Freelance"]},text("organization","Company / client",160),{name:"organizationLogo",label:"Company icon / logo (optional)",type:"image",max:2048},text("organizationUrl","Company website / landing page (optional)",300),text("role","Your role",120),text("startedAt","Started (e.g. Mar 2024)",20),text("endedAt","Ended (e.g. Dec 2024)",20),{name:"ongoing",label:"Ongoing",type:"checkbox"},area("summary","About the project (short, non-explicit)"),area("problem","Problem solved"),area("description","What I did"),area("outcome","Outcome"),{name:"tags",label:"Tech stack",type:"list",hint:"Separate with commas. Add an icon with Name|icon, e.g. Rust|rust (a Simple Icons name from simpleicons.org) or Name|https://your-icon-url. Common stacks get an icon automatically."},sort,published] as Field[] },
  projects: { label:"Projects", fields:[title,slug,text("type","Project type",80),text("badge","Badge",40),area("summary","Card summary"),{name:"tags",label:"Technology tags",type:"list",hint:"Separate with commas. Add an icon with Name|icon, e.g. Rust|rust (a Simple Icons name from simpleicons.org) or Name|https://your-icon-url. Common stacks get an icon automatically."},text("liveUrl","Live URL",300),text("liveLabel","Live link label",40),text("sourceUrl","Source URL",300),...cover,{name:"coverStyle",label:"Cover style",type:"select",options:["blue","dark","sand","stripes"]},text("startedAt","Started (e.g. Mar 2025)",20),{name:"inProgress",label:"In progress",type:"checkbox",hint:"Shows a special badge on the project card and marks the project as in progress in About."},text("role","Your role",80),{...area("caseIntro","Case study introduction"),required:true},{...area("caseBody","Case-study body (Markdown)","The full case study. Use ## and ### headings (they build the contents list) and ![description](image-url) for images."),required:true},{name:"gallery",label:"Additional screenshots",type:"gallery",hint:"One image per line: URL | description | caption"},{...area("contactText","Case study contact text"),required:true},sort,published] as Field[] },
  notes: { label:"Notes", fields:[title,slug,text("category","Category",40),area("excerpt","Short introduction"),...cover,area("body","Note body (Markdown)","Use ## headings and ![description](image-url) for inline images."),{name:"readMins",label:"Reading time (minutes)",type:"number"},{name:"publishedAt",label:"Publication date (UTC)",type:"datetime"},published] as Field[] },
  services: { label:"Services",fields:[{...title,max:120},area("body","Description"),text("ctaLabel","Link label",60),text("ctaHref","Link destination",200),sort] as Field[] },
  skills: { label:"Skills",fields:[{name:"label",label:"Group name",required:true,max:60},{name:"items",label:"Skills",type:"list",hint:"Separate with commas."},sort] as Field[] },
};
export type Collection = keyof typeof registry;
export function isCollection(value: string): value is Collection { return Object.hasOwn(registry,value); }
