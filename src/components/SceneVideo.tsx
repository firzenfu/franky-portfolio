import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { selectMediaMode } from '../lib/media'

export type SceneVideoProps = {
  src: string
  mobileSrc?: string
  poster: string
  priority?: boolean
  className?: string
}

type ScenePosterProps = {
  poster: string
  className?: string
  testId?: string
}

export function ScenePoster({ poster, className = '', testId = 'scene-poster' }: ScenePosterProps) {
  return (
    <div className={`scene-media ${className}`}>
      <img data-testid={testId} src={poster} alt="" aria-hidden="true" />
      <span className="scene-scrim" aria-hidden="true" />
    </div>
  )
}

export function SceneVideo({ src, mobileSrc, poster, priority = false, className = '' }: SceneVideoProps) {
  const reducedMotion = Boolean(useReducedMotion())
  const [failed, setFailed] = useState(false)
  const mode = selectMediaMode({ reducedMotion, failed })

  if (mode === 'poster') {
    return <ScenePoster className={className} poster={poster} />
  }

  return (
    <div className={`scene-media ${className}`}>
      <video
        data-testid="scene-video"
        aria-hidden="true"
        tabIndex={-1}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        preload={priority ? 'auto' : 'none'}
        onError={() => setFailed(true)}
      >
        {mobileSrc && <source src={mobileSrc} media="(max-width: 767px)" type="video/mp4" />}
        <source src={src} type="video/mp4" />
      </video>
      <span className="scene-scrim" aria-hidden="true" />
    </div>
  )
}
