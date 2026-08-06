# Franky Fu Portfolio

Personal portfolio for Franky Fu, a software developer in Edmonton building modern web experiences with AI-assisted workflows.

## Tech stack

- React 19
- TypeScript
- Vite
- Framer Motion

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm test
npm run build
```

## Background audio

The optional looping soundtrack lives at `public/audio/title-arcana-ver2.mp3` and is controlled by `src/components/BackgroundMusic.tsx`. It starts only after user interaction, uses 22% volume, remembers a muted preference, and pauses while the page is hidden.

Replace the MP3 at the same public path to change the soundtrack, then rerun `npm test` and `npm run build`.

## Video assets

Temporary development videos come from [`ryota-kk/personal-homepage`](https://github.com/ryota-kk/personal-homepage) at pinned commit `efaa277681640156d3178cc45a0e4d8bdc1efd77`. Their URLs live only in `src/data/media.ts`. They are placeholders for local preview, and a license for republication has not been established.

Before public launch, replace every temporary video with owned or properly licensed footage compressed for web delivery. Each scene must keep a local poster. The current manifest has no mobile-specific videos, so viewports below 768px intentionally show posters instead of downloading desktop MP4 files.

Next Experiment intentionally has no rendered proof image until a real product screenshot exists. Do not substitute concept art or fake metrics as proof.
