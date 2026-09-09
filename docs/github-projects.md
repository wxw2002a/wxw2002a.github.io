# GitHub project curation

Checked on 2026-09-09 against the six pinned public repositories on https://github.com/wxw2002a. The portfolio uses a reviewed static list, not a runtime GitHub API dependency. Update `app/src/githubProjects.js` when repository content changes.

## Engineering review paths

The three complete applications appear first: CineFlow, Arts Generation Platform, and Second Hand Hub. Each card and introduction links directly to its repository's `docs/CASE_STUDY.md`, where a reviewer can follow the design decisions into code, tests, and recorded evidence. These are ordinary external links; opening a card still works without GitHub or a project backend. The remaining tools stay available in the same grid and filters.

CineFlow's card emphasizes transactional seat ownership and actual PyTorch training. PyTorch is also listed in the site's technical toolkit, supported by `ml/cineflow_ml/train.py` and its model code. Simulation and offline-evaluation scope stay visible. Ordering the project cards does not imply production traffic or change the owner's GitHub pinned order.

- **arts-generation-platform**: https://github.com/wxw2002a/arts-generation-platform/blob/main/README.md and `frontend/package.json`. The owner explicitly identifies this as IPMD work. Its public Pages demo is a browser-only prompt builder/reference preview/sample gallery, not live model inference. The portfolio's IPMD case remains the destination for the owner's three videos.
- **Bitcoin-project**: no README or homepage. https://github.com/wxw2002a/Bitcoin-project/blob/main/Client.java, `a1.thrift`, `Calibrator.java`, and `MiningPoolServiceHandler.java` support describing a Java/bitcoinj/Thrift learning prototype. The mining handler returns a constant and cancellation is a stub; do not present a completed distributed mining pool.
- **cineflow**: https://github.com/wxw2002a/cineflow/blob/main/README.md and `frontend/package.json`. Cinema discovery, seat reservations, recommendation and AI conversation are documented. Payments/tickets are simulated. Local Docker deployment is documented; no public demo URL is advertised.
- **ic-fa**: https://github.com/wxw2002a/ic-fa/blob/main/README.md, `app.js`, and `penpad-clinical-data.schema.json`. Local-first Canvas/Pointer Events drawing tasks and explicit JSON export. Experimental observations are not diagnostic assessments. No IPMD affiliation is claimed by the README, so none is inferred.
- **second-hand-hub**: https://github.com/wxw2002a/second-hand-hub/blob/main/README.md. Marketplace, persistent chat, draft listings, and simulated checkout. Do not claim real payments or production-scale deployment.
- **LowPassFilter_Tool**: https://github.com/wxw2002a/LowPassFilter_Tool/blob/main/README.md and `LowPassFilter_Tool.py`. Interactive Lp-based filtering/step-response exploration using NumPy and Matplotlib, not a real-time production filtering service.

Verified public demos returning HTTP 200:

- https://wxw2002a.github.io/arts-generation-platform/
- https://wxw2002a.github.io/ic-fa/

All six GitHub cards open local project introductions using the work-case modal, with separate source and available demo links. The unified `#projects` section contains this six-repository GitHub group and a University Projects group for the four existing projects. The owner identified those four as university projects; no specific institution or course affiliation is inferred. Their original `#experiments` anchor, category filters, and expandable details are preserved within the combined section. `arts-generation-platform` remains explicitly associated with IPMD. About and Contact follow as sections 04 and 05.

## Introduction provenance

Rechecked 2026-09-09. The introductory paragraphs for the five repositories with README files preserve complete original English sentences, with corresponding Chinese translations. Their feature, implementation, and scope sections are curated summaries, not a claim to reproduce the entire README. CineFlow's experiments section also summarizes the linked ML protocol and isolated multi-instance verification guide. The LowPass overview omits a broad claim about processing all input samples because the implementation uses a default 500-sample sliding window; its original short-signal recommendation is preserved.

Bitcoin's introduction was checked against repository code, with a direct evidence link to `Client.java`; the mining and cancellation limitations were checked against `MiningPoolServiceHandler.java`. Its visible source caption uses the neutral "Project overview" / "项目介绍" label, without editorial notes about missing README content. Do not imply working distributed mining or validated throughput.

The reviewed bilingual data is stored in `app/src/projectDetailsProducts.js` and `app/src/projectDetailsTools.js`. No external Markdown is executed or rendered as raw HTML, and no GitHub API calls are needed when opening introductions. The IPMD project introduction includes the existing video1/video2/video3 gallery; the original work-case shortcut remains available.

## README screenshots

Checked 2026-09-08 against each repository's default `main` branch. Six original PNG files are copied without edits to `assets/projects/`; their local Git blob hashes matched the GitHub contents API. `app/src/projectImages.js` records the corresponding GitHub image links, dimensions, alternate text, and bilingual captions. Images only mount with an open introduction and use native lazy loading. They are not cropped; both the image and the original-image text link open the local, original-resolution file in a new tab.

| Repository | README image path | Dimensions | SHA256 of original PNG |
| --- | --- | --- | --- |
| arts-generation-platform | `docs/demo.png` | 1440 × 1000 | `7802eac51e4d0ed92658b6527a79fe5ce3ec73a4a40c1311ce7f5d1bb46143e9` |
| arts-generation-platform | `docs/preview.png` | 1440 × 1000 | `826ff98e29e4e71095e18c9168e7e616aa0eac218dc668ef938dc31a0e8aafa1` |
| cineflow | `docs/images/overview.png` | 1440 × 1814 | `d1c480cde027f60439c3d6c5e4703eb84650d936886691a98fcce464d50225f0` |
| second-hand-hub | `docs/images/marketplace.png` | 1440 × 1060 | `e24b43a992a30804a34408c2627a79d9c45d4b62c3f077f678b3f929d8c0ca27` |
| second-hand-hub | `docs/images/chat.png` | 1440 × 1000 | `3a4551b5b761854f2b38504be0079c2dc2e59edad734bb3d428271f548c68ced` |
| second-hand-hub | `docs/images/checkout.png` | 1440 × 1000 | `74eef6e37d19d98a821576732f5d06fd04fe0418e48e1245ae2842b11e9cf66c` |

Arts' `preview.png` is explicitly linked from the README rather than embedded. Second Hand Hub's chat and checkout screenshots are included inside its README's collapsible details. Bitcoin has no README; ic-fa and LowPass have no README screenshots. No unrelated images are added to those projects. CI/license badges and Mermaid code blocks are excluded. The existing IPMD video gallery remains before the screenshots.
