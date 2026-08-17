import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// @ts-expect-error The app build intentionally omits test-only Node declarations.
import { readFileSync } from 'node:fs'
import { BackgroundMusic } from './BackgroundMusic'

const styles = readFileSync('src/styles.css', 'utf8')

const play = vi.fn<() => Promise<void>>()
const pause = vi.fn()

function deferredPlay() {
  let resolve!: () => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, reject, resolve }
}

beforeEach(() => {
  localStorage.clear()
  play.mockReset().mockResolvedValue(undefined)
  pause.mockReset()
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play)
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pause)
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
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
    const audio = document.querySelector('audio')!
    expect(audio).toHaveAttribute('src', '/audio/title-arcana-ver2.mp3')
    expect(audio).toHaveAttribute('preload', 'metadata')
    expect(audio).toHaveAttribute('loop')
    expect(audio.volume).toBe(0.22)
  })

  it('ignores only modifier-only key interactions while allowing Tab', () => {
    render(<BackgroundMusic />)
    fireEvent.keyDown(document, { key: 'Shift' })
    expect(play).not.toHaveBeenCalled()

    fireEvent.keyDown(document, { key: 'Control' })
    fireEvent.keyDown(document, { key: 'Alt' })
    fireEvent.keyDown(document, { key: 'Meta' })
    expect(play).not.toHaveBeenCalled()

    fireEvent.keyDown(document, { key: 'Tab' })
    expect(play).toHaveBeenCalledTimes(1)

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

  it('keeps the unavailable control visibly readable', () => {
    const stylesheet = document.createElement('style')
    stylesheet.textContent = styles
    document.head.append(stylesheet)
    const { container } = render(<BackgroundMusic />)
    fireEvent.error(container.querySelector('audio')!)

    const control = screen.getByRole('button', { name: 'Background music unavailable' })
    expect(Number.parseFloat(getComputedStyle(control).opacity)).toBeGreaterThanOrEqual(0.55)
    stylesheet.remove()
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

  it('invalidates an initial play that resolves after the page hides', async () => {
    let visibilityState: DocumentVisibilityState = 'visible'
    vi.spyOn(document, 'visibilityState', 'get').mockImplementation(() => visibilityState)
    const pending = deferredPlay()
    play.mockImplementationOnce(() => pending.promise)
    render(<BackgroundMusic />)

    fireEvent.pointerDown(document.body)
    expect(play).toHaveBeenCalledTimes(1)

    visibilityState = 'hidden'
    fireEvent(document, new Event('visibilitychange'))
    pending.resolve()
    await act(async () => undefined)

    expect(pause).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('keeps mute state when a visibility resume resolves after explicit muting', async () => {
    let visibilityState: DocumentVisibilityState = 'visible'
    vi.spyOn(document, 'visibilityState', 'get').mockImplementation(() => visibilityState)
    const resumedPlay = deferredPlay()
    play.mockResolvedValueOnce(undefined).mockImplementationOnce(() => resumedPlay.promise)
    const user = userEvent.setup()
    render(<BackgroundMusic />)

    fireEvent.pointerDown(document.body)
    await screen.findByRole('button', { name: 'Mute background music' })
    visibilityState = 'hidden'
    fireEvent(document, new Event('visibilitychange'))
    visibilityState = 'visible'
    fireEvent(document, new Event('visibilitychange'))
    expect(play).toHaveBeenCalledTimes(2)

    await user.click(screen.getByRole('button', { name: 'Mute background music' }))
    resumedPlay.resolve()
    await act(async () => undefined)

    expect(screen.getByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
    expect(localStorage.getItem('franky-portfolio:background-music-muted')).toBe('true')
  })

  it('keeps the controller unavailable when media errors during pending playback', async () => {
    const pending = deferredPlay()
    play.mockImplementationOnce(() => pending.promise)
    const { container } = render(<BackgroundMusic />)

    fireEvent.pointerDown(document.body)
    fireEvent.error(container.querySelector('audio')!)
    pending.resolve()
    await act(async () => undefined)

    expect(screen.getByRole('button', { name: 'Background music unavailable' })).toBeDisabled()
    expect(pause).toHaveBeenCalled()
  })

  it('deduplicates rapid page gestures and control activation while playback is pending', async () => {
    const pending = deferredPlay()
    play.mockImplementationOnce(() => pending.promise)
    render(<BackgroundMusic />)

    fireEvent.pointerDown(document.body)
    fireEvent.keyDown(document, { key: 'a' })
    fireEvent.click(screen.getByRole('button', { name: 'Play background music' }))
    expect(play).toHaveBeenCalledTimes(1)

    pending.resolve()
    await act(async () => undefined)
    expect(screen.getByRole('button', { name: 'Mute background music' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('deduplicates a control pointerdown followed by its click', async () => {
    const pending = deferredPlay()
    play.mockImplementationOnce(() => pending.promise)
    render(<BackgroundMusic />)
    const control = screen.getByRole('button', { name: 'Play background music' })

    fireEvent.pointerDown(control)
    fireEvent.click(control)
    expect(play).toHaveBeenCalledTimes(1)

    pending.resolve()
    await act(async () => undefined)
    expect(screen.getByRole('button', { name: 'Mute background music' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('consumes the paired control click after its pointerdown playback has settled', async () => {
    const pending = deferredPlay()
    play.mockImplementationOnce(() => pending.promise)
    render(<BackgroundMusic />)
    const control = screen.getByRole('button', { name: 'Play background music' })

    fireEvent.pointerDown(control)
    pending.resolve()
    await act(async () => undefined)
    expect(screen.getByRole('button', { name: 'Mute background music' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(control)
    expect(play).toHaveBeenCalledTimes(1)
    expect(pause).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Mute background music' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(control)
    expect(pause).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('consumes the paired click after a pointer is held longer than the cleanup window', async () => {
    vi.useFakeTimers()
    render(<BackgroundMusic />)
    const control = screen.getByRole('button', { name: 'Play background music' })

    fireEvent.pointerDown(control, { button: 0, pointerId: 7 })
    await act(async () => undefined)
    await act(async () => vi.advanceTimersByTime(1500))
    fireEvent.pointerUp(control, { button: 0, pointerId: 7 })
    fireEvent.click(control)

    expect(play).toHaveBeenCalledTimes(1)
    expect(pause).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Mute background music' })).toHaveAttribute('aria-pressed', 'true')
  })

  it.each(['Tab', 'a'])('does not suppress a later control click after %s starts playback', async (key) => {
    const pending = deferredPlay()
    play.mockImplementationOnce(() => pending.promise)
    render(<BackgroundMusic />)
    const control = screen.getByRole('button', { name: 'Play background music' })

    fireEvent.keyDown(control, { key })
    pending.resolve()
    await act(async () => undefined)
    expect(screen.getByRole('button', { name: 'Mute background music' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(control)
    expect(pause).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
  })

  it.each([
    ['Enter', 'Enter'],
    ['Space', ' '],
  ])('consumes the paired %s control click after playback has settled', async (_name, key) => {
    const pending = deferredPlay()
    play.mockImplementationOnce(() => pending.promise)
    render(<BackgroundMusic />)
    const control = screen.getByRole('button', { name: 'Play background music' })

    fireEvent.keyDown(control, { key })
    pending.resolve()
    await act(async () => undefined)
    expect(screen.getByRole('button', { name: 'Mute background music' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(control)
    expect(play).toHaveBeenCalledTimes(1)
    expect(pause).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Mute background music' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(control)
    expect(pause).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('consumes the paired click after Space is held longer than the cleanup window', async () => {
    vi.useFakeTimers()
    render(<BackgroundMusic />)
    const control = screen.getByRole('button', { name: 'Play background music' })

    fireEvent.keyDown(control, { key: ' ' })
    await act(async () => undefined)
    await act(async () => vi.advanceTimersByTime(1500))
    fireEvent.keyUp(control, { key: ' ' })
    fireEvent.click(control)

    expect(play).toHaveBeenCalledTimes(1)
    expect(pause).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Mute background music' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('clears pointer click pairing when the activation is cancelled', async () => {
    render(<BackgroundMusic />)
    const control = screen.getByRole('button', { name: 'Play background music' })

    fireEvent.pointerDown(control, { button: 0, pointerId: 7 })
    await act(async () => undefined)
    fireEvent.pointerCancel(control, { pointerId: 7 })
    fireEvent.click(control)

    expect(pause).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('clears keyboard click pairing when the control loses focus', async () => {
    render(<BackgroundMusic />)
    const control = screen.getByRole('button', { name: 'Play background music' })

    control.focus()
    fireEvent.keyDown(control, { key: ' ' })
    await act(async () => undefined)
    fireEvent.blur(control)
    fireEvent.click(control)

    expect(pause).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('cleans a control click pairing when no paired click occurs', async () => {
    vi.useFakeTimers()
    const pending = deferredPlay()
    play.mockImplementationOnce(() => pending.promise)
    render(<BackgroundMusic />)
    const control = screen.getByRole('button', { name: 'Play background music' })

    fireEvent.pointerDown(control)
    pending.resolve()
    await act(async () => undefined)
    fireEvent.pointerUp(control)
    await act(async () => vi.advanceTimersByTime(1000))

    fireEvent.click(control)
    expect(pause).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('cleans the paired control click listener and timeout on unmount', () => {
    vi.useFakeTimers()
    const clearTimeout = vi.spyOn(window, 'clearTimeout')
    const removeListener = vi.spyOn(document, 'removeEventListener')
    const { unmount } = render(<BackgroundMusic />)

    const control = screen.getByRole('button', { name: 'Play background music' })
    fireEvent.pointerDown(control)
    fireEvent.pointerUp(control)
    unmount()

    expect(clearTimeout).toHaveBeenCalled()
    expect(removeListener.mock.calls.filter(([type]) => type === 'click').length).toBeGreaterThanOrEqual(1)
  })

  it('defaults to unmuted when local storage cannot be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable')
    })
    render(<BackgroundMusic />)

    fireEvent.pointerDown(document.body)
    expect(play).toHaveBeenCalledTimes(1)
  })

  it('does not start playback for a modified keyboard shortcut', () => {
    render(<BackgroundMusic />)

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })

    expect(play).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('keeps successful playback and mute state when local storage cannot be written', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable')
    })
    const user = userEvent.setup()
    render(<BackgroundMusic />)

    fireEvent.pointerDown(document.body)
    await screen.findByRole('button', { name: 'Mute background music' })
    expect(screen.getByRole('button', { name: 'Mute background music' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Mute background music' }))
    expect(screen.getByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('invalidates pending playback and removes document listeners on unmount', async () => {
    const pending = deferredPlay()
    play.mockImplementationOnce(() => pending.promise)
    const removeListener = vi.spyOn(document, 'removeEventListener')
    const { unmount } = render(<BackgroundMusic />)

    fireEvent.pointerDown(document.body)
    unmount()
    pending.resolve()
    await act(async () => undefined)

    expect(pause).toHaveBeenCalled()
    expect(removeListener.mock.calls.filter(([type]) => type === 'pointerdown').length).toBeGreaterThanOrEqual(1)
    expect(removeListener.mock.calls.filter(([type]) => type === 'keydown').length).toBeGreaterThanOrEqual(1)
    expect(removeListener.mock.calls.filter(([type]) => type === 'visibilitychange').length).toBeGreaterThanOrEqual(1)
  })

  it('yields to foreground media with sound', async () => {
    render(<BackgroundMusic />)
    fireEvent.pointerDown(document.body)
    await screen.findByRole('button', { name: 'Mute background music' })

    window.dispatchEvent(new Event('franky-portfolio:foreground-audio'))

    expect(pause).toHaveBeenCalled()
    expect(await screen.findByRole('button', { name: 'Play background music' })).toHaveAttribute('aria-pressed', 'false')
  })
})
