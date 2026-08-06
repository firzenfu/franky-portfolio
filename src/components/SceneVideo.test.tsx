import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useReducedMotion } from 'framer-motion'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SceneVideo } from './SceneVideo'

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return { ...actual, useReducedMotion: vi.fn(() => false) }
})

describe('SceneVideo', () => {
  afterEach(() => {
    cleanup()
    vi.mocked(useReducedMotion).mockReturnValue(false)
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
})
