# Platform 0.3 — verified two-participant password collaboration

**Formal proposal:** P&K-Platform-0.3 — Verified Two-Participant Research Exchange & Source-Sovereign Collaboration: Password-Based Identity, Role-Isolated Dialogue, Revision Provenance & Consent-Gated Publication.

## What is implemented
- Supabase email/password self-registration and password login instead of magic-link-only UI.
- The two account identifiers are stored exclusively in a Supabase **private** allowlist, never checked into public GitHub, CSS, HTML or JavaScript.
- A Supabase Auth trigger enrolls a verified allowlisted address into the preexisting `public.app_members` table with `reviewer` or `participant` role. Unconfirmed accounts and other email addresses never acquire workspace membership.
- Existing public RLS policies: both enrolled roles read questions/replies; reviewer authors questions and feedback-review status; participant authors append-only answer revisions; both may submit feedback; readers without membership see only the curated public atlas.
- Research drafts and submitted private feedback remain separate from the approved public record manifest. No automatic Notion/GitHub source publication.
- G2.23 human-source answer is frozen separately in private Notion. New public code does not include its wording or personal emails.

## Security decisions
- NEVER collect passwords in chat; user chooses passwords at first registration. Password verification/hashing done by Supabase Auth.
- No service-role key or database secret is embedded in browser assets. Browser uses only the publishable key.
- Verification link is required before role enrollment; password login alone cannot grant roles.
- SQL implementation is Supabase migration `platform_03_verified_member_enrollment`. Private allowlist is data, not an open registration control.
- RLS policies remain the authoritative boundary. Client-side input visibility alone cannot grant access.
- Session tokens are held in sessionStorage for this lightweight static site. They should not be regarded as equivalent to HttpOnly SSR cookies and MFA protection; account testing and further hardening remain pending.
- Do not copy user addresses to public documentation or screenshots.

## Owner acceptance checklist (NOT yet completed by this commit)
1. Supabase Authentication > URL Configuration: set Site URL and allowlisted Redirect URL to https://pk-research-studio.vercel.app/ .
2. Each of the two invited people visits the official website, supplies **their own email address**, creates a distinct long password and confirms their email link.
3. Each signs in independently and checks that only their expected role is granted.
4. Reviewer creates a test question; participant sees it and adds an answer; reviewer can read answer; an anonymous visitor cannot read unpublished answers.
5. Both submit a harmless test feedback, verify role-appropriate access, sign out and test expired session.
6. Inspect Auth rate limits, password protection, email confirmation delivery and production-domain redirects before calling the real-person E2E a PASS.
7. Remove test data only with an audited reversible plan; do not silently clean real dialogue or source.

## Research authority boundary
Platform service readiness does not make G2.23 philosophy true. The synthetic causal calculation is independently checkable; human source interpretation and real expression effects remain HOLD. G2.21 B0–B6 remains NO RUN.
