# Design research · 2026-10-10

This ledger records design principles only. No third-party layout, illustration, photograph, code, or commercial asset is copied. License status refers to **reuse of assets**, not permission to study a public site. We use original CSS/SVG geometry and web-served Google Fonts under their own licenses.

| Reference | Observed principle to adopt | Avoid / asset status |
| --- | --- | --- |
| [Cooper Hewitt interactive visitor experience](https://www.cooperhewitt.org/new-experience/) | Let visitors manipulate a collection and discover connections themselves. | Do not copy museum touch-table UI or media; no assets reused. |
| [Cooper Hewitt Labs collection experiments](https://labs.cooperhewitt.org/) | Offer multiple entry points into one archive, such as time and color. | Avoid importing collection imagery or metadata; no assets reused. |
| [The Met Heilbrunn Timeline](https://www.metmuseum.org/de/essays/timeline-of-art-history) | Make chronology a navigation dimension beside thematic exploration. | Avoid museum chronology visuals and art reproductions; no assets reused. |
| [Wellcome Collection](https://wellcomecollection.org/search/stories) | Pair archive material with editorial explanation and clear format labels. | Do not copy stories or archive items; no assets reused. |
| [Manifold Scholarship at Penn](https://penn.manifoldapp.org/) | Keep publication, revision, and reader annotation visibly distinct. | Avoid duplicating its annotation controls; no assets reused. |
| [The Ekmans' Atlas of Emotions](https://atlasofemotions.org/) | Use a conceptual map as the primary way to explore an abstract subject. | Avoid its emotion geography and motion system; no assets reused. |
| [Observable temporal force-directed graph](https://observablehq.com/notebook-kit/ex/d3/temporal-force-directed-graph) | Give relationships a visible temporal dimension and allow direct node inspection. | No notebook code or data reused; implementation is original SVG. |
| [Google Arts & Culture Free Fall](https://artsandculture.google.com/experiment/free-fall/OgH0Luu395YKPQ?hl=en) | Use spatial exploration to uncover patterns across a corpus. | Avoid heavy 3D navigation and artwork images; no assets reused. |
| [Google Arts & Culture Art Palette](https://artsandculture.google.com/experiment/art-palette/0AEvw1CK-6lCCA?hl=en) | Treat a chosen property as a lens over the same material. | Avoid palette search mechanics and image assets; no assets reused. |
| [NASA Eyes on Earth](https://eyes.nasa.gov/apps/earth/) | Separate live observations and selectable data layers from explanatory context. | Never style speculative states as live telemetry; no assets reused. |
| [Mirador IIIF viewer](https://projectmirador.org/) | Make side-by-side comparison and provenance visible in an inspection workspace. | Avoid copying its mosaic UI; no assets reused. |
| [Our World in Data chart redesign](https://ourworldindata.org/redesigning-our-interactive-data-visualizations) | Keep chart controls, source context, and reading order clear on small screens. | Avoid reusing charts or datasets; no assets reused. |

## Three directions considered

| Direction | Type / grid / color / motion | Judgment |
| --- | --- | --- |
| **A. Archival folio** | Serif display, dense article columns, cream and rust, restrained fades | Strong custody and reading, but graph exploration would feel secondary. |
| **B. Philosophical observatory** | Editorial serif with mono labels, wide map canvas, deep green/cream/rust, functional selection motion | **Selected.** Makes the graph the centerpiece while retaining visible provenance and no-run states. |
| **C. Laboratory instrument** | Compact sans, strict modular grid, monochrome with signal color, mechanical control feedback | Clear experimental controls, but too close to a generic SaaS dashboard. |

The implemented direction uses an original orbital motif, an SVG concept field, typographic section numbers, a research chronicle, and explicit provenance labels. No prompt hero, chat bubbles, standard left sidebar, or stock gradient.
