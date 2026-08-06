import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
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
