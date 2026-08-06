# Cinematic Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Franky Fu's React portfolio as a cinematic, video-led chapter experience that remains recruiter-readable, responsive, accessible, and easy to update with final footage later.

**Architecture:** Split the current monolithic `App.tsx` into typed portfolio data, pure media and mail helpers, and focused scene components. Framer Motion owns scroll-linked transforms and reduced-motion behavior, while native CSS variables provide one locked dark theme and a single acid-yellow accent. Temporary reference videos are remote development sources behind a replaceable media manifest, and every scene has a local poster fallback.

**Tech Stack:** React 19, TypeScript, Vite, Framer Motion, Lenis, Vitest, Testing Library, native CSS

## Global Constraints

- Preserve the `top`, `about`, `work`, `skills`, and `contact` anchor IDs.
- Preserve Franky's factual project, education, employment, email, and GitHub details.
- Keep one locked cold-charcoal dark theme with soft-white text and acid yellow as the only accent.
- Use `DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 8`, and `VISUAL_DENSITY: 3`.
- Use real video with poster, loading, error, mobile, and reduced-motion fallbacks.
- Use temporary reference video URLs only through `src/data/media.ts` so final footage is replaced in one file.
- Do not use `window.addEventListener('scroll')` or React state for continuous scroll and pointer values.
- Animate only transform and opacity.
- Use `min-height: 100dvh`, never fixed `100vh`, for full-height scenes.
- Keep desktop navigation on one line and at or below 80px high.
- Use no em dash or en dash characters in visible page copy.
- Use one contact CTA label, `Let's talk`, everywhere.
- Respect `prefers-reduced-motion`; reduced-motion mode shows poster frames and immediate content.
- Below 768px, collapse asymmetric layouts to one column and disable scroll hijacking.
- Do not deploy or change route structure.

## File Structure

### Create

- `src/data/portfolio.ts`: typed project, capability, and experience content.
- `src/data/media.ts`: replaceable temporary video and poster manifest.
- `src/lib/mailto.ts`: pure contact-email URL builder.
- `src/lib/media.ts`: pure media-mode selection helper.
- `src/components/SceneVideo.tsx`: reusable video, poster, load, and failure state.
- `src/components/SiteNav.tsx`: accessible floating navigation.
- `src/components/HeroScene.tsx`: video-led hero.
- `src/components/ProjectChapter.tsx`: one cinematic project chapter.
- `src/components/AboutStatement.tsx`: portrait and personal positioning.
- `src/components/CapabilityIndex.tsx`: asymmetric capability list.
- `src/components/ExperienceTimeline.tsx`: experience section.
- `src/components/ContactScene.tsx`: contact form and footer.
- `src/test/setup.ts`: DOM testing setup.
- `src/data/portfolio.test.ts`: factual data contract tests.
- `src/lib/mailto.test.ts`: contact URL tests.
- `src/lib/media.test.ts`: media selection tests.
- `src/components/SceneVideo.test.tsx`: video fallback tests.
- `src/App.test.tsx`: page-level anchors and copy tests.

### Modify

- `package.json`: add test scripts and testing dependencies.
- `package-lock.json`: lock testing dependencies.
- `vite.config.ts`: configure Vitest and jsdom.
- `src/App.tsx`: compose focused scene components.
- `src/styles.css`: replace the current visual system with cinematic tokens and responsive scenes.
- `index.html`: update metadata and theme color.
- `README.md`: document video replacement and verification commands.

### Remove after replacement

- Inline `projects`, `experience`, `skills`, `reveal`, `SectionHead`, and continuous pointer state from `src/App.tsx`.
- Current purple lamp, decorative progress treatment, section numbering, scroll cue, repeated skill cards, and pointer-follow project preview styles from `src/styles.css`.

---

### Task 1: Establish the test harness and typed portfolio content

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/data/portfolio.test.ts`
- Create: `src/data/portfolio.ts`

**Interfaces:**
- Produces: `Project`, `Capability`, and `Experience` types.
- Produces: `projects: Project[]`, `capabilities: Capability[]`, and `experience: Experience[]`.
- `Project` fields: `slug`, `title`, `subtitle`, `year`, `image`, `href`, `stack`, `problem`, `solution`.

- [ ] **Step 1: Install and configure the test dependencies**

Run:

```bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add scripts to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Extend `vite.config.ts`:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 2: Write the failing portfolio data contract test**

Create `src/data/portfolio.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { capabilities, experience, projects } from './portfolio'

describe('portfolio data', () => {
  it('keeps three linkable projects with recruiter-focused narratives', () => {
    expect(projects).toHaveLength(3)
    for (const project of projects) {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/)
      expect(project.href).toMatch(/^https:\/\//)
      expect(project.stack.length).toBeGreaterThanOrEqual(3)
      expect(project.problem.length).toBeGreaterThan(20)
      expect(project.solution.length).toBeGreaterThan(20)
    }
  })

  it('preserves the five capabilities and three experience entries', () => {
    expect(capabilities).toHaveLength(5)
    expect(experience).toHaveLength(3)
    expect(experience[0]).toMatchObject({ company: 'NAIT', role: 'Software Development' })
  })
})
```

- [ ] **Step 3: Run the test and verify the missing module failure**

Run:

```bash
npm test -- src/data/portfolio.test.ts
```

Expected: FAIL because `src/data/portfolio.ts` does not exist.

- [ ] **Step 4: Implement typed portfolio data**

Create `src/data/portfolio.ts` with these exact types:

```ts
export type Project = {
  slug: string
  title: string
  subtitle: string
  year: string
  image: string
  href: string
  stack: string[]
  problem: string
  solution: string
}

export type Capability = {
  shortLabel: string
  title: string
  description: string
  tools: string[]
}

export type Experience = {
  period: string
  company: string
  role: string
  description: string
  emphasis: 'primary' | 'supporting'
}
```

Populate the arrays from the current `App.tsx`. Use these project narratives:

```ts
problem: 'Sales and returns workflows needed one dependable place for staff to review activity and keep records aligned.',
solution: 'Built a Blazor Server system with MudBlazor, Entity Framework Core, SQL Server, and focused operational views.',
```

```ts
problem: 'Candidates and recruiters needed a clearer path through listings, applications, and structured job data.',
solution: 'Created a Next.js recruitment application with Prisma, REST endpoints, and Jest coverage for core flows.',
```

```ts
problem: 'Exploring how AI-native workflows can move from isolated prompts into a coherent product experience.',
solution: 'Developing a TypeScript experiment that treats AI workflow and product design as one connected system.',
```

Use regular hyphens in date ranges, for example `2024 - 2026`.

- [ ] **Step 5: Run the data test and full test command**

Run:

```bash
npm test -- src/data/portfolio.test.ts
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit the test foundation and data model**

```bash
git add package.json package-lock.json vite.config.ts src/test/setup.ts src/data/portfolio.ts src/data/portfolio.test.ts
git commit -m "test: add portfolio data contracts"
```

---

### Task 2: Add pure contact and media selection behavior

**Files:**
- Create: `src/lib/mailto.test.ts`
- Create: `src/lib/mailto.ts`
- Create: `src/lib/media.test.ts`
- Create: `src/lib/media.ts`
- Create: `src/data/media.ts`

**Interfaces:**
- Produces: `buildMailtoUrl(input: ContactMessage): string`.
- Produces: `selectMediaMode(input: MediaModeInput): 'video' | 'poster'`.
- Produces: `sceneMedia: Record<SceneKey, SceneMedia>`.
- `SceneMedia` fields: `video`, optional `mobileVideo`, and `poster`.

- [ ] **Step 1: Write the failing mailto test**

Create `src/lib/mailto.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildMailtoUrl } from './mailto'

describe('buildMailtoUrl', () => {
  it('encodes the sender and multiline message', () => {
    const url = buildMailtoUrl({
      name: 'Ada Wong',
      email: 'ada@example.com',
      message: 'Hello Franky\nLet us talk.',
    })

    expect(url).toContain('mailto:firzenfu@gmail.com')
    expect(url).toContain('Portfolio%20enquiry%20from%20Ada%20Wong')
    expect(url).toContain('ada%40example.com')
    expect(url).toContain('Hello%20Franky%0ALet%20us%20talk.')
  })
})
```

- [ ] **Step 2: Run the mailto test and verify the missing module failure**

Run:

```bash
npm test -- src/lib/mailto.test.ts
```

Expected: FAIL because `src/lib/mailto.ts` does not exist.

- [ ] **Step 3: Implement the mailto builder**

Create `src/lib/mailto.ts`:

```ts
export type ContactMessage = {
  name: string
  email: string
  message: string
}

export function buildMailtoUrl(input: ContactMessage) {
  const subject = encodeURIComponent(`Portfolio enquiry from ${input.name.trim()}`)
  const body = encodeURIComponent(
    `Name: ${input.name.trim()}\nEmail: ${input.email.trim()}\n\n${input.message.trim()}`,
  )
  return `mailto:firzenfu@gmail.com?subject=${subject}&body=${body}`
}
```

- [ ] **Step 4: Write the failing media-mode tests**

Create `src/lib/media.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { selectMediaMode } from './media'

describe('selectMediaMode', () => {
  it('uses the poster when reduced motion is requested', () => {
    expect(selectMediaMode({ reducedMotion: true, failed: false })).toBe('poster')
  })

  it('uses the poster after a video failure', () => {
    expect(selectMediaMode({ reducedMotion: false, failed: true })).toBe('poster')
  })

  it('uses video when motion is allowed and loading has not failed', () => {
    expect(selectMediaMode({ reducedMotion: false, failed: false })).toBe('video')
  })
})
```

- [ ] **Step 5: Run the media test and verify the missing module failure**

Run:

```bash
npm test -- src/lib/media.test.ts
```

Expected: FAIL because `src/lib/media.ts` does not exist.

- [ ] **Step 6: Implement the media selector and manifest**

Create `src/lib/media.ts`:

```ts
export type MediaModeInput = {
  reducedMotion: boolean
  failed: boolean
}

export function selectMediaMode({ reducedMotion, failed }: MediaModeInput) {
  return reducedMotion || failed ? 'poster' : 'video'
}
```

Create `src/data/media.ts`:

```ts
export type SceneKey = 'hero' | 'bikes' | 'jobs' | 'experiment' | 'contact'

export type SceneMedia = {
  video: string
  mobileVideo?: string
  poster: string
}

const referenceBase = 'https://raw.githubusercontent.com/ryota-kk/personal-homepage/main/assets'

export const sceneMedia: Record<SceneKey, SceneMedia> = {
  hero: { video: `${referenceBase}/scene1.mp4`, poster: '/images/franky-avatar.jpg' },
  bikes: { video: `${referenceBase}/scene2.mp4`, poster: '/images/bikes-r-us-sales.png' },
  jobs: { video: `${referenceBase}/scene2_idle_loop.mp4`, poster: '/images/job-board.png' },
  experiment: { video: `${referenceBase}/scene3.mp4`, poster: '/images/next-experiment-v2.png' },
  contact: { video: `${referenceBase}/transition_1_2.mp4`, poster: '/images/franky-avatar.jpg' },
}
```

- [ ] **Step 7: Run both focused tests and the full suite**

Run:

```bash
npm test -- src/lib/mailto.test.ts src/lib/media.test.ts
npm test
```

Expected: PASS.

- [ ] **Step 8: Commit the pure behavior layer**

```bash
git add src/lib/mailto.ts src/lib/mailto.test.ts src/lib/media.ts src/lib/media.test.ts src/data/media.ts
git commit -m "feat: add contact and media behavior"
```

---

### Task 3: Build the resilient video scene component

**Files:**
- Create: `src/components/SceneVideo.test.tsx`
- Create: `src/components/SceneVideo.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `selectMediaMode(input: MediaModeInput): 'video' | 'poster'`.
- Produces: `SceneVideo(props: SceneVideoProps): JSX.Element`.
- `SceneVideoProps`: `src`, optional `mobileSrc`, `poster`, `priority`, and `className`.

- [ ] **Step 1: Write the failing reduced-motion and failure tests**

Create `src/components/SceneVideo.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { SceneVideo } from './SceneVideo'

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return { ...actual, useReducedMotion: vi.fn(() => false) }
})

describe('SceneVideo', () => {
  it('falls back to the poster after video failure', () => {
    render(<SceneVideo src="/scene.mp4" poster="/poster.jpg" />)
    fireEvent.error(screen.getByTestId('scene-video'))
    expect(screen.getByTestId('scene-poster')).toHaveAttribute('src', '/poster.jpg')
  })

  it('renders decorative video muted and outside the tab order', () => {
    render(<SceneVideo src="/scene.mp4" poster="/poster.jpg" />)
    const video = screen.getByTestId('scene-video')
    expect(video).toHaveAttribute('aria-hidden', 'true')
    expect(video).toHaveAttribute('tabindex', '-1')
    expect(video).toHaveProperty('muted', true)
  })
})
```

- [ ] **Step 2: Run the component test and verify the missing component failure**

Run:

```bash
npm test -- src/components/SceneVideo.test.tsx
```

Expected: FAIL because `SceneVideo.tsx` does not exist.

- [ ] **Step 3: Implement `SceneVideo`**

Create `src/components/SceneVideo.tsx`:

```tsx
import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { selectMediaMode } from '../lib/media'

export type SceneVideoProps = {
  src: string
  mobileSrc?: string
  poster: string
  priority?: boolean
  className?: string
}

export function SceneVideo({ src, mobileSrc, poster, priority = false, className = '' }: SceneVideoProps) {
  const reducedMotion = Boolean(useReducedMotion())
  const [failed, setFailed] = useState(false)
  const mode = selectMediaMode({ reducedMotion, failed })

  return (
    <div className={`scene-media ${className}`}>
      {mode === 'video' ? (
        <video
          data-testid="scene-video"
          aria-hidden="true"
          tabIndex={-1}
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          preload={priority ? 'auto' : 'metadata'}
          onError={() => setFailed(true)}
        >
          {mobileSrc && <source src={mobileSrc} media="(max-width: 767px)" type="video/mp4" />}
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <img data-testid="scene-poster" src={poster} alt="" aria-hidden="true" />
      )}
      <span className="scene-scrim" aria-hidden="true" />
    </div>
  )
}
```

Add only the structural `.scene-media`, child media, and `.scene-scrim` rules to `src/styles.css`; leave the complete visual rewrite for Task 4.

- [ ] **Step 4: Run focused and full tests**

Run:

```bash
npm test -- src/components/SceneVideo.test.tsx
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit the resilient media component**

```bash
git add src/components/SceneVideo.tsx src/components/SceneVideo.test.tsx src/styles.css
git commit -m "feat: add resilient cinematic video scenes"
```

---

### Task 4: Compose the shell, navigation, and hero

**Files:**
- Create: `src/App.test.tsx`
- Create: `src/components/SiteNav.tsx`
- Create: `src/components/HeroScene.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `sceneMedia.hero` and `SceneVideo`.
- Produces: `SiteNav(): JSX.Element` and `HeroScene(): JSX.Element`.
- `App` must render a `<main>` containing the stable section anchors.

- [ ] **Step 1: Write the failing page shell test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

describe('portfolio shell', () => {
  it('preserves navigation labels and section anchors', () => {
    const { container } = render(<App />)
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Works' })).toHaveAttribute('href', '#work')
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills')
    expect(screen.getByRole('link', { name: "Let's talk" })).toHaveAttribute('href', '#contact')
    for (const id of ['top', 'about', 'work', 'skills', 'contact']) {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument()
    }
  })

  it('states Franky’s role without decorative section numbering', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /software with a point of view/i })).toBeInTheDocument()
    expect(screen.queryByText(/01 \/|02 \/|03 \/|04 \/|scroll to explore/i)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the shell test and verify the expected content failure**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: FAIL because the new hero copy and complete composed anchors are not present.

- [ ] **Step 3: Implement the navigation and hero**

Create `SiteNav.tsx` with semantic `<header>` and `<nav>`, brand link `Franky Fu`, anchor links `About`, `Works`, `Skills`, and one CTA `Let's talk`.

Create `HeroScene.tsx` with:

```tsx
<section className="hero-scene" id="top">
  <SceneVideo {...sceneMedia.hero} priority />
  <motion.div className="hero-copy" initial={reduced ? false : 'hidden'} animate="visible">
    <p className="hero-kicker">Franky Fu, software developer</p>
    <h1>Software with a point of view.</h1>
    <p className="hero-summary">I build full-stack products with clear systems, considered interfaces, and practical AI workflows.</p>
    <a className="button button-primary" href="#work">View work</a>
  </motion.div>
</section>
```

Use `useReducedMotion()` and shared variants that animate only `opacity` and `transform`.

Replace `App.tsx` with the new shell. Add interim semantic sections for `about`, `work`, `skills`, and `contact` using their final headings and existing facts so the anchor contract is present from the first passing increment.

- [ ] **Step 4: Replace the global visual tokens and hero styles**

Rewrite the start of `src/styles.css` with semantic tokens:

```css
:root {
  font-family: Manrope, system-ui, sans-serif;
  color: #f2f1eb;
  background: #0d0f10;
  --surface: #0d0f10;
  --surface-raised: #171a1b;
  --text: #f2f1eb;
  --muted: #a8aaa4;
  --accent: #d7ff43;
  --line: rgb(242 241 235 / 16%);
  --radius-media: 6px;
  --radius-control: 999px;
}
```

Implement one-line floating navigation, `min-height: 100dvh` hero, readable video scrim, a maximum two-line headline, a 20-word-or-shorter summary, visible CTA, `:focus-visible`, and `:active` states. Remove the lamp, orbs, decorative outline word, scroll cue, purple variables, and section-number styles.

- [ ] **Step 5: Run shell tests and build**

Run:

```bash
npm test -- src/App.test.tsx
npm test
npm run build
```

Expected: all commands PASS.

- [ ] **Step 6: Commit the shell and hero**

```bash
git add src/App.tsx src/App.test.tsx src/components/SiteNav.tsx src/components/HeroScene.tsx src/styles.css
git commit -m "feat: build cinematic portfolio shell"
```

---

### Task 5: Build cinematic project chapters

**Files:**
- Create: `src/components/ProjectChapter.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `Project`, `SceneMedia`, and `SceneVideo`.
- Produces: `ProjectChapter({ project, media, index }: ProjectChapterProps): JSX.Element`.

Define the props exactly as:

```ts
export type ProjectChapterProps = {
  project: Project
  media: SceneMedia
  index: number
}
```

- [ ] **Step 1: Add the failing project chapter test**

Append to `src/App.test.tsx`:

```tsx
it('renders every project as a linked narrative chapter', () => {
  render(<App />)
  for (const title of ['Bikes R Us', 'Job Board', 'Next Experiment']) {
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
  }
  expect(screen.getAllByRole('link', { name: 'Open project' })).toHaveLength(3)
  expect(screen.getByText(/sales and returns workflows needed/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the test and verify the missing chapters failure**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: FAIL because the project narratives and three `Open project` links are absent.

- [ ] **Step 3: Implement `ProjectChapter`**

Create `src/components/ProjectChapter.tsx` with a full-height `<article>`, `SceneVideo`, a real project screenshot, project title, problem, solution, stack list, year, and external `Open project` link. Use `useScroll({ target, offset: ['start end', 'end start'] })` and `useTransform` for a small `y` and `scale` range. Disable transformed motion when `useReducedMotion()` returns true.

Use the following class hierarchy:

```tsx
<article className="project-chapter">
  <SceneVideo className="project-atmosphere" {...media} />
  <motion.div className="project-frame">
    <div className="project-copy">...</div>
    <figure className="project-proof">
      <img src={project.image} alt={`${project.title} interface`} loading="lazy" />
    </figure>
  </motion.div>
</article>
```

Map projects to media keys `bikes`, `jobs`, and `experiment` inside the `#work` section.

- [ ] **Step 4: Implement desktop and mobile project layouts**

In `src/styles.css`, give every chapter a stable reading zone, dark scrim, asymmetric screenshot placement, and visually distinct composition using `:nth-child`. Below 768px, use one column, natural document flow, full-width screenshots, and no pinned or hijacked scrolling.

- [ ] **Step 5: Run focused tests, full tests, and build**

Run:

```bash
npm test -- src/App.test.tsx
npm test
npm run build
```

Expected: all commands PASS.

- [ ] **Step 6: Commit the project chapters**

```bash
git add src/components/ProjectChapter.tsx src/App.tsx src/App.test.tsx src/styles.css
git commit -m "feat: add cinematic project chapters"
```

---

### Task 6: Build about, capabilities, experience, and contact scenes

**Files:**
- Create: `src/components/AboutStatement.tsx`
- Create: `src/components/CapabilityIndex.tsx`
- Create: `src/components/ExperienceTimeline.tsx`
- Create: `src/components/ContactScene.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `capabilities`, `experience`, `buildMailtoUrl`, `sceneMedia.contact`, and `SceneVideo`.
- Produces: four focused section components with no duplicate anchor IDs.

- [ ] **Step 1: Add failing content and contact tests**

Append to `src/App.test.tsx`:

```tsx
it('renders personal facts, capabilities, and experience', () => {
  render(<App />)
  expect(screen.getByText('NAIT Software Development')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Frontend Engineering' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Backend Systems' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'NAIT' })).toBeInTheDocument()
})

it('submits the accessible contact form through the mailto builder', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText('Name'), 'Ada Wong')
  await user.type(screen.getByLabelText('Email'), 'ada@example.com')
  await user.type(screen.getByLabelText('Message'), 'A product role in Edmonton.')
  expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled()
})
```

Import `userEvent` from `@testing-library/user-event` at the top of the test file.

- [ ] **Step 2: Run the tests and verify the missing content failure**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: FAIL because the final section components are not composed.

- [ ] **Step 3: Implement the four content components**

Implement:

- `AboutStatement`: portrait, two concise paragraphs, NAIT education, and Edmonton location.
- `CapabilityIndex`: asymmetric two-column index that maps all five capability objects without equal card styling.
- `ExperienceTimeline`: one primary NAIT entry and two visually quieter supporting entries.
- `ContactScene`: contact video, heading, one `Let's talk` text link, accessible fields, submit button, GitHub link, and footer.

The form submit handler must read `name`, `email`, and `message` from `FormData`, call `buildMailtoUrl`, then assign `window.location.href` to the returned URL.

- [ ] **Step 4: Replace semantic temporary sections in `App.tsx`**

Compose the final sequence:

```tsx
<SiteNav />
<main>
  <HeroScene />
  <AboutStatement />
  <section id="work">{projectChapters}</section>
  <CapabilityIndex />
  <ExperienceTimeline />
  <ContactScene />
</main>
```

Ensure `AboutStatement`, `CapabilityIndex`, and `ContactScene` own `about`, `skills`, and `contact` respectively.

- [ ] **Step 5: Complete responsive, focus, form, and reduced-motion styling**

Use vertically stacked section headings, no numbered eyebrows, sparse borders, and no equal three-column cards. Ensure labels remain above fields, placeholders are not used as labels, CTA text stays on one line, and every interactive control has hover, active, and focus-visible states.

Add a reduced-motion media query that removes CSS transitions and transforms while retaining readable content.

- [ ] **Step 6: Run focused tests, full tests, and build**

Run:

```bash
npm test -- src/App.test.tsx
npm test
npm run build
```

Expected: all commands PASS.

- [ ] **Step 7: Commit the supporting scenes**

```bash
git add src/components/AboutStatement.tsx src/components/CapabilityIndex.tsx src/components/ExperienceTimeline.tsx src/components/ContactScene.tsx src/App.tsx src/App.test.tsx src/styles.css
git commit -m "feat: complete portfolio content scenes"
```

---

### Task 7: Finish metadata, documentation, visual QA, and Taste pre-flight

**Files:**
- Modify: `index.html`
- Modify: `README.md`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify only if a verification failure requires it: files created in Tasks 1-6

**Interfaces:**
- Consumes: the complete portfolio page.
- Produces: a verified production build and documented video replacement contract.

- [ ] **Step 1: Update page metadata**

Use this metadata in `index.html`:

```html
<meta name="theme-color" content="#0d0f10" />
<meta name="description" content="Franky Fu is a software developer building full-stack products with clear systems, considered interfaces, and practical AI workflows." />
<meta property="og:title" content="Franky Fu | Software Developer" />
<meta property="og:description" content="Full-stack products shaped by systems thinking, visual craft, and practical AI workflows." />
<meta property="og:image" content="/images/next-experiment-v2.png" />
<title>Franky Fu | Software Developer</title>
```

- [ ] **Step 2: Document the media replacement contract**

Add a `Video assets` section to `README.md` explaining that all temporary URLs live in `src/data/media.ts`, each scene requires an MP4 and local poster, and final footage should be compressed for web delivery before replacing those manifest values.

Document:

```bash
npm test
npm run build
```

- [ ] **Step 3: Run automated verification**

Run:

```bash
npm test
npm run build
git diff --check
rg -n "—|–|window\.addEventListener\(['\"]scroll|h-screen|100vh|FIXME|PENDING" src index.html README.md
```

Expected:

- Vitest exits 0 with no failed tests.
- Vite build exits 0.
- `git diff --check` reports no whitespace errors.
- The `rg` audit reports no prohibited page copy, scroll listener, fixed viewport height, or unresolved placeholder markers.

- [ ] **Step 4: Start the site for browser verification**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Inspect at the actual URL printed by Vite.

- [ ] **Step 5: Verify desktop and mobile behavior**

At approximately 1440x900, verify:

- Navigation is one line and no taller than 80px.
- Hero headline is at most two lines and CTA is visible in the initial viewport.
- All five anchor links navigate to the intended sections.
- Each project has readable copy, a real screenshot, and a working external link.
- Video loading and error states preserve readable text.
- Contact labels, focus rings, placeholders, and button contrast meet WCAG AA.

At approximately 390x844, verify:

- Every asymmetric section is one column.
- No horizontal overflow exists.
- Video or poster fills the intended media area without hiding copy.
- Project screenshots remain legible.
- Navigation uses a compact menu without two-line desktop labels.

- [ ] **Step 6: Verify reduced-motion behavior**

Emulate `prefers-reduced-motion: reduce` and confirm:

- Scene videos render poster images.
- Content appears without entrance delays.
- No scroll-linked transform changes are visible.
- Navigation, links, project screenshots, and form remain fully usable.

- [ ] **Step 7: Run the Design Taste pre-flight checklist**

Mechanically confirm every applicable item from `design-taste-frontend` Section 14. Record fixes immediately. In particular verify:

- One dark theme, one acid-yellow accent, and one radius system.
- Zero numbered eyebrows, scroll cues, decorative dots, fake screenshots, duplicate CTA labels, and prohibited dash characters.
- Real media is present in hero and project sections.
- Every animation has a hierarchy, storytelling, feedback, or state-transition purpose.
- Mobile collapse, reduced motion, form contrast, button contrast, and copy self-audit pass.

- [ ] **Step 8: Run fresh final verification after any QA fixes**

Run:

```bash
npm test
npm run build
git diff --check
git status --short
```

Expected: tests and build exit 0, no whitespace errors, and only intended implementation files are modified.

- [ ] **Step 9: Commit final polish and documentation**

```bash
git add index.html README.md src
git commit -m "chore: verify cinematic portfolio redesign"
```

## Completion Evidence

Before reporting completion, include:

- Vitest test count and zero-failure result.
- Production build exit code and generated asset summary.
- Desktop, mobile, reduced-motion, video-fallback, and keyboard-navigation observations.
- Any Lighthouse limitations caused by temporary remote development videos.
- Confirmation that final video replacement requires edits only in `src/data/media.ts` and the associated poster files.
