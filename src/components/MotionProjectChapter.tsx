import { useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const FILM_DURATION = 20.06
const FOREGROUND_AUDIO_EVENT = 'franky-portfolio:foreground-audio'

function formatTime(seconds: number) {
  return `00:${Math.floor(seconds).toString().padStart(2, '0')}`
}

export function MotionProjectChapter() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = Boolean(useReducedMotion())
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [mediaFailed, setMediaFailed] = useState(false)

  function togglePlayback() {
    const video = videoRef.current
    if (!video || mediaFailed) return
    if (video.paused) {
      void video.play().catch(() => setPlaying(false))
    } else {
      video.pause()
    }
  }

  function toggleSound() {
    const video = videoRef.current
    if (!video || mediaFailed) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setMuted(nextMuted)
    if (!nextMuted) {
      window.dispatchEvent(new Event(FOREGROUND_AUDIO_EVENT))
      if (video.paused) void video.play().catch(() => setPlaying(false))
    }
  }

  function seek(nextTime: number) {
    const video = videoRef.current
    if (!video || mediaFailed) return
    video.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  return (
    <article className="motion-project" id="monica-everett" aria-labelledby="monica-everett-title">
      <div className="motion-project-shell">
        <motion.div
          className="motion-project-copy"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="motion-project-kicker">Motion direction / 00:20 / 2026</p>
          <h3 id="monica-everett-title">Monica Everett</h3>
          <p className="project-subtitle">Cinematic anime edit</p>
          <dl className="project-narrative">
            <div>
              <dt>Brief</dt>
              <dd>A compact character film that moves from quiet restraint to magical impact without losing visual continuity.</dd>
            </div>
            <div>
              <dt>Craft</dt>
              <dd>Close framing, rhythmic reveals, color-led escalation, and sound shape a complete arc in twenty seconds.</dd>
            </div>
          </dl>
          <div className="project-meta">
            <ul className="project-stack" aria-label="Monica Everett creative disciplines">
              <li>AI Direction</li>
              <li>Editing</li>
              <li>Sound Design</li>
              <li>Visual Storytelling</li>
            </ul>
            <span className="project-year">2026</span>
          </div>
        </motion.div>

        <motion.figure
          className="motion-project-stage"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {!mediaFailed ? (
            <video
              ref={videoRef}
              src="/videos/monica-everett-cinematic-edit.mp4"
              poster="/images/monica-everett-poster.jpg"
              preload="metadata"
              autoPlay={!reducedMotion}
              muted
              loop
              playsInline
              title="Monica Everett cinematic anime edit"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onError={() => {
                setMediaFailed(true)
                setPlaying(false)
              }}
            >
              Your browser does not support embedded video.
            </video>
          ) : (
            <img src="/images/monica-everett-poster.jpg" alt="Monica Everett anime character in a cinematic scene" />
          )}
          <div className="motion-project-vignette" aria-hidden="true" />
          <figcaption className="motion-project-controls">
            <div className="motion-project-control-row">
              <button
                type="button"
                disabled={mediaFailed}
                aria-label={playing ? 'Pause Monica Everett film' : 'Play Monica Everett film'}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={togglePlayback}
              >
                {playing ? 'Pause film' : 'Play film'}
              </button>
              <button
                type="button"
                disabled={mediaFailed}
                aria-label={muted ? 'Turn Monica Everett film sound on' : 'Mute Monica Everett film'}
                aria-pressed={!muted}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={toggleSound}
              >
                {muted ? 'Hear film' : 'Mute film'}
              </button>
              <span aria-live="off">{formatTime(currentTime)} / 00:20</span>
            </div>
            <label className="motion-project-timeline">
              <span className="sr-only">Film progress</span>
              <input
                type="range"
                min="0"
                max={FILM_DURATION}
                step="0.01"
                value={Math.min(currentTime, FILM_DURATION)}
                disabled={mediaFailed}
                aria-label="Film progress"
                onPointerDown={(event) => event.stopPropagation()}
                onChange={(event) => seek(Number(event.currentTarget.value))}
                style={{ '--film-progress': `${Math.min(currentTime / FILM_DURATION, 1) * 100}%` } as CSSProperties}
              />
            </label>
          </figcaption>
        </motion.figure>
      </div>
    </article>
  )
}
