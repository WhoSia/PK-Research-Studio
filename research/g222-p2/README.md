# P&K-G2.22-P2 — Bounded Rival-Semantics Implementation & Countermodel Court

**Contract:** Reference computation, not a test of Park's original speech, not a simulation of G2.21 B0–B6, and not a novel theorem claim. The P2 contract derived from private Notion P1 reading court. Public deployment or raw source ingestion is NOT part of this change.

Run locally:
```sh
node --test tests/g222-p2.test.cjs
node -p 'JSON.stringify(require("./research/g222-p2/reference.cjs").runReference(), null, 2)'
```

## Competing finite objects

**K (truth gap):** Strong Kleene-like finite truth jump with grounded proposition TRUE, Liar L=not Truth(L) and truth teller Q=Truth(Q). Begin all UNDEFINED; iterate. The minimal fixed point has TRUE/U/U; bivalent liar has no fixed valuation. The three-node demonstration is not a formalization of the entire Kripke (1975) language, transfinite construction, or all fixed points.

**Y (dependency bound):** The finite family of n statements S_i ↔ all S_j for j>i are false, with empty conjunction TRUE. Backward induction constructs a single solution, and independent exhaustive 2^n enumeration checks uniqueness for 1≤n≤10. No finite truncation can certify or refute the infinite paradox of Yablo (1993). The finite horizon is a deliberately non-equivalent negative control.

**A (finite generators):** Classical models of generators {p,p→q}, with input ¬q. Expansion has no models. Construct all inclusion-maximal generator subsets failing to entail q, then select all/first/last and expand by ¬q. These are **finite-base analogues** illustrating partial-meet selection; they do not implement the deductively closed AGM remainder structure or prove AGM postulates, recovery or a representation theorem. Models differ based on precommitted selector. Darwiche–Pearl iterated belief revision requires additional epistemic-state structure and remains P2 HOLD.

## Scope and inference walls

- **No independent research claim from textbook replication.** Kripke, Yablo and AGM theorems predate this implementation.
- **No cross-host claim that formal contradiction means Park contradicted himself.** Source-to-formal bridge B remains independent unapproved question.
- **No fake empirical replication.** Tests are formal toy-model unit tests; B0–B6 remains NO RUN.
- **No independent *implementations* claimed yet**: Y finite backward construction vs independent exhaustive valuation checker gives algorithmic cross-check on finite n, but all share JavaScript and the same formal specification.
- C0/C1/C2/C3 bounded examples covered here. C4 history-sensitive revision, C5 enriched-state law, C6 alternate source bridge and full G2.21 executable contract HOLD.

## Main P2 release criterion

Do not add these outputs to the public manifest or the Rival-Model Atlas until a separate approved research summary has been reviewed. Keep proof obligations, mathematical assumptions, fixed expected output, and model-vs-source boundary visible.
