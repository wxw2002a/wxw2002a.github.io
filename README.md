# Xiwei Wang — Portfolio

A bilingual React portfolio for [wxw2002a.github.io](https://wxw2002a.github.io/), built with Vite and Motion.

## Local development

    npm install
    npm run dev

## Production build and checks

    npm run build
    npx playwright install chromium
    npm test

The Vite source lives in app/. A production build writes the deployable index.html and hashed assets to the repository root so GitHub Pages can serve them directly from main.
