import { motion, useReducedMotion } from 'framer-motion'

export function AboutStatement() {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section className="content-section about-statement" id="about">
      <motion.div
        className="section-shell about-layout"
        initial={reducedMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="about-copy">
          <h2>Developer by training. Designer in spirit.</h2>
          <div className="about-paragraphs">
            <p>I build full-stack products with clear systems, considered interfaces, and practical AI workflows.</p>
            <p>I care about the path from a rough problem to software that feels focused, useful, and ready for real people.</p>
          </div>
          <dl className="fact-list">
            <div>
              <dt>Education</dt>
              <dd>NAIT Software Development</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>Edmonton, Alberta</dd>
            </div>
          </dl>
        </div>
        <figure className="about-portrait">
          <img src="/images/franky-avatar.jpg" alt="Portrait of Franky Fu" loading="lazy" />
        </figure>
      </motion.div>
    </section>
  )
}
