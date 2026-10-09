# P&K Research Studio

An interactive research atlas for the P&K Platform 0.1. [Research OS Platform brief](https://app.notion.com/p/3f4ef561cf9281009b84dfa045de9678).

## What works

- Public research observatory with a clear G2.21 semantic Preseal and no-run state.
- Keyboard-accessible SVG thought graph with selectable nodes, typed relationships, view filters, and two-concept comparison.
- B0–B6 branch specification explorer and prospective configuration download. **No simulation result is claimed.**
- Email magic-link participant desk, gated by an administrator-maintained invite list. RLS restricts feedback to its author and reviewers.
- Question threads for the reviewer, append-only answer revisions for the participant, and a continuous answer reading view. Existing Notion source documents join this reading view only after import and an explicit publication decision.
- A reading room whose public records come from `content/public/records.json` in GitHub. Reviewers can inspect private imports; publication requires a reviewed Git change and a deployment.

The last verified deployment is at [pk-research-studio.vercel.app](https://pk-research-studio.vercel.app). Vercel's GitHub login connection is not set up, so commits require an explicit deployment step. Participant addresses and a positive feedback submission test are pending.

## Run locally

Run `node scripts/serve.cjs` and open `http://127.0.0.1:4173`. ES modules require HTTP rather than a `file://` URL. Production uses a Vercel function at `/api/notion-sync`. The browser UI has no npm build dependency.

## Operations

The initial database schema is in [`supabase/schema.sql`](supabase/schema.sql); the additive workspace schema is in [`supabase/workspace.sql`](supabase/workspace.sql). Participant addresses belong only in `private.invites` in Supabase, never in Git. Add existing signed-in users to `app_members` with the backfill query in the schema. Inspect the [architecture](docs/architecture.md) and [design research](docs/design-research.md) before changing custody or visual language.

Public reading-room content lives in [`content/public/records.json`](content/public/records.json). It starts empty. Add a record only after the owner has approved that exact version for public release; include the approver and approval date, run `node scripts/validate-public-records.cjs`, review the complete Git diff, then commit and deploy. A Git deletion does not erase prior public commits or clones, so never put private Notion material, draft answers, email addresses, or tokens in this file.

The Notion importer needs `NOTION_TOKEN` and `SUPABASE_PUBLISHABLE_KEY` as server-side Vercel environment variables. Give the Notion integration read access only to the P&K Lab tree. Imported versions start private. The browser does not receive the Notion token. The import has not been connected in production yet.

The publishable browser key in `config.js` is intentionally public; no service key is stored in this repository. Do not add GitHub Actions workflows that commit, open PRs, or deploy as `github-actions[bot]`.
