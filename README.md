# Xiwei Wang — Portfolio

A bilingual React portfolio for [wxw2002a.github.io](https://wxw2002a.github.io/), built with Vite, Three.js, and Motion. The September 2026 redesign combines editorial typography with an interactive modular silver cube, animated project studies, and expandable experience and project details. A slim accent reading-progress line and percentage/back-to-top control track the current page length, including expanded content.

Content is maintained in `app/src/content.js` (English and Chinese). Current experience and the downloadable `Xiwei-Wang-Resume.pdf` reflect the latest September 2026 résumé; four independent projects and additional tools from the previous site remain available. Project artwork is labeled as conceptual, not proprietary product screenshots.

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

For manual visual checks, start `npm run preview -- --host 127.0.0.1 --port 4175`, then run `node scripts/capture-preview.mjs`. Desktop, mobile, Chinese, light-theme, and dialog screenshots are written to the ignored `.visual-qa/` directory. Set `PREVIEW_URL` to inspect another deployment.

Run `node scripts/capture-motion.mjs` against the same preview to capture moving and exploded states on desktop and mobile. It also checks actual scene pixels change during playback and remain identical while paused. `npm test` covers the animation controls, reduced-motion behavior, off-screen suspension, hover effects, and existing content/navigation in both viewports.

Deployment: build and test, commit source and generated root assets plus the PDF, then push `main`. Verify the corresponding GitHub Pages workflow and compare the online asset names and PDF SHA-256 against the local build.
