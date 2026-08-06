import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { sceneMedia } from '../data/media'
import { SceneVideo } from './SceneVideo'

const heroReveal: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

export function HeroScene() {
  const reduced = Boolean(useReducedMotion())
  const hero = sceneMedia.hero

  return (
    <section className="hero-scene" id="top">
      <SceneVideo
        className="hero-media"
        src={hero.video}
        mobileSrc={hero.mobileVideo}
        poster={hero.poster}
        priority
      />
      <motion.div
        className="hero-copy"
        variants={heroReveal}
        initial={reduced ? false : 'hidden'}
        animate="visible"
      >
        <p className="hero-kicker">Franky Fu, software developer</p>
        <h1 aria-label="Software with a point of view.">
          <span aria-hidden="true">Software with a point</span>
          <span aria-hidden="true">of view.</span>
        </h1>
        <p className="hero-summary">I build full-stack products with clear systems, considered interfaces, and practical AI workflows.</p>
        <a className="button button-primary" href="#work">View work</a>
      </motion.div>
    </section>
  )
}
