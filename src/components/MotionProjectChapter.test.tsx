import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MotionProjectChapter } from './MotionProjectChapter'

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('IntersectionObserver', ObserverStub)

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('MotionProjectChapter', () => {
  it('renders the optimized film, poster, and narrative details', () => {
    const { container } = render(<MotionProjectChapter />)
    const video = container.querySelector('video')

    expect(screen.getByRole('heading', { name: 'Monica Everett' })).toBeInTheDocument()
    expect(video).toHaveAttribute('src', '/videos/monica-everett-cinematic-edit.mp4')
    expect(video).toHaveAttribute('poster', '/images/monica-everett-poster.jpg')
    expect(video).toHaveAttribute('preload', 'metadata')
    expect(video).toHaveAttribute('loop')
    expect(screen.getByRole('slider', { name: 'Film progress' })).toHaveAttribute('max', '20.06')
  })

  it('offers accessible playback, sound, and seeking controls', async () => {
    const user = userEvent.setup()
    const foregroundAudio = vi.fn()
    window.addEventListener('franky-portfolio:foreground-audio', foregroundAudio)
    const { container } = render(<MotionProjectChapter />)
    const video = container.querySelector('video') as HTMLVideoElement

    fireEvent.play(video)
    expect(screen.getByRole('button', { name: 'Pause Monica Everett film' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Turn Monica Everett film sound on' }))
    expect(foregroundAudio).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Mute Monica Everett film' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.change(screen.getByRole('slider', { name: 'Film progress' }), { target: { value: '12' } })
    expect(video.currentTime).toBe(12)
    expect(screen.getByText('00:12 / 00:20')).toBeInTheDocument()

    window.removeEventListener('franky-portfolio:foreground-audio', foregroundAudio)
  })
})
