import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useReducedMotion } from 'framer-motion'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SceneVideo } from './SceneVideo'

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return { ...actual, useReducedMotion: vi.fn(() => false) }
})

class MediaQueryListStub {
  matches = false
  readonly media = '(max-width: 767px)'
  onchange = null
  private readonly listeners = new Set<(event: MediaQueryListEvent) => void>()

  addEventListener(_type: string, listener: (event: MediaQueryListEvent) => void) {
    this.listeners.add(listener)
  }

  removeEventListener(_type: string, listener: (event: MediaQueryListEvent) => void) {
    this.listeners.delete(listener)
  }

  addListener(listener: (event: MediaQueryListEvent) => void) {
    this.listeners.add(listener)
  }

  removeListener(listener: (event: MediaQueryListEvent) => void) {
    this.listeners.delete(listener)
  }

  dispatchEvent() {
    return true
  }

  setMatches(matches: boolean) {
    this.matches = matches
    const event = { matches, media: this.media } as MediaQueryListEvent
    this.listeners.forEach((listener) => listener(event))
  }
}

describe('SceneVideo', () => {
  let mediaQuery: MediaQueryListStub

  beforeEach(() => {
    mediaQuery = new MediaQueryListStub()
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery as unknown as MediaQueryList))
  })

  afterEach(() => {
    cleanup()
    vi.mocked(useReducedMotion).mockReturnValue(false)
    vi.unstubAllGlobals()
  })

  it('renders the poster when reduced motion is requested', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)

    render(<SceneVideo src="/scene.mp4" poster="/poster.jpg" />)

    expect(screen.getByTestId('scene-poster')).toHaveAttribute('src', '/poster.jpg')
  })

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
    expect(video).toHaveProperty('playsInline', true)
  })

  it('does not preload non-priority video data', () => {
    render(<SceneVideo src="/scene.mp4" poster="/poster.jpg" />)

    expect(screen.getByTestId('scene-video')).toHaveAttribute('preload', 'none')
  })

  it('renders the mobile source for the mobile breakpoint', () => {
    render(<SceneVideo src="/scene.mp4" mobileSrc="/scene-mobile.mp4" poster="/poster.jpg" />)

    const mobileSource = screen.getByTestId('scene-video').querySelector('source[media="(max-width: 767px)"]')
    expect(mobileSource).toHaveAttribute('src', '/scene-mobile.mp4')
  })

  it('reacts to a narrow viewport by using the poster when no mobile source exists', () => {
    render(<SceneVideo src="/scene.mp4" poster="/poster.jpg" />)
    expect(screen.getByTestId('scene-video')).toBeInTheDocument()

    act(() => mediaQuery.setMatches(true))
    expect(screen.queryByTestId('scene-video')).not.toBeInTheDocument()
    expect(screen.getByTestId('scene-poster')).toHaveAttribute('src', '/poster.jpg')

    act(() => mediaQuery.setMatches(false))
    expect(screen.getByTestId('scene-video')).toBeInTheDocument()
  })

  it('allows a supplied mobile source to render video on a narrow viewport', () => {
    mediaQuery.setMatches(true)

    render(<SceneVideo src="/scene.mp4" mobileSrc="/scene-mobile.mp4" poster="/poster.jpg" />)

    expect(screen.getByTestId('scene-video')).toBeInTheDocument()
    expect(screen.getByTestId('scene-video').querySelector('source[src="/scene-mobile.mp4"]')).toBeInTheDocument()
  })
})
