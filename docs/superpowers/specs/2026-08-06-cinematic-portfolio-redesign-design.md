# Cinematic Portfolio Redesign

## Objective

Redesign Franky Fu's existing React portfolio using the cinematic scene-scroll language of `ryota-kk/personal-homepage`, while preserving Franky's identity, navigation anchors, project facts, contact details, and recruiter-focused usability.

The redesign will use temporary public video assets during development. Every video slot must remain easy to replace when Franky provides final footage.

## Design Read

This is a visual overhaul of a developer portfolio for recruiters and hiring managers. The visual language is cinematic, high-contrast, and experimental, with native React components, Framer Motion, and restrained editorial typography.

## Design Dials

- `DESIGN_VARIANCE: 8`: asymmetric cinematic composition with stable reading zones.
- `MOTION_INTENSITY: 8`: scene transitions, mask reveals, scroll-linked project chapters, and tactile feedback.
- `VISUAL_DENSITY: 3`: large media, short copy, and deliberate negative space.

## Redesign Audit

### Existing brand and structure

- Dark portfolio using Manrope and DM Mono.
- Purple and blue accents, glow effects, glass navigation, and large display typography.
- Stable anchors: `top`, `about`, `work`, `skills`, and `contact`.
- Three projects, five capability groups, three experience entries, portrait, email contact, and GitHub profile.
- React 19, TypeScript, Vite, Framer Motion, Lenis, and Lucide React.

### Preserve

- Franky Fu identity and portrait.
- Project names, screenshots, factual stack details, and destination links.
- About, Works, Skills, and Contact navigation labels and anchors.
- Experience facts, contact email, and GitHub profile.
- Semantic HTML, labels, reduced-motion support, keyboard navigation, and responsive behavior.

### Retire

- Purple and blue glow field as the dominant visual language.
- Oversized three-line hero and decorative outline word.
- Decorative status dots, section numbering, scroll cue, and repeated eyebrow labels.
- Repeated card grids and generic glass treatment.
- React state driven by continuous pointer movement.
- Direct `window` scroll listener for navigation state.
- Em dash and en dash characters in visible copy.

## Visual System

### Theme and palette

The entire page uses one locked dark theme. The base is cold charcoal rather than pure black. Text uses soft white and cool grey. Acid yellow is the single accent across links, focus rings, active states, progress, and small highlights.

No section changes to a light theme. Video scenes use dark scrims to preserve text contrast. Video color grading should lean neutral and cinematic so the accent remains distinctive.

### Typography

Use a modern sans-serif display face with a self-hosted or system-safe delivery strategy, paired with a restrained monospace for metadata. Display copy remains at two lines or fewer in the hero. Body copy is short, direct, and recruiter-readable.

### Shape and material

- Media and structural panels use a small, consistent radius.
- Interactive buttons use full-pill geometry.
- Glass is limited to the floating navigation and overlays that sit directly on video.
- Shadows are tinted to the dark background and used only where depth communicates hierarchy.

## Information Architecture

The anchor structure remains stable:

1. `#top`: video hero and primary positioning.
2. `#about`: personal statement and portrait.
3. `#work`: three cinematic project chapters.
4. `#skills`: compact capability index and experience.
5. `#contact`: contact scene, form, and footer.

The visual sequence is:

1. Video hero.
2. Short personal manifesto.
3. Project chapters.
4. About and portrait.
5. Capability index.
6. Experience.
7. Contact closing scene.

## Content Strategy

The copy may be rewritten and shortened, but factual claims must remain grounded in existing content.

- Hero: full-stack development, product thinking, and AI-assisted workflow.
- Projects: problem, implementation, and outcome or demonstrable result.
- Skills: concise capability groups instead of five equal promotional cards.
- Experience: preserve all roles while giving development experience greater visual emphasis.
- Contact: use one consistent contact label, `Let's talk`, across navigation, hero, and closing section.

Avoid generic marketing verbs, invented metrics, decorative metadata, and repeated explanatory copy.

## Component Architecture

### `SceneVideo`

Owns video playback, muted looping, poster image, loading placeholder, failure fallback, and reduced-motion behavior. It accepts replaceable desktop and optional mobile sources.

### `HeroScene`

Composes the primary video, headline, short positioning statement, and one primary work CTA. It fits inside the initial dynamic viewport.

### `ProjectChapter`

Renders one project as a full-height chapter with video atmosphere, real project screenshot, concise project narrative, stack details, and an external link.

### `AboutStatement`

Combines Franky's portrait with a short personal statement and core education and location facts.

### `CapabilityIndex`

Presents frontend, backend, AI workflow, product craft, and communication as a compact asymmetric index without equal promotional cards.

### `ExperienceTimeline`

Presents the three existing experience entries with clear date, company, role, and concise description.

### `ContactScene`

Provides the closing video scene, contact copy, accessible email form, GitHub link, and footer.

### Motion utilities

Shared hooks and variants own reduced-motion checks, scene reveal behavior, and scroll-linked transforms. Continuous scroll and pointer values remain outside React state.

## Motion Design

- Hero copy enters through a mask reveal to establish hierarchy.
- Project chapters transition with scroll-linked opacity and restrained scale changes to create narrative continuity.
- Navigation contracts after leaving the hero using Motion values or intersection state.
- About, skills, and experience use lightweight entrance reveals.
- Buttons use tactile press feedback and clear hover and focus states.

Every animation must communicate hierarchy, storytelling, feedback, or state change. No custom cursor, perpetual decorative loops, scroll cue, or multiple marquees are included.

The implementation must not use `window.addEventListener('scroll')`, React state for continuous pointer or scroll values, or layout-property animation.

## Video Asset Strategy

Development uses temporary public video assets from the reference project where licensing and repository availability permit. Final files will be provided later.

Each video placement must define:

- Desktop video source.
- Optional mobile video source.
- Poster frame.
- Text contrast scrim.
- Loading placeholder with reserved dimensions.
- Failure fallback to the poster.
- Reduced-motion fallback to the poster.

Mobile layouts avoid scroll hijacking and prioritize poster frames or short, low-cost playback.

## States and Error Handling

- Loading: show a layout-matched poster or neutral skeleton without a spinner.
- Video failure: retain poster image and all textual content.
- Missing project image: omit the screenshot layer while retaining the project chapter.
- Reduced motion: stop automatic scene motion and show content immediately.
- Contact validation: retain visible labels, native constraints, focus states, and clear inline feedback where custom validation is introduced.
- JavaScript failure: core copy, navigation, projects, and contact links remain present in semantic markup.

## Accessibility

- Meet WCAG AA contrast for all text and controls.
- Keep one-line desktop navigation with a maximum height of 80px.
- Preserve visible keyboard focus states.
- Provide meaningful image alt text and treat background video as decorative.
- Ensure all video is muted, non-blocking, and never required to understand content.
- Respect `prefers-reduced-motion` for every animation.
- Use `min-height: 100dvh` rather than fixed viewport height.
- Use explicit single-column mobile collapse below 768px.

## Performance

- Load only the hero video eagerly.
- Lazy-load project scene videos and supporting images.
- Preload the hero poster and reserve media dimensions to control CLS.
- Animate only transform and opacity.
- Avoid video playback for off-screen chapters where practical.
- Keep LCP under 2.5 seconds, INP under 200ms, and CLS under 0.1 as target budgets.

## Testing and Verification

### Automated tests

- Project data renders required content and links.
- Mailto content generation remains correctly encoded.
- Video fallback and reduced-motion selection logic return the correct media state.
- Navigation anchors remain stable.

Behavior changes follow a red, green, refactor cycle.

### Build and static checks

- Run the complete automated test suite.
- Run TypeScript and Vite production build.
- Check visible copy for banned dash characters and placeholder text.
- Confirm no continuous `window` scroll listener exists.

### Visual verification

- Inspect desktop and mobile layouts.
- Test normal and reduced-motion modes.
- Test video loading and video failure fallbacks.
- Check navigation, project links, form labels, focus states, and CTA contrast.
- Run Lighthouse and record material performance or accessibility gaps.
- Complete the full Design Taste pre-flight checklist before delivery.

## Out of Scope

- Publishing or deployment.
- Changing route structure or anchor names.
- Replacing factual project or employment details with invented claims.
- Final video color grading or editing before Franky provides permanent assets.
- Backend form delivery service.

## Acceptance Criteria

- The page clearly resembles a cinematic chapter-based portfolio without copying the reference site verbatim.
- Real video drives the visual narrative and has robust poster fallbacks.
- Recruiters can identify Franky's role, projects, skills, experience, and contact path quickly.
- Existing factual content and navigation anchors remain intact.
- Mobile and reduced-motion experiences remain complete and readable.
- Automated tests and the production build pass.
- The complete Design Taste pre-flight checklist passes.
