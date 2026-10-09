# P&K Research Studio

An interactive research atlas for the P&K Platform 0.1. [Research OS Platform brief](https://app.notion.com/p/3f4ef561cf9281009b84dfa045de9678).

## What works

- Public research observatory with a clear G2.21 semantic Preseal and no-run state.
- Keyboard-accessible SVG thought graph with selectable nodes, typed relationships, view filters, and two-concept comparison.
- B0–B6 branch specification explorer and prospective configuration download. **No simulation result is claimed.**
- Email magic-link participant desk, gated by an administrator-maintained invite list. RLS restricts feedback to its author and reviewers.

The live deployment is at [pk-research-studio.vercel.app](https://pk-research-studio.vercel.app). Vercel's GitHub login connection is not set up, so commits require an explicit deployment step. Participant addresses and a positive feedback submission test are pending.

## Run locally

Serve the repository root with any static HTTP server and open `index.html`. ES modules require HTTP rather than a `file://` URL. There are no npm dependencies or build steps.

## Operations

The database schema is in [`supabase/schema.sql`](supabase/schema.sql). Participant addresses belong only in `private.invites` in Supabase, never in Git. Add existing signed-in users to `app_members` with the backfill query in the schema. Inspect the [architecture](docs/architecture.md) and [design research](docs/design-research.md) before changing custody or visual language.

The publishable browser key in `config.js` is intentionally public; no service key is stored in this repository. Do not add GitHub Actions workflows that commit, open PRs, or deploy as `github-actions[bot]`.
