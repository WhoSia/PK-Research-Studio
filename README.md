# P&K Research Studio

An interactive research atlas for the P&K Platform 0.2 security release. [Research OS Platform brief](https://app.notion.com/p/3f4ef561cf9281009b84dfa045de9678).

## Platform 0.2 status

The release adds fail-closed source-publication consent/version checks and a live Supabase publication-approval trigger. Unit/Notion/curated-record validation and synthetic role tests have passed; real Park/reviewer account acceptance and B0–B6 simulation remain HOLD. The scientific head remains G2.21 Semantic Preseal. Read [Platform 0.2 custody contract](docs/platform-0.2-custody-contract.md) before extending the publishing path.

## What works

- Public research observatory with a clear G2.21 semantic Preseal and no-run state.
- Keyboard-accessible SVG thought graph with selectable nodes, typed relationships, view filters, and two-concept comparison.
- B0–B6 branch specification explorer and prospective configuration download. **No simulation result is claimed.**
- Email magic-link participant desk, gated by an administrator-maintained invite list. RLS restricts feedback to its author and reviewers.
- Question threads for the reviewer, append-only answer revisions for the participant, and a continuous answer reading view. Existing Notion source documents join this reading view only after import and an explicit publication decision.
- A reading room whose public records come from `content/public/records.json` in GitHub. Reviewers can inspect private imports; publication requires a reviewed Git change and a deployment.

The last verified deployment is at [pk-research-studio.vercel.app](https://pk-research-studio.vercel.app). Vercel's GitHub login connection is not set up, so commits require an explicit deployment step. Participant addresses and a positive feedback submission test are pending.

## Reading room: evidence visibility (Platform 0.2)
The public reading room includes **topic trails** (identity/memory, perspective/events,
absoluteness, and G2.21), bibliography-aware search, and visible **reading depth and
limitations** for every published paper note. The shared browser/Node helpers live
in `atlas-utils.mjs`; the local development server now serves JavaScript modules
with the correct MIME type and an explicit static-file allowlist.

This change **does not publish a new source**: the public manifest remains the ten
previously approved `ACTIVE DERIVATIVE` notes. Hacking/Kreisel reading work and
new cross-lab Harvest hypotheses remain private research candidates until separately
approved with an exact source revision. Never infer original-author consent from
archive exports, descriptions or quotations. Independent browser acceptance and
real participant authentication are distinct from Node and build tests.

Run `node --test tests/*.test.cjs` and
`node scripts/validate-public-records.cjs`. GitHub Actions is read-only;
the human maintainer must perform all commits, PR merges and deployments.
Feature branches are deleted **manually** after merging; do not add automated cleanup.

## Run locally

Run `node scripts/serve.cjs` and open `http://127.0.0.1:4173`. ES modules require HTTP rather than a `file://` URL. Production uses a Vercel function at `/api/notion-sync`. The browser UI has no npm build dependency.

## Operations

The initial database schema is in [`supabase/schema.sql`](supabase/schema.sql); the additive workspace schema is in [`supabase/workspace.sql`](supabase/workspace.sql). Participant addresses belong only in `private.invites` in Supabase, never in Git. Add existing signed-in users to `app_members` with the backfill query in the schema. Inspect the [architecture](docs/architecture.md) and [design research](docs/design-research.md) before changing custody or visual language.

Public reading-room content lives in [`content/public/records.json`](content/public/records.json). Add a record only after the owner has approved its publication scope; include the approver and approval date, run `node scripts/validate-public-records.cjs`, review the complete Git diff, then commit and deploy. A Git deletion does not erase prior public commits or clones, so never put private Notion material, draft answers, email addresses, or tokens in this file.
The first approved category release contains 10 newly written reading notes: four research lineages, two G2.21/G2.22 design records, and four paper reading notes. Rebuild the JSON with `node scripts/build-public-records.cjs` after editing those notes. This release contains no question, answer, raw Park source, or paper PDF.

The Notion importer needs `NOTION_TOKEN` and `SUPABASE_PUBLISHABLE_KEY` as server-side Vercel environment variables. Give the Notion integration read access only to the P&K Lab tree. Imported versions start private. The browser does not receive the Notion token. The import has not been connected in production yet.

The publishable browser key in `config.js` is intentionally public; no service key is stored in this repository. Do not add GitHub Actions workflows that commit, open PRs, or deploy as `github-actions[bot]`.
