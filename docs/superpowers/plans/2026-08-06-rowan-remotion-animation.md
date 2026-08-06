# Rowan Magic Awakening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and render a deterministic 10-second, 1920x1080, 30fps Remotion character promo using the supplied Rowan PNG.

**Architecture:** Create an isolated `rowan-remotion` package within the repository. Keep timing math and seeded particle generation in pure helpers, while React components compose the background, character treatment, staff glow, arcane ribbons, runes, vignette, and grain into one `RowanMagicAwakening` composition.

**Tech Stack:** React, TypeScript, Remotion 4, Vitest, CSS/SVG effects.

## Global Constraints

- Composition is exactly 300 frames at 30fps and 1920x1080.
- All motion is frame-driven with `useCurrentFrame()`, `interpolate()`, `spring()`, and `Easing`; no CSS transitions or keyframes.
- Randomized visuals use a fixed seed and render deterministically.
- Preserve the supplied character artwork without redrawing or geometric distortion.
- No titles, logos, captions, or watermarks.
- Render a final H.264 MP4 and verify representative still frames.

---

### Task 1: Scaffold and deterministic animation model

**Files:**
- Create: `rowan-remotion/package.json`
- Create: `rowan-remotion/tsconfig.json`
- Create: `rowan-remotion/src/animation.ts`
- Test: `rowan-remotion/src/animation.test.ts`

**Interfaces:**
- Produces: `VIDEO`, `PALETTE`, `createParticles(count, seed)`, `sceneProgress(frame)`.

- [ ] **Step 1: Write failing helper tests**

```ts
expect(createParticles(4, 728)).toEqual(createParticles(4, 728));
expect(sceneProgress(0).fade).toBe(0);
expect(sceneProgress(299).fade).toBeLessThan(1);
```

- [ ] **Step 2: Run RED test**

Run: `npm test -- --run`
Expected: FAIL because `animation.ts` does not exist.

- [ ] **Step 3: Implement constants, seeded PRNG, particles, and scene timing**

Use a Mulberry32-style seeded generator and clamped Remotion interpolation for fade, camera, staff activation, and finale pulse.

- [ ] **Step 4: Run GREEN test**

Run: `npm test -- --run`
Expected: all helper tests pass.

### Task 2: Build the composition

**Files:**
- Create: `rowan-remotion/src/index.ts`
- Create: `rowan-remotion/src/Root.tsx`
- Create: `rowan-remotion/src/RowanMagicAwakening.tsx`
- Create: `rowan-remotion/src/components/Atmosphere.tsx`
- Create: `rowan-remotion/src/components/MagicEffects.tsx`
- Create: `rowan-remotion/src/components/RowanCharacter.tsx`
- Create: `rowan-remotion/public/rowan.png`

**Interfaces:**
- Consumes: `VIDEO`, `PALETTE`, `createParticles()`, `sceneProgress()`.
- Produces: composition id `RowanMagicAwakening`.

- [ ] **Step 1: Add a failing registration smoke test**

```ts
expect(VIDEO.durationInFrames).toBe(300);
expect(VIDEO.width).toBe(1920);
expect(VIDEO.height).toBe(1080);
```

- [ ] **Step 2: Run RED test**

Run: `npm test -- --run`
Expected: FAIL until the video configuration is complete.

- [ ] **Step 3: Implement the layered scene**

Compose indigo fog, deterministic particles, rune circles, SVG energy ribbons, crystal glows, restrained 1-2% character breathing, 100-108% camera push, highlight sweep, vignette, and deterministic grain. Reference `public/rowan.png` through `staticFile()`.

- [ ] **Step 4: Typecheck and run GREEN tests**

Run: `npm run typecheck && npm test -- --run`
Expected: TypeScript succeeds and tests pass.

### Task 3: Preview, visual QA, and render

**Files:**
- Create: `rowan-remotion/remotion.config.ts`
- Create: `rowan-remotion/out/rowan-magic-awakening.mp4`
- Create: `rowan-remotion/out/qa/frame-000.png`
- Create: `rowan-remotion/out/qa/frame-150.png`
- Create: `rowan-remotion/out/qa/frame-255.png`
- Create: `rowan-remotion/out/qa/frame-299.png`

**Interfaces:**
- Consumes: composition id `RowanMagicAwakening`.
- Produces: final MP4 plus representative QA stills.

- [ ] **Step 1: Start Studio without opening a system browser**

Run: `npm run studio -- --port=3100`
Expected: Studio prints a local URL without TypeScript or asset errors.

- [ ] **Step 2: Render representative stills**

Run: `npx remotion still RowanMagicAwakening out/qa/frame-150.png --frame=150`
Expected: each requested frame renders at 1920x1080.

- [ ] **Step 3: Inspect stills and correct visible defects**

Check character sharpness, face visibility, crystal alignment, restrained glow exposure, particle depth, edge clipping, and fade timing.

- [ ] **Step 4: Render final video**

Run: `npx remotion render RowanMagicAwakening out/rowan-magic-awakening.mp4 --codec=h264`
Expected: a 300-frame 1920x1080 MP4 renders successfully.

- [ ] **Step 5: Verify output metadata and final tests**

Run: `npm run typecheck && npm test -- --run`
Expected: zero TypeScript errors, all tests pass, and the output file exists with non-zero size.
