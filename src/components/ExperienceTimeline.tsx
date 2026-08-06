import { motion, useReducedMotion } from 'framer-motion'
import { experience } from '../data/portfolio'

export function ExperienceTimeline() {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section className="content-section experience-section" aria-labelledby="experience-title">
      <div className="section-shell">
        <div className="section-heading-stack">
          <h2 id="experience-title">Experience with range.</h2>
          <p>Software development leads the story, supported by operations and quality work grounded in precision.</p>
        </div>
        <ol className="experience-timeline">
          {experience.map((entry, index) => (
            <motion.li
              className={`experience-entry experience-entry-${entry.emphasis}`}
              key={`${entry.company}-${entry.period}`}
              initial={reducedMotion ? false : { opacity: 0, x: index === 0 ? -18 : 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: reducedMotion ? 0 : index * 0.06 }}
            >
              <p className="experience-period">{entry.period}</p>
              <div>
                <h3>{entry.company}</h3>
                <p className="experience-role">{entry.role}</p>
                <p className="experience-description">{entry.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
