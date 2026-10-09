# Architecture and authority

## Delivery

- Source: `WhoSia/PK-Research-Studio`, static HTML/CSS/ES module. No build dependency or GitHub Actions workflow.
- Hosting: Vercel static project connected to this repository.
- Identity and durable feedback: a dedicated Supabase Auth/Postgres project in Seoul. The browser uses only its publishable key. Database RLS is the authorization boundary.
- Research source of record: P&K Research OS in Notion. The public site carries curated stage metadata and derivative descriptions, not private raw source bytes.

## Access model

Anonymous visitors read the public observatory, concept map, and branch specification. Email magic-link login creates a Supabase user, but an account alone grants no research access. An administrator adds participant or reviewer emails to `private.invites` outside Git. A database trigger enrolls invited new users; existing users can be added with the documented backfill query. A participant may submit and read only their own feedback. A reviewer may read all feedback and update only its review status. Neither role can edit source material or mark feedback canonical.

Feedback has an immutable author, body, target, consent flag, and creation timestamp. A reviewer status change only tracks triage. Any later source archive or Research OS update requires a separate human-controlled process.

## Research boundary

G2.21 is `SEMANTIC-PRESEAL-PASS / IMPLEMENTATION-FIXITY-HOLD / EXPERIMENT-NOT-RUN`. The app provides B0–B6 descriptions and a prospective JSON export. It does not execute the simulation or publish fabricated outputs. The downloaded JSON explicitly contains `result: null` and `execution_receipt: null`.

## Remaining scientific preflight

Before B0–B6 execution: freeze exact simulator bytes and SHA-256, dependency/runtime versions, deterministic update order, prospective test vectors, branch inputs, source identity, and failure labels; independently verify them, then record each run receipt. Platform deployment alone cannot close GATE-59.
