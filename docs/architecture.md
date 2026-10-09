# Architecture and authority

## Delivery

- Source: `WhoSia/PK-Research-Studio`, static HTML/CSS/ES module. No build dependency or GitHub Actions workflow.
- Hosting: Vercel static project. The first production deployment used the exact files from Git commit `451b1be` through the Vercel API. Vercel's GitHub connection was unavailable, so future pushes do not deploy automatically; deploy each reviewed commit explicitly until the owner connects GitHub in Vercel.
- Identity and durable feedback: a dedicated Supabase Auth/Postgres project in Seoul. The browser uses only its publishable key. Database RLS is the authorization boundary.
- Research source of record: P&K Research OS in Notion. The public site carries curated stage metadata and derivative descriptions, not private raw source bytes.

## Question and reading flow

The reviewer can post a question; invited participants can append an answer revision. The database accepts only the next revision number and grants no update or delete permission on answers. The answer reading view places the original question above each latest answer and exposes its earlier revisions. Existing Notion source documents appear in the same reading flow after they have been imported and made visible to the reader.

Notion import writes a complete page snapshot to `library_versions`. It never edits the Notion page. Each version has its Notion page ID, revision, arrival time and a SHA-256 hash of the stored body. `library_publications` points to one exact version. Its absence makes the version invisible to anonymous visitors. The reviewer can inspect imports while they are private and can withdraw a publication. The on-site importer requires a server-side Notion token that is not configured yet; the attempted connector-based import was blocked by an automatic approval usage-limit error, so no source snapshots were added. The public reading room currently has no imported records.

This is a page snapshot model, not live mirroring. A new import leaves the existing approved version published until the reviewer inspects and chooses the next version. Notion can change without the site changing; the page revision shown in the reader makes that visible.

## Access model

Anonymous visitors read the public observatory, concept map, and branch specification. Email magic-link login creates a Supabase user, but an account alone grants no research access. An administrator adds participant or reviewer emails to `private.invites` outside Git. A database trigger enrolls invited new users; existing users can be added with the documented backfill query. A participant may submit and read only their own feedback. A reviewer may read all feedback and update only its review status. Neither role can edit source material or mark feedback canonical. No invite addresses have been provisioned yet at the owner's request, so the positive submission path remains unverified.

In the question workspace, both member roles can read questions and answer revisions. Only the reviewer can post questions; only a participant can append an answer under their own user ID. This is a collaboration area, so a posted answer is visible to invited members. Public records are a separate publication decision. A published answer remains `SUBMITTED FEEDBACK`; publication does not turn it into Park's frozen source. For source documents, the `FROZEN SOURCE` label belongs to a Notion archive page and does not mean every surrounding editorial note is Park's direct quote.

Feedback has an immutable author, body, target, consent flag, and creation timestamp. A reviewer status change only tracks triage. Any later source archive or Research OS update requires a separate human-controlled process.

## Research boundary

G2.21 is `SEMANTIC-PRESEAL-PASS / IMPLEMENTATION-FIXITY-HOLD / EXPERIMENT-NOT-RUN`. The app provides B0–B6 descriptions and a prospective JSON export. It does not execute the simulation or publish fabricated outputs. The downloaded JSON explicitly contains `result: null` and `execution_receipt: null`.

## Remaining scientific preflight

Before B0–B6 execution: freeze exact simulator bytes and SHA-256, dependency/runtime versions, deterministic update order, prospective test vectors, branch inputs, source identity, and failure labels; independently verify them, then record each run receipt. Platform deployment alone cannot close GATE-59.
