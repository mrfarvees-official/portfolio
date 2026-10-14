// Editable placeholders from the supplied design, not claims about completed work.
export const caseStudyTemplate = `## The problem

[Describe the situation before this project existed: who had the problem and why it was painful.]

[Explain what the simple version of the question looked like, and why it wasn't simple to answer.]

[Describe what you built and the technical choice that shaped the design.]

## What it does

- **[Feature one].** [What it does for the user.]
- **[Feature two].** [What it does for the user.]
- **[Feature three].** [What it does for the user.]
- **[Feature four].** [What it does for the user.]

[Add a verified description of scale and update frequency.]

![Illustrative dashboard placeholder — replace with your project screenshot](/images/case-dashboard.svg)

## Decisions that shaped it

### [Decision one, stated plainly]

[Explain the choice and why you made it. Name the tools and show the relevant code.]

\`\`\`typescript
// Replace this illustrative snippet with your implementation.
const options = { first: "first option", second: "second option" };
const pick = (key: keyof typeof options) => options[key] ?? options.first;
\`\`\`

[Describe a concrete check that proves the decision works.]

### [Decision two, stated plainly]

[Explain your approach and why it solves the problem.]

\`\`\`text
score = a + b + 2 * c + 5 * d
\`\`\`

[Replace this example formula and explain it with a concrete example.]

![Illustrative feature detail placeholder — replace with your screenshot](/images/case-detail.svg)

### [Decision three, stated plainly]

[Explain a third choice, where you picked the simpler, more explainable option.]

## Deployment

[Where it runs, how it is exposed to the internet, and how people get access.]

## Result

[Describe what is live. Only include numbers and outcomes you can verify.]

## What I'd do next

- [Improvement one: what is coarse today and how you would fix it.]
- [Improvement two: a limit you know about and when it would matter.]
- [Improvement three: the next feature users would ask for.]
`;
export const projectSeeds = [
  {slug:"peopleops",title:"PeopleOps",type:"Project",badge:"Source code",tags:[],coverStyle:"blue",summary:"PeopleOps — my first project.",liveLabel:"Visit",sourceUrl:"https://github.com/mrfarvees-official/peopleops",caseIntro:"PeopleOps is my first project. Explore the source code on GitHub."},
  {slug:"reconlite",title:"ReconLite",type:"Security developer tool",badge:"Live",tags:["Next.js","React","TypeScript","Server-Sent Events","Node.js","Nginx","PM2"],coverStyle:"dark",summary:"A passive website security inspector that streams actionable checks without sending exploit payloads.",liveUrl:"https://recon.farvees.xyz",liveLabel:"Run a scan",sourceUrl:"https://github.com/mrfarvees-official/reconlite",startedAt:"Oct 2026",role:"Full-stack developer",caseIntro:"ReconLite runs eight passive website security checks in parallel and streams actionable findings into a terminal-style interface."},
  {slug:"project-two",title:"[Project two]",type:"Multiplayer game",badge:"Playable",tags:["TypeScript","Socket.io","Canvas"],coverStyle:"dark",summary:"[One or two sentences: what it is, how it works, what was hard.]",liveLabel:"Play"},
  {slug:"project-three",title:"[Project three]",type:"Developer tool",badge:"Open source",tags:["Python","Docker"],coverStyle:"sand",summary:"[One or two sentences: who uses it and what it saves them.]",liveLabel:"Visit"},
  {slug:"project-four",title:"[Project four]",type:"Bot or automation",badge:"In progress",inProgress:true,tags:["Node.js","Discord.js","MongoDB"],coverStyle:"stripes",summary:"[One or two sentences: what it automates and for whom.]",liveLabel:"Visit"},
];
