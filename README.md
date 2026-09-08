# Xiwei Wang — Portfolio

A bilingual React portfolio for [wxw2002a.github.io](https://wxw2002a.github.io/), built with Vite, Three.js, and Motion. The September 2026 redesign combines editorial typography with an interactive modular silver cube, animated project studies, and expandable experience and project details. A slim accent reading-progress line and percentage/back-to-top control track the current page length, including expanded content.

The first screen centers the owner's engineering philosophy: “Good engineering is problem-solving with constraints.” The original English supporting paragraph is preserved, with a corresponding Chinese translation. Its two-column editorial layout separates the text from the interactive cube and stacks naturally on mobile.

Content is maintained in `app/src/content.js` (English and Chinese). Current experience and the downloadable `Xiwei-Wang-Resume.pdf` reflect the latest September 2026 résumé; four university projects and additional tools from the previous site remain available. Project artwork is labeled as conceptual, not proprietary product screenshots.

The unified Projects section at `#projects` groups six pinned GitHub repositories and four University Projects. The GitHub group includes bilingual summaries, category filters, source links, and verified public demo links. `arts-generation-platform` is explicitly labelled as IPMD work and opens the existing video case study. GitHub project data lives in `app/src/githubProjects.js`; evidence and demo limitations are recorded in `docs/github-projects.md`. The University Projects group preserves the original `#experiments` anchor, category filters, and expandable details. Its university-project classification comes from the owner; no specific institution or course affiliation is inferred. About and Contact follow as sections 04 and 05.

Each GitHub card also opens a project introduction in the same accessible modal as the work case studies. The introduction button extends over the card surface; source, demo, and IPMD case links remain independent controls. Five introductions retain complete English README sentences with Chinese translations, while Bitcoin's introduction is based on its implementation and retains a direct GitHub evidence link. Reviewed detail snapshots live in `app/src/projectDetailsProducts.js` and `app/src/projectDetailsTools.js`, composed by `app/src/projectDetails.js`. Introductions load from the site itself without GitHub API requests or project backend dependencies. The IPMD introduction reuses the existing three-video gallery.

Project introductions include the original screenshots embedded in or explicitly linked from their README: two for IPMD, one for CineFlow, and three for Second Hand Hub. The unmodified PNGs are self-hosted in `assets/projects/`, with bilingual captions and source links in `app/src/projectImages.js`. Images load lazily inside the dialog, keep their full aspect ratio, and open at original resolution in a new tab. Projects without README screenshots show no empty gallery; status/license badges and Mermaid source are not treated as screenshots.

The HIT industrial-vision case dialog includes the supplied detection demo (`assets/hit-detection-demo.mp4`) and a poster frame from that recording. The player loads only when this case opens, uses native inline/full-screen controls without autoplay, and releases playback when the dialog closes. Other project visuals remain conceptual.

IPMD's expanded experience and the “From prompt to image” case dialog share three supplied recordings: `assets/ipmd/video1.mp4` is the Creating Without Words overview, `video2.mp4` is the emotion-card workflow, and `video3.mp4` is the floating-card demo. Both galleries use the labels video1, video2, and video3, open on the overview, and mount only the selected player. Switching videos, collapsing the experience, or closing the dialog stops its playback. Opening a dialog pauses background video, and starting a player pauses any other player. Posters are frames from the corresponding recordings; the original video bytes are preserved.

## Local development

    npm install
    npm run dev

## Production build and checks

    npm run build
    npx playwright install chromium
    npm test

The Vite source lives in app/. A production build writes the deployable index.html and hashed assets to the repository root so GitHub Pages can serve them directly from main.

The sculpture loads Three.js separately, caps device pixel ratio, and stops rendering while off screen, in a background tab, or when motion is paused. System reduced-motion preferences are respected. WebGL-unavailable devices receive an SVG fallback. Dark appearance is the default; language and optional light appearance are stored locally.

Motion includes a staggered title entrance, scroll-responsive cube disassembly, an accessible explode/assemble button, light packets along the cube frame, pointer-responsive project cards, an AI image scan/reveal, warehouse route indicators, and a vision waveform. Pointer effects are disabled on touch devices. Pausing motion freezes the scene, while the cube button can still change its static state.

Once the cube's explicit explode/assemble control is used, its chosen assembly state takes precedence over automatic scroll/hover disassembly. The remaining light, pointer-orientation, and floating motion continues until paused.

For manual visual checks, start `npm run preview -- --host 127.0.0.1 --port 4175`, then run `node scripts/capture-preview.mjs`. Desktop, mobile, Chinese, light-theme, and dialog screenshots are written to the ignored `.visual-qa/` directory. Set `PREVIEW_URL` to inspect another deployment.

Run `node scripts/capture-motion.mjs` against the same preview to capture moving and exploded states on desktop and mobile. It also checks actual scene pixels change during playback and remain identical while paused. `npm test` covers the animation controls, reduced-motion behavior, off-screen suspension, hover effects, and existing content/navigation in both viewports.

Deployment: build and test, commit source and generated root assets plus the PDF, then push `main`. Verify the corresponding GitHub Pages workflow and compare the online asset names and PDF SHA-256 against the local build.
