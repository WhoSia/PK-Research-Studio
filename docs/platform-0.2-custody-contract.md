# P&K Platform 0.2 — Participant Authority & Source Atlas Contract

Status: **implementation in progress**. This is a platform engineering contract, not G2.22 scientific evidence.
Parent: [Research OS Platform 0.2](https://app.notion.com/p/3f4ef561cf92817dab8cfef9693b558c).
Baseline: production 0.1 was deployed; first release does not imply real account acceptance or B0–B6 execution.

## Non-negotiable source classes

| Class | May be public? | Approval |
|---|---|---|
| FROZEN SOURCE | Default private | Explicit author + steward scope approval, fixed version |
| ACTIVE DERIVATIVE | Review required | Steward review for each published text |
| SUBMITTED FEEDBACK | Default private | Author consent is **not** public-release approval |
| EXPERIMENT | Only if actually run | Deterministic code/input receipt, review |
| HOLD/GRAVEYARD | Review required | Preserve negative results and genealogical context |
| BIBLIOGRAPHY | Metadata only by default | Verify original, rights, provenance and read-depth |

A website permission cannot grant authorship or source authority. A publicly available Git commit remains recoverable even after deletion.

## Intended end-to-end feedback states

`DRAFT -> SUBMITTED -> UNDER_REVIEW -> REVISED / REJECTED / APPROVED_FOR_INTERNAL_USE -> EXPLICIT_PUBLICATION_APPROVAL -> PUBLIC_VERSION`.

Review statuses are **separate** from public visibility. A participant can submit without waiving later privacy choices. Withdrawals must stop future public rendering, but cannot promise erasure from public Git history. The reviewer must not edit the participant's original text in place; proposed corrections are separate objects.

## First acceptance tests — synthetic roles, then authorized real accounts

1. Anonymous visitor reads public curated records, but cannot list source or feedback rows.
2. Participant A creates feedback and can read only their own drafts/feedback; B cannot read A.
3. Reviewer can inspect review queue, but cannot silently rewrite a frozen participant answer.
4. Publication requires reviewed exact version + scope + human approval; rejected or awaiting records never render publicly.
5. A missing Notion token produces a clear unavailable status without leaking Notion errors/credentials.
6. All source links must identify actual scholarly file/version and permission, not assume a private Drive URL may be published.
7. CI/deploy does not write commits under `github-actions[bot]`.

## Bibliography field contract

`{id, author, year, title, venue, doi?, edition_or_version?, canonical_source_id?, source_access, source_rights, read_depth, sections_checked, original_claim, reconstruction, rival_or_limit, park_source_relation, source_authority, review_status, publication_version}`.

**No fabricated DOI; no silently inferred complete reading from a PDF cover.** Source claims, our reconstruction and test hypotheses use distinct headings and distinct visual markers. Direct quotes are short, attributed and within applicable rights.

## Release receipts

Every 0.2 deploy receipt should include: Git commit SHA, commit authors/committers audit, data migration ID, RLS test result, front-end tests, Vercel deployment ID and URL, browser/mobile smoke test, public-source leakage negative test, and actual unmet holds. Do not label NOT RUN as PASS.

Scientific head: G2.21 semantic preseal; G2.22 design audits only. Do not mutate scientific lineage from this platform branch.
