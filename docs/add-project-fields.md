# Adding a project: all fillable fields

Add it in **Admin → Projects → Add new**. Values marked `[like this]` are placeholders to replace with your own.

| Field | Required | What to enter | Suggested value (portfolio project) |
|---|---|---|---|
| Title | yes | Project name | `Developer Portfolio` |
| URL slug | yes | Lowercase letters, numbers, hyphens. Becomes `/work/<slug>` | `developer-portfolio` |
| Project type | no | Short category | `Portfolio site` |
| Badge | no | Small label on the card | `Live` |
| Card summary | no | 1–2 sentences for the home page card | `A full-stack portfolio with a built-in admin panel for managing projects, experience and notes.` |
| Technology tags | no | Comma separated. Add an icon with `Name\|icon` if one is missing | `Next.js, React, TypeScript, Tailwind CSS, MySQL, Drizzle, Cloudinary` |
| Live URL | no | The deployed site | `[https://your-domain]` |
| Live link label | no | Text on the live button | `Visit` |
| Source URL | no | GitHub repo | `https://github.com/mrfarvees-official/[repo]` |
| Cover image | no | Pick from Media or paste a URL | `[screenshot of the home page]` |
| Cover image description | no | Alt text | `Home page of the portfolio` |
| Cover style | no | `blue`, `dark`, `sand` or `stripes` (used when there is no image) | `blue` |
| Started | no | Free text, up to 20 characters | `[Mon YYYY]` |
| In progress | no | Checkbox. Shows the in-progress badge | untick if finished |
| Your role | no | | `Designer & Developer` |
| Case study introduction | yes | Lead paragraph at the top of the case study page | `[2–3 sentences on what it is and why you built it]` |
| Legacy case-study body | yes | Markdown, only shown until you add sections | `[a short placeholder or draft write-up]` |
| Additional screenshots | no | One per line: `URL \| description \| caption` | `[optional]` |
| Case study contact text | yes | Text in the "Want something like this built?" box | `Tell me what you're working on.` |
| Display order | no | Number, lower comes first | `0` |
| Published | no | Must be ticked for the project to appear publicly | tick when ready |

## After saving

Click **Manage case-study sections →** under the form, or open the **Case-study content** tab. Each section has a title, a Markdown body and an optional image. Good section ideas:

1. The problem
2. What I built
3. Tech decisions
4. Challenges
5. What I learned

## Tips

- Required fields: title, URL slug, case study introduction, legacy case-study body and case study contact text. Everything else is optional.
- Leave **Published** unticked until the project is ready. Unticking it later hides the project without deleting it.
- Use **Delete** only if you want the project and all its case-study sections removed permanently.
