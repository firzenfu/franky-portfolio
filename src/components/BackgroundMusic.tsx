import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'franky-portfolio:background-music-muted'
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta'])
const CONTROL_CLICK_PAIR_TIMEOUT_MS = 1000

type PlaybackState = 'idle' | 'playing' | 'muted' | 'unavailable'

function storedMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function persistMuted(muted: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(muted))
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const activeAudioRef = useRef<HTMLAudioElement>(null)
  const attemptedAutoPlayRef = useRef(false)
  const mountedRef = useRef(false)
  const operationRef = useRef(0)
  const activePlayOperationRef = useRef<number | null>(null)
  const pendingPlayRef = useRef(false)
  const pairedControlClickCleanupRef = useRef<(() => void) | null>(null)
  const resumeAfterVisibilityRef = useRef(false)
  const stateRef = useRef<PlaybackState>(storedMuted() ? 'muted' : 'idle')
  const [state, setState] = useState<PlaybackState>(stateRef.current)

  const setPlaybackState = useCallback((next: PlaybackState) => {
    stateRef.current = next
    setState(next)
  }, [])

  const clearPairedControlClick = useCallback(() => {
    const cleanup = pairedControlClickCleanupRef.current
    pairedControlClickCleanupRef.current = null
    cleanup?.()
  }, [])

  const pairControlClick = useCallback(() => {
    clearPairedControlClick()
    const control = buttonRef.current
    if (!control) return

    let timeout: number | undefined
    const consumeClick = (event: MouseEvent) => {
      const pairedControlClick = control.contains(event.target as Node)
      cleanup()
      if (pairedControlClick) event.stopPropagation()
    }
    const cleanup = () => {
      document.removeEventListener('click', consumeClick, true)
      if (timeout !== undefined) window.clearTimeout(timeout)
      if (pairedControlClickCleanupRef.current === cleanup) {
        pairedControlClickCleanupRef.current = null
      }
    }

    document.addEventListener('click', consumeClick, true)
    timeout = window.setTimeout(cleanup, CONTROL_CLICK_PAIR_TIMEOUT_MS)
    pairedControlClickCleanupRef.current = cleanup
  }, [clearPairedControlClick])

  const invalidatePendingPlay = useCallback(() => {
    operationRef.current += 1
    activePlayOperationRef.current = null
    pendingPlayRef.current = false
    const activeAudio = audioRef.current ?? activeAudioRef.current
    activeAudio?.pause()
  }, [])

  const requestPlayback = useCallback(() => {
    const audio = audioRef.current
    if (
      !audio ||
      !mountedRef.current ||
      document.visibilityState !== 'visible' ||
      stateRef.current === 'unavailable' ||
      pendingPlayRef.current
    ) return

    const request = ++operationRef.current
    activePlayOperationRef.current = request
    pendingPlayRef.current = true
    activeAudioRef.current = audio
    audio.volume = 0.22

    void Promise.resolve(audio.play()).then(
      () => {
        const canKeepPlaying =
          mountedRef.current &&
          request === operationRef.current &&
          stateRef.current !== 'muted' &&
          stateRef.current !== 'unavailable' &&
          document.visibilityState === 'visible'

        if (!canKeepPlaying) {
          if (activePlayOperationRef.current === request || activePlayOperationRef.current === null) {
            audio.pause()
          }
          return
        }

        pendingPlayRef.current = false
        persistMuted(false)
        setPlaybackState('playing')
      },
      () => {
        if (!mountedRef.current || request !== operationRef.current) return

        activePlayOperationRef.current = null
        pendingPlayRef.current = false
        if (stateRef.current !== 'muted' && stateRef.current !== 'unavailable') {
          setPlaybackState('idle')
        }
      },
    )
  }, [setPlaybackState])

  const activate = useCallback(() => {
    if (stateRef.current === 'unavailable') return
    if (stateRef.current === 'muted') setPlaybackState('idle')
    requestPlayback()
  }, [requestPlayback, setPlaybackState])

  const mute = useCallback(() => {
    invalidatePendingPlay()
    resumeAfterVisibilityRef.current = false
    persistMuted(true)
    setPlaybackState('muted')
  }, [invalidatePendingPlay, setPlaybackState])

  const handleMediaError = useCallback(() => {
    invalidatePendingPlay()
    resumeAfterVisibilityRef.current = false
    setPlaybackState('unavailable')
  }, [invalidatePendingPlay, setPlaybackState])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      clearPairedControlClick()
      invalidatePendingPlay()
    }
  }, [clearPairedControlClick, invalidatePendingPlay])

  useEffect(() => {
    if (state !== 'idle') return
    const begin = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && MODIFIER_KEYS.has(event.key)) return
      if (attemptedAutoPlayRef.current) return
      attemptedAutoPlayRef.current = true
      if (buttonRef.current?.contains(event.target as Node)) pairControlClick()
      document.removeEventListener('pointerdown', begin)
      document.removeEventListener('keydown', begin)
      activate()
    }
    document.addEventListener('pointerdown', begin)
    document.addEventListener('keydown', begin)
    return () => {
      document.removeEventListener('pointerdown', begin)
      document.removeEventListener('keydown', begin)
    }
  }, [activate, pairControlClick, state])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        resumeAfterVisibilityRef.current = stateRef.current === 'playing'
        invalidatePendingPlay()
      } else if (resumeAfterVisibilityRef.current && stateRef.current === 'playing') {
        resumeAfterVisibilityRef.current = false
        requestPlayback()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [invalidatePendingPlay, requestPlayback])

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
        onError={handleMediaError}
      />
      <button
        ref={buttonRef}
        className="music-control-button"
        type="button"
        aria-label={label}
        aria-pressed={unavailable ? undefined : playing}
        disabled={unavailable}
        onClick={() => playing ? mute() : activate()}
      >
        <span aria-hidden="true">♪</span>
      </button>
    </div>
  )
}
