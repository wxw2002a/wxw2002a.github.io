# AI project preview artwork

The AI project card uses a React-built **concept interface**, not a screenshot of IPMD software. Its architectural preview is an illustrative, AI-generated image, not an output claimed to come from the deployed IPMD inference pipeline. Existing résumé facts and project descriptions are unchanged.

- Website asset: `assets/ai-architecture-preview.jpg` (1536 × 1024, 250,388 bytes).
- Mode: built-in `image_gen`, not the fallback CLI/API workflow.
- The original generated PNG is retained in the generator's output directory and copied to the ignored workspace `.visual-qa/ai-preview-original.png`. The website version is a JPEG format conversion at quality 88, without compositional editing or resizing.
- Prompt and interface text are kept separate so the displayed UI remains sharp and responsive.

## Final generation prompt

```text
Use case: photorealistic-natural
Asset type: generated-image preview inside an AI image-generation portfolio UI (the UI will be built separately in React).
Primary request: an elegant architectural editorial photograph of a minimal pale limestone pavilion beside a still blue-green sea.
Scene/backdrop: quiet Mediterranean coast, a perfectly level sea horizon and clear softly muted blue sky.
Subject: one monolithic limestone wall with a large clean rectangular opening framing the sea, a low terrace and a narrow reflecting pool, precise rectilinear architecture with beautiful long late-afternoon shadows.
Style/medium: photorealistic architectural photography, tactile fine limestone texture, believable reflections, sophisticated restrained composition.
Composition/framing: landscape 3:2 composition, eye-level wide shot, architecture readable when cropped to 4:3; clean visual hierarchy and uncluttered scene.
Lighting/mood: warm directional sunlight, calm and luminous, soft natural highlights, strong but not crushed shadows.
Color palette: warm ivory stone, subtle sand, desaturated teal sea and powder blue sky.
Constraints: image only; no text, no UI, no borders, no logos, no watermark, no people, no curves or tubes or metallic knots, no sci-fi clutter.
```
