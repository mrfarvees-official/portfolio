# Portfolio project entry (written for HR managers)

Paste these into **Admin → Projects → Add new**. Replace `[placeholders]` with your own details. Then add the case-study sections below under **Manage case-study sections**.

## Form values

| Field | Value |
|---|---|
| Title | `Developer Portfolio` |
| URL slug | `developer-portfolio` |
| Project type | `Full-stack web app` |
| Badge | `Live` |
| Card summary | `The site you are on: a portfolio with a built-in admin panel, so I can publish projects, work experience and notes without touching code.` |
| Technology tags | `Next.js, React, TypeScript, Tailwind CSS, MySQL, Drizzle, Cloudinary` |
| Live URL | `[https://your-domain]` |
| Live link label | `Visit` |
| Source URL | `https://github.com/mrfarvees-official/[repo]` |
| Cover image | `[screenshot of the home page]` |
| Cover image description | `Home page of the developer portfolio` |
| Cover style | `blue` |
| Started | `[Mon YYYY]` |
| In progress | untick when finished |
| Your role | `Designer & Developer` |
| Case study introduction | `I built this portfolio to show my work the way an employer would want to see it: clear, quick to scan, and easy to keep current. It is a full-stack Next.js application with its own admin panel, a MySQL database, and image management through Cloudinary.` |
| Legacy case-study body | `Built end to end by me: design, front end, back end, database and admin tools. See the sections above for the problem, what I built and what I learned.` |
| Case study contact text | `Hiring, or have a project in mind? I'd be glad to talk.` |
| Display order | `0` |
| Published | tick when ready |

## Case-study sections

Add each of these under **Manage case-study sections**. Edit the wording to match what you actually did.

### The problem
A static portfolio goes stale. Every new project or job meant editing code and redeploying, so it was easy to leave it out of date. I wanted a site I could update in minutes, and that someone reviewing my work could understand in a minute.

### What I built
- A public site with Experience, Work, Services, About, Skills and Notes sections.
- A password-protected admin panel to add, edit, hide and delete every kind of content.
- A separate page for each project and each job, so a reader can go as deep as they like.
- Image uploads through Cloudinary, with a media library to reuse them.

### Tech decisions
- **Next.js and React with TypeScript:** server-rendered pages for speed and search, and typed code that is safer to change.
- **MySQL with Drizzle ORM:** a plain relational model for projects, experience, notes and settings, with additive migrations that never drop data.
- **Server-side validation:** every admin form is checked on the server, so bad data and unsafe links are rejected.
- **Signed-session admin login:** only I can change content.

### Challenges
- Keeping client work private while still showing real experience, so the Experience entries describe the problem and the approach without naming sensitive details.
- Designing one content model that handles both employment and freelance work.
- Making everything editable from the admin without risking the live site, by using Published toggles, confirmations before deleting, and safe migrations.

### What I learned
- Designing a small content system is mostly about making the common edit a one-minute task.
- Small details matter to readers: link behaviour, tag icons, readable headings and clear layout.
- [Add one honest lesson of your own.]

## Tips for HR readers

- Keep sentences short and avoid jargon in the introduction and card summary. HR managers often skim, so lead with the outcome.
- Put the strongest line first in each section.
- Link the live site and the repo so claims can be checked.
