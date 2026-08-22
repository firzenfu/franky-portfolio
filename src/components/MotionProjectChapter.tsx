import { useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { monicaEverettProject, type MotionProject } from '../data/motionProjects'

const FOREGROUND_AUDIO_EVENT = 'franky-portfolio:foreground-audio'

function formatTime(seconds: number) {
  return `00:${Math.floor(seconds).toString().padStart(2, '0')}`
}

export type MotionProjectChapterProps = {
  project?: MotionProject
}

export function MotionProjectChapter({ project = monicaEverettProject }: MotionProjectChapterProps) {
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

  const durationLabel = formatTime(project.duration)
  const headingId = `${project.id}-title`

  return (
    <article
      className="motion-project"
      id={project.id}
      aria-labelledby={headingId}
      style={{ '--motion-project-poster': `url("${project.poster}")` } as CSSProperties}
    >
      <div className="motion-project-shell">
        <motion.div
          className="motion-project-copy"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="motion-project-kicker">{project.kicker}</p>
          <h3 id={headingId}>{project.title}</h3>
          <p className="project-subtitle">{project.subtitle}</p>
          <dl className="project-narrative">
            <div>
              <dt>Brief</dt>
              <dd>{project.brief}</dd>
            </div>
            <div>
              <dt>Craft</dt>
              <dd>{project.craft}</dd>
            </div>
          </dl>
          <div className="project-meta">
            <ul className="project-stack" aria-label={`${project.title} creative disciplines`}>
              {project.disciplines.map((discipline) => <li key={discipline}>{discipline}</li>)}
            </ul>
            <span className="project-year">{project.year}</span>
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
              src={project.video}
              poster={project.poster}
              preload="metadata"
              autoPlay={!reducedMotion}
              muted
              loop
              playsInline
              title={project.videoTitle}
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
            <img src={project.poster} alt={project.posterAlt} />
          )}
          <div className="motion-project-vignette" aria-hidden="true" />
          <figcaption className="motion-project-controls">
            <div className="motion-project-control-row">
              <button
                type="button"
                disabled={mediaFailed}
                aria-label={playing ? `Pause ${project.title} film` : `Play ${project.title} film`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={togglePlayback}
              >
                {playing ? 'Pause film' : 'Play film'}
              </button>
              <button
                type="button"
                disabled={mediaFailed}
                aria-label={muted ? `Turn ${project.title} film sound on` : `Mute ${project.title} film`}
                aria-pressed={!muted}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={toggleSound}
              >
                {muted ? 'Hear film' : 'Mute film'}
              </button>
              <span aria-live="off">{formatTime(currentTime)} / {durationLabel}</span>
            </div>
            <label className="motion-project-timeline">
              <span className="sr-only">Film progress</span>
              <input
                type="range"
                min="0"
                max={project.duration}
                step="0.01"
                value={Math.min(currentTime, project.duration)}
                disabled={mediaFailed}
                aria-label="Film progress"
                onPointerDown={(event) => event.stopPropagation()}
                onChange={(event) => seek(Number(event.currentTarget.value))}
                style={{ '--film-progress': `${Math.min(currentTime / project.duration, 1) * 100}%` } as CSSProperties}
              />
            </label>
          </figcaption>
        </motion.figure>
      </div>
    </article>
  )
}
