# Dev notes

Working notes for this portfolio (Next.js + Drizzle/MySQL + Cloudinary). Keep this file updated as the project changes.

## Setup
- Env: copy `.env.example` to `.env` and fill in `DATABASE_URL`, the Cloudinary variables and the admin credentials. `.env*` is gitignored.
- After pulling schema changes, run `npm run db:migrate`. It is additive and never drops data.
- `npm run db:seed` loads sample content. `npm test` runs the validation and Cloudinary tests.

## Content model (admin tabs)
| Tab | Table | Notes |
|---|---|---|
| Experience | `experiences` | Employment and freelance work. Text only, with an optional company logo and website. Own page at `/experience/<slug>`. |
| Projects | `projects` | Case studies at `/work/<slug>`. Sections are managed under Case-study content. |
| Notes | `notes` | Dev notes at `/notes/<slug>`. |
| Services, Skills | `services`, `skill_groups` | Home page sections. |
| Site settings | `settings` | Hero, About, CTA and section intros. Nav links are stored here too. |
| Media | `media` | Cloudinary uploads. |

- Hide something: untick **Published** (projects, experience, notes).
- Remove something: use **Delete** on the record. Deleting a project also deletes its case-study sections.

## Experience
- Slug is optional. If empty it is generated from the title, with `-2`, `-3` added on a clash.
- The home page shows compact cards, and the full Problem solved / What I did / Outcome write-up lives on the detail page.
- Keep titles and summaries non-explicit, because client details are private.

## Tech tags and icons
- Component: `Tags` in `src/components/ui.tsx`. Built-in icon lookup: `src/components/tech-icons.ts`.
- Add an icon with no code change by writing the tag as `Name|icon`:
  - `Rust|rust` uses a Simple Icons name (check the exact name on simpleicons.org). It loads from the Simple Icons CDN, so visitors need to be online.
  - `Tool|https://.../logo.svg` uses any image URL or Cloudinary asset.
- To bundle an icon permanently, add a line to `src/components/tech-icons.ts`.
- Sizes are in the `.tags` rules in `app/globals.css`.

## Links
- External http(s) links and buttons open in a new tab (`ButtonLink`, the project card, footer social links). Internal links and `mailto:` do not.

## Layout
- Case study pages use a 1440px container, with a 1000px article and heading and the "On this page" sidebar on the right. See `.detail-page`, `.detail-heading` and `.article-grid` in `app/globals.css`.

## Gotchas
- Nav links are stored in the database, so new default links (such as Experience) must be added under Site settings.
- Several files are edited from more than one place (admin, settings, timeline and social links). Check `git status` and `git diff` before committing.
- This Next.js version has breaking changes. Read `node_modules/next/dist/docs/` before changing framework-level code (see `AGENTS.md`).

## Bugs encountered
| Bug | Cause | Fix |
|---|---|---|
| Project overview and article were different widths on case study pages | The heading was fixed at 740px while the article filled the rest of the grid | Both now share one width (1000px) with the sidebar in a side column (`.article-grid`) |
| Company logo rendered huge on experience cards | The logo had no size limit inside the card | Fixed-size logo box on the left, content on the right (`.experience-logo`) |
| Experience cards were too long on the home page | All text sections were shown inline | Compact card plus a detail page at `/experience/<slug>` |
| Tiny "Problem solved / What I did / Outcome" labels were hard to read | Small monospace headings | Large headings on the detail page |
| Tech tags looked faint and had no icons | Small plain chips | Bigger chips with react-icons and optional `Name\|icon` |
| "Experience" missing from the header nav | Nav links are saved in the database, so new defaults don't appear | Add the link under Site settings |
| Admin banner said experience had "no images" after logos were added | Stale text | Banner text updated |
| Footer file failed to compile after adding `target="_blank"` | An escaped `//` in a regex was lost during a scripted edit | Replaced with `/^https?:/i` |
| Saving an experience without a slug failed validation | Slug was required for every collection | Slug is optional for experience and generated from the title |

## To do
- Replace the placeholder text in About and the `#` social links in the footer.
- Consider web fonts, since the site currently uses system Arial and Courier New.
