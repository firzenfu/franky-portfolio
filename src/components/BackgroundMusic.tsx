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
