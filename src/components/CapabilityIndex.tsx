import { motion, useReducedMotion } from 'framer-motion'
import { capabilities } from '../data/portfolio'

export function CapabilityIndex() {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section className="content-section capability-section" id="skills">
      <div className="section-shell">
        <div className="section-heading-stack">
          <h2>Multiple modes, one practice.</h2>
          <p>Engineering depth, product judgment, and communication applied as one connected workflow.</p>
        </div>
        <div className="capability-index">
          {capabilities.map((capability, index) => (
            <motion.article
              className="capability-entry"
              key={capability.shortLabel}
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: reducedMotion ? 0 : index * 0.05 }}
            >
              <span className="capability-code" aria-hidden="true">{capability.shortLabel}</span>
              <div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ul aria-label={`${capability.title} tools`}>
                  {capability.tools.map((tool) => <li key={tool}>{tool}</li>)}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
