import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { SceneMedia } from '../data/media'
import type { Project } from '../data/portfolio'
import { useViewportMedia } from '../hooks/useViewportMedia'
import { ScenePoster, SceneVideo } from './SceneVideo'

export type ProjectChapterProps = {
  project: Project
  media: SceneMedia
  index: number
}

export function ProjectChapter({ project, media, index }: ProjectChapterProps) {
  const chapterRef = useRef<HTMLElement>(null)
  const reducedMotion = Boolean(useReducedMotion())
  const mediaActive = useViewportMedia(chapterRef, { disabled: reducedMotion })
  const [mediaFailed, setMediaFailed] = useState(false)
  const [proofFailed, setProofFailed] = useState(false)
  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [24, 0, -24])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.985, 1, 0.985])
  const headingId = `${project.slug}-title`
  const hasProof = Boolean(project.image) && !proofFailed

  return (
    <article
      ref={chapterRef}
      className="project-chapter"
      aria-labelledby={headingId}
      data-project-index={index}
    >
      {mediaActive && !mediaFailed ? (
        <SceneVideo
          className="project-atmosphere"
          src={media.video}
          mobileSrc={media.mobileVideo}
          poster={media.poster}
          onFailure={() => setMediaFailed(true)}
        />
      ) : (
        <ScenePoster
          className="project-atmosphere"
          poster={media.poster}
          testId="project-atmosphere-poster"
        />
      )}
      <motion.div
        className={`project-frame${hasProof ? '' : ' project-frame-copy-only'}`}
        style={reducedMotion ? undefined : { y, scale }}
      >
        <div className="project-copy">
          <h3 id={headingId}>{project.title}</h3>
          <p className="project-subtitle">{project.subtitle}</p>
          <dl className="project-narrative">
            <div>
              <dt>Problem</dt>
              <dd>{project.problem}</dd>
            </div>
            <div>
              <dt>Solution</dt>
              <dd>{project.solution}</dd>
            </div>
          </dl>
          <div className="project-meta">
            <ul className="project-stack" aria-label={`${project.title} technology stack`}>
              {project.stack.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <span className="project-year">{project.year}</span>
          </div>
          <a className="project-link" href={project.href} target="_blank" rel="noreferrer">
            View GitHub profile
          </a>
        </div>
        {hasProof && (
          <figure className="project-proof">
            <img
              src={project.image}
              alt={`${project.title} interface`}
              loading="lazy"
              onError={() => setProofFailed(true)}
            />
          </figure>
        )}
      </motion.div>
    </article>
  )
}
