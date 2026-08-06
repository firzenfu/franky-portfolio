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
})
