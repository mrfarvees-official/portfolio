# Developer portfolio

Next.js 16.4 portfolio with the cobalt neo-brutalist design from the supplied PDF: warm grid paper, cobalt accents, black borders, offset shadows, responsive project cards and case studies.

## Feature organization

Routes in `app/` handle routing, metadata and rendering policy. Implementation lives in `src/features/`:

- `settings/`: editable site copy, header and footer.
- `home/` and `hero/`: homepage composition and introduction.
- `projects/`: cards, database queries, case studies and seed templates.
- `project-content/`: ordered case-study sections, CRUD actions and PeopleOps content seeds.
- `notes/`: listing, cards, article pages, queries and seed templates.
- `services/`, `skills/`, `about/`, `contact/`: homepage sections.
- `admin/`: authenticated content editors, input validation and mutations.
- `auth/`: session verification and login.
- `media/`: signed Cloudinary uploads, image metadata and compatibility for existing local files.

Shared buttons, tags, sections and Markdown rendering live in `src/components/`. Database schema and migration/seed orchestration live in `src/db/`. Legacy `src/db/queries.ts` and `src/lib/auth.ts` remain compatibility exports.

## Setup

Configure `DATABASE_URL`, `ADMIN_PASSWORD` and a strong `SESSION_SECRET` in `.env`.

For an empty database, run `npm run db:push` to create tables. For an existing database, `npm run db:migrate` adds the missing image, case-study and note fields plus the media table, without dropping existing columns or records.

Run `npm run db:seed` to add missing records and editable placeholders from the design. It preserves edited content, fills empty fields and expands the exact original scaffold. Repeated runs do not duplicate the provided seeds. Existing duplicate entries from older seed runs are preserved.

`npm run dev` starts local development. `npm run build` checks TypeScript and builds production output. `npm test` checks content validation.

## Content management

Sign in at `/admin/login`. Feature tabs let you manage projects, notes, services, skills, timeline, site settings and media. Projects and notes remain private until Published is checked. Uncheck Published to remove them from the public site.

Use `/admin/project-content?project=peopleops` (the Case-study content tab) to add, edit, hide, reorder and remove individual article sections. The `project_sections` table stores the project reference, heading, Markdown, optional image/description/caption, order and publication state. Removing a section deletes its record, but does not delete a reusable image from the media library.

PeopleOps is seeded with source-based sections following the supplied example's case-study structure. Its sections are initialized only once: rerunning the seeder preserves edits and does not recreate removed sections. Other projects retain their legacy body until their first section is created. Once section mode is enabled, even an intentionally empty article never falls back to the old body.

Project editors include the slug, card summary, tags, live/source URLs, cover image and description, start date, role, introduction, full Markdown body, additional screenshots and captions, and case-study contact text. Note editors include the slug, category, excerpt, Markdown body, cover image, reading time and publication date.

Markdown `##` and `###` headings automatically produce the article contents list. Insert screenshots anywhere with `![Image description](/media/filename.png)`. Additional gallery entries use one line per image: `URL | description | caption`.

Site settings include homepage copy, portrait and description, navigation/social links, contact details and footer text. Link lists are editable JSON arrays with `label` and `href` properties.

## Images

The media library accepts PNG, JPEG, GIF and WebP uploads up to 5 MB, or existing image URLs. New file uploads go to Cloudinary under `portfolio/images`. MySQL stores the returned HTTPS URL in `media.src`, along with the provider, public ID, asset ID, name and description. Project covers, note covers, section images and the portrait can use these URLs directly.

Add these server-only settings to `.env` (see `.env.example`):

```dotenv
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=portfolio/images
CLOUDINARY_FOLDER_MODE=dynamic
```

Restart Next.js after changing environment variables. Upload requests are signed on the server; no unsigned preset or client-visible API secret is needed. Existing URLs can be registered without uploading or requiring credentials. If an uploaded asset cannot be saved to MySQL, the app attempts to remove only that newly uploaded asset.

Use the actual Cloud name from Cloudinary's API Keys page, not an account display name or folder name.

Cloudinary paths do not begin with `/`. The app normalizes `/portfolio/images` to `portfolio/images`. For dynamic-folder accounts, it sets both `asset_folder` and a matching public-ID path. For legacy fixed-folder accounts, set `CLOUDINARY_FOLDER_MODE=fixed`. See the [Cloudinary upload reference](https://cloudinary.com/documentation/image_upload_api_reference).

Run `npm run db:migrate` to add Cloudinary identifiers and widen image URL fields to 2048 characters. Existing URLs and local files are retained. The old `/media/[filename]` route still serves previously uploaded files from `.data/uploads/`; only those legacy files require persistent local storage. New uploads do not write to disk.

The bundled SVG illustrations and bracketed copy are explicitly editable placeholders, not claims about real projects. Replace them with your own screenshots and verified case-study details before publishing.

## Next.js rendering

Cache Components stays enabled. Database reads wait for a real request with `connection()`, avoiding prerender execution of the database driver's timing calls. Data-driven layouts/pages use `instant = false` to permit blocking rendering. Saved admin changes invalidate the root layout so lists and dedicated slug pages reflect the latest content.

Every content/media mutation verifies the admin session independently of Proxy. Slugs, URLs, required fields and upload formats are validated.

## Browser verification

`scripts/verify-browser.mjs` uses Chrome's debugging endpoint on port 9223 and a production server on port 3100. It checks desktop/mobile overflow, case-study links, login, draft creation/publishing, uploads and settings forms. Run with `node --env-file=.env scripts/verify-browser.mjs` after starting those services. It creates and removes only its own temporary verification records/uploads. Screenshots are written under `.next/`.

By default, browser verification registers an existing Cloudinary demo URL. Set `VERIFY_CLOUDINARY_UPLOAD=1` to also exercise a live upload and remove the test asset afterward; valid credentials and outbound Cloudinary access are required. `npm test` covers signed upload requests with mocked Cloudinary responses.
