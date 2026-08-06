# Background Music Controller Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional looping background music that begins after the first user interaction and is controlled by an accessible fixed musical-note mute button.

**Architecture:** A single `BackgroundMusic` leaf component owns the native audio element, playback state, persisted mute preference, first-interaction listener, visibility listener, and error state. `App` mounts the controller once; CSS supplies the fixed secondary control without adding a library or global context.

**Tech Stack:** React 19, TypeScript, native `HTMLAudioElement`, localStorage, Vitest 4, Testing Library, native CSS.

## Global Constraints

- Source audio: `C:\Users\Admin\Downloads\Title_Arcana_Ver2.mp3`.
- Public asset: `public/audio/title-arcana-ver2.mp3`.
- Playback volume: exactly `0.22`.
- Playback begins only after the first eligible `pointerdown` or non-modifier `keydown` interaction.
- Stored muted preference suppresses automatic playback until explicit control activation.
- Track loops; hidden documents pause; visible documents resume only when previously playing and not muted.
- Control labels are exactly `Mute background music`, `Play background music`, and `Background music unavailable`.
- No playlist, slider, waveform, track title, visualizer, new icon package, or global state library.
- Keep the existing locked dark theme, acid-yellow accent, radius system, focus treatment, and reduced-motion behavior.

---

### Task 1: Build and verify the audio state controller

**Files:**
- Copy: `C:\Users\Admin\Downloads\Title_Arcana_Ver2.mp3` to `public/audio/title-arcana-ver2.mp3`
- Create: `src/components/BackgroundMusic.tsx`
- Create: `src/components/BackgroundMusic.test.tsx`

**Interfaces:**
- Consumes: native `document.visibilityState`, `localStorage`, `HTMLMediaElement.play`, `HTMLMediaElement.pause`.
- Produces: `export function BackgroundMusic(): JSX.Element` and a native button with state-specific accessible labels.
- Storage key: `franky-portfolio:background-music-muted` with string values `true` or `false`.

- [ ] **Step 1: Copy the approved MP3 into the public asset tree**

Run in PowerShell:

```powershell
New-Item -ItemType Directory -Path public\audio -Force
Copy-Item -LiteralPath 'C:\Users\Admin\Downloads\Title_Arcana_Ver2.mp3' -Destination 'public\audio\title-arcana-ver2.mp3'
```

Verify:

```powershell
Get-Item public\audio\title-arcana-ver2.mp3 | Select-Object FullName,Length
```

Expected: file exists and length is `4195293` bytes.

- [ ] **Step 2: Write failing tests for idle startup and first interaction**

Create `src/components/BackgroundMusic.test.tsx` with media spies installed before each test:

```tsx
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BackgroundMusic } from './BackgroundMusic'

const play = vi.fn<() => Promise<void>>()
const pause = vi.fn()

beforeEach(() => {
  localStorage.clear()
  play.mockReset().mockResolvedValue(undefined)
  pause.mockReset()
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play)
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pause)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('BackgroundMusic', () => {
  it('waits for the first eligible page interaction before playing', async () => {
    render(<BackgroundMusic />)
    expect(play).not.toHaveBeenCalled()

    fireEvent.pointerDown(document.body)
    await act(async () => undefined)

    expect(play).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Mute background music' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('ignores modifier-only key interactions', () => {
    render(<BackgroundMusic />)
    fireEvent.keyDown(document, { key: 'Shift' })
    expect(play).not.toHaveBeenCalled()

    fireEvent.keyDown(document, { key: 'a' })
    expect(play).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```bash
npm test -- src/components/BackgroundMusic.test.tsx
```

Expected: FAIL because `BackgroundMusic.tsx` does not exist.

- [ ] **Step 4: Add failing tests for mute persistence and explicit resume**

Append inside the same `describe` block:

```tsx
it('persists mute and resumes only after explicit activation', async () => {
  const user = userEvent.setup()
  render(<BackgroundMusic />)

  fireEvent.pointerDown(document.body)
  await screen.findByRole('button', { name: 'Mute background music' })
  await user.click(screen.getByRole('button', { name: 'Mute background music' }))

  expect(pause).toHaveBeenCalled()
  expect(localStorage.getItem('franky-portfolio:background-music-muted')).toBe('true')

  await user.click(screen.getByRole('button', { name: 'Play background music' }))
  expect(play).toHaveBeenCalledTimes(2)
  expect(localStorage.getItem('franky-portfolio:background-music-muted')).toBe('false')
})

it('honors a stored muted preference on first page interaction', () => {
  localStorage.setItem('franky-portfolio:background-music-muted', 'true')
  render(<BackgroundMusic />)

  fireEvent.pointerDown(document.body)

  expect(play).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
})
```

- [ ] **Step 5: Add failing tests for visibility and failures**

Append:

```tsx
it('pauses while hidden and resumes when visible if still enabled', async () => {
  let visibilityState: DocumentVisibilityState = 'visible'
  vi.spyOn(document, 'visibilityState', 'get').mockImplementation(() => visibilityState)
  render(<BackgroundMusic />)
  fireEvent.pointerDown(document.body)
  await screen.findByRole('button', { name: 'Mute background music' })

  visibilityState = 'hidden'
  fireEvent(document, new Event('visibilitychange'))
  expect(pause).toHaveBeenCalled()

  visibilityState = 'visible'
  fireEvent(document, new Event('visibilitychange'))
  await act(async () => undefined)
  expect(play).toHaveBeenCalledTimes(2)
})

it('disables the control after a media error', () => {
  const { container } = render(<BackgroundMusic />)
  fireEvent.error(container.querySelector('audio')!)
  expect(screen.getByRole('button', { name: 'Background music unavailable' })).toBeDisabled()
})

it('keeps an explicit retry available after a rejected play promise', async () => {
  play.mockRejectedValueOnce(new DOMException('Not allowed', 'NotAllowedError')).mockResolvedValueOnce(undefined)
  const user = userEvent.setup()
  render(<BackgroundMusic />)

  fireEvent.pointerDown(document.body)
  await act(async () => undefined)
  expect(screen.getByRole('button', { name: 'Play background music' })).toBeEnabled()

  await user.click(screen.getByRole('button', { name: 'Play background music' }))
  expect(play).toHaveBeenCalledTimes(2)
})
```

- [ ] **Step 6: Implement the minimal controller**

Create `src/components/BackgroundMusic.tsx` with these exact state and event boundaries:

```tsx
import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'franky-portfolio:background-music-muted'
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'Tab'])

type PlaybackState = 'idle' | 'playing' | 'muted' | 'unavailable'

function storedMuted() {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const attemptedAutoPlayRef = useRef(false)
  const resumeAfterVisibilityRef = useRef(false)
  const [state, setState] = useState<PlaybackState>(() => storedMuted() ? 'muted' : 'idle')

  const start = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || state === 'unavailable') return
    audio.volume = 0.22
    try {
      await audio.play()
      localStorage.setItem(STORAGE_KEY, 'false')
      setState('playing')
    } catch {
      setState((current) => current === 'muted' ? 'muted' : 'idle')
    }
  }, [state])

  const mute = useCallback(() => {
    audioRef.current?.pause()
    resumeAfterVisibilityRef.current = false
    localStorage.setItem(STORAGE_KEY, 'true')
    setState('muted')
  }, [])

  useEffect(() => {
    if (state !== 'idle') return
    const begin = (event: PointerEvent | KeyboardEvent) => {
      if (buttonRef.current?.contains(event.target as Node)) return
      if (event instanceof KeyboardEvent && MODIFIER_KEYS.has(event.key)) return
      if (attemptedAutoPlayRef.current) return
      attemptedAutoPlayRef.current = true
      document.removeEventListener('pointerdown', begin)
      document.removeEventListener('keydown', begin)
      void start()
    }
    document.addEventListener('pointerdown', begin)
    document.addEventListener('keydown', begin)
    return () => {
      document.removeEventListener('pointerdown', begin)
      document.removeEventListener('keydown', begin)
    }
  }, [start, state])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && state === 'playing') {
        resumeAfterVisibilityRef.current = true
        audioRef.current?.pause()
      } else if (document.visibilityState === 'visible' && resumeAfterVisibilityRef.current && state === 'playing') {
        resumeAfterVisibilityRef.current = false
        void start()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [start, state])

  const unavailable = state === 'unavailable'
  const playing = state === 'playing'
  const label = unavailable
    ? 'Background music unavailable'
    : playing
      ? 'Mute background music'
      : 'Play background music'

  return (
    <div className={`music-control ${playing ? 'is-playing' : ''}`}>
      <audio
        ref={audioRef}
        src="/audio/title-arcana-ver2.mp3"
        preload="metadata"
        loop
        onError={() => setState('unavailable')}
      />
      <button
        ref={buttonRef}
        className="music-control-button"
        type="button"
        aria-label={label}
        aria-pressed={unavailable ? undefined : playing}
        disabled={unavailable}
        onClick={() => playing ? mute() : void start()}
      >
        <span aria-hidden="true">♪</span>
      </button>
    </div>
  )
}
```

- [ ] **Step 7: Run focused tests and verify GREEN**

Run:

```bash
npm test -- src/components/BackgroundMusic.test.tsx
```

Expected: all background-music tests PASS with no unhandled promise rejection.

- [ ] **Step 8: Commit the controller behavior**

```bash
git add public/audio/title-arcana-ver2.mp3 src/components/BackgroundMusic.tsx src/components/BackgroundMusic.test.tsx
git commit -m "feat: add accessible background music controller"
```

---

### Task 2: Integrate, style, and verify the music control

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles.css`
- Modify: `README.md`

**Interfaces:**
- Consumes: `BackgroundMusic` from `src/components/BackgroundMusic.tsx`.
- Produces: one globally mounted fixed audio control and documented audio replacement path.

- [ ] **Step 1: Write a failing App integration test**

Append to the `portfolio shell` suite in `src/App.test.tsx`:

```tsx
it('mounts one accessible background music control', () => {
  const { container } = render(<App />)

  expect(screen.getByRole('button', { name: 'Play background music' })).toBeInTheDocument()
  expect(container.querySelectorAll('audio[src="/audio/title-arcana-ver2.mp3"]')).toHaveLength(1)
})
```

Extend the existing `afterEach` to remove `franky-portfolio:background-music-muted` from localStorage so tests are isolated.

- [ ] **Step 2: Run the App test and verify RED**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: FAIL because `App` does not mount the controller.

- [ ] **Step 3: Mount the controller exactly once**

Modify `src/App.tsx`:

```tsx
import { BackgroundMusic } from './components/BackgroundMusic'
```

Render it after `SiteNav` and before `main`:

```tsx
<SiteNav />
<BackgroundMusic />
<main>...</main>
```

- [ ] **Step 4: Add the fixed secondary-control styling**

Append a focused block to `src/styles.css` using existing tokens:

```css
.music-control {
  position: fixed;
  right: clamp(18px, 2.5vw, 36px);
  bottom: max(18px, env(safe-area-inset-bottom));
  z-index: 18;
}

.music-control audio {
  display: none;
}

.music-control-button {
  display: grid;
  width: 52px;
  height: 52px;
  padding: 0;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  background: rgb(18 22 23 / 92%);
  box-shadow: 0 16px 46px rgb(5 12 13 / 34%);
  color: var(--muted);
  font: inherit;
  font-size: 1.1rem;
  cursor: pointer;
  backdrop-filter: blur(14px);
  transition: color 160ms ease, background-color 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.music-control.is-playing .music-control-button {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--surface);
}

.music-control-button:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.music-control.is-playing .music-control-button:hover:not(:disabled) {
  color: var(--surface);
}

.music-control-button:active:not(:disabled) {
  transform: translateY(1px) scale(0.96);
}

.music-control-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

@media (max-width: 767px) {
  .music-control {
    right: 16px;
    bottom: max(16px, env(safe-area-inset-bottom));
  }

  .music-control-button {
    width: 46px;
    height: 46px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .music-control-button {
    transition: none;
  }

  .music-control-button:hover:not(:disabled),
  .music-control-button:active:not(:disabled) {
    transform: none;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .music-control-button {
    background: var(--surface-raised);
    backdrop-filter: none;
  }
}
```

Reuse the existing global `button:focus-visible` rule; do not create a competing outline.

- [ ] **Step 5: Document the audio asset contract**

Add a `Background audio` section to `README.md`:

```markdown
## Background audio

The optional looping soundtrack lives at `public/audio/title-arcana-ver2.mp3` and is controlled by `src/components/BackgroundMusic.tsx`. It starts only after user interaction, uses 22% volume, remembers a muted preference, and pauses while the page is hidden.

Replace the MP3 at the same public path to change the soundtrack, then rerun `npm test` and `npm run build`.
```

- [ ] **Step 6: Run focused and full automated verification**

Run:

```bash
npm test -- src/components/BackgroundMusic.test.tsx src/App.test.tsx
npm test
npm run build
git diff --check
```

Expected: all tests pass, production build exits 0, and no whitespace errors appear.

- [ ] **Step 7: Run browser and Taste QA**

Start the local site and verify at `1440x900` and `390x844`:

- exactly one musical-note control is visible;
- control does not overlap navigation, hero CTA, project links, or contact form fields;
- first page interaction begins the track once;
- button toggles between `Mute background music` and `Play background music`;
- muted preference survives reload;
- hidden/visible transitions pause and conditionally resume;
- control is keyboard reachable with the existing acid-yellow focus ring;
- playing, muted, hover, active, disabled, reduced-motion, and reduced-transparency states remain readable;
- no console errors or unhandled play-promise rejection occurs.

- [ ] **Step 8: Commit integration and documentation**

```bash
git add src/App.tsx src/App.test.tsx src/styles.css README.md
git commit -m "feat: integrate cinematic soundtrack control"
```

## Completion Evidence

- Focused and full Vitest counts with zero failures.
- Production build exit code and generated MP3 asset confirmation.
- Desktop and mobile control placement observations.
- First-interaction, mute persistence, visibility, reduced-motion, keyboard, and failure-state observations.
- Confirmation that replacing the soundtrack only requires changing `public/audio/title-arcana-ver2.mp3`.
