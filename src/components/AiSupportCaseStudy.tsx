import { motion, useReducedMotion } from 'framer-motion'
import { ArchitectureExplorer } from './ArchitectureExplorer'

const stack = ['Next.js', 'TypeScript', 'Python', 'FastAPI', 'OpenAI API', 'SQLite']

export function AiSupportCaseStudy() {
  const reducedMotion = Boolean(useReducedMotion())
  const reveal = reducedMotion
    ? undefined
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 } }

  return (
    <main className="case-study">
      <nav className="case-nav" aria-label="Case study navigation">
        <a href="/">Home</a>
        <a href="https://github.com/firzenfu/ai-support-assistant" target="_blank" rel="noreferrer">
          View repository
        </a>
      </nav>

      <header className="case-hero">
        <motion.div className="case-hero-copy" initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <p className="case-kicker">AI Support Assistant</p>
          <h1>Resolve IT issues faster.</h1>
          <p className="case-lede">A conversational help desk that troubleshoots everyday IT problems and turns unresolved issues into trackable support tickets.</p>
          <a className="button button-primary" href="https://ai-support-assistant-demo.vercel.app" target="_blank" rel="noreferrer">
            Try live demo
          </a>
        </motion.div>

        <motion.figure className="case-hero-media" initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <img src="/images/ai-support-assistant.png" alt="AI Support Assistant conversation and ticket interface" />
        </motion.figure>
      </header>

      <motion.section className="case-overview" {...reveal}>
        <div>
          <h2>From symptom to resolution.</h2>
          <p>The interface keeps the support conversation focused while preserving tickets in a dedicated queue. Users can start with a common issue or describe their own problem.</p>
        </div>
        <dl className="case-facts">
          <div><dt>Role</dt><dd>Full-stack development</dd></div>
          <div><dt>Focus</dt><dd>AI workflow and support UX</dd></div>
          <div><dt>Year</dt><dd>2026</dd></div>
        </dl>
      </motion.section>

      <motion.section className="case-story" {...reveal}>
        <article>
          <h2>The problem</h2>
          <p>IT support requests often arrive without enough context. The technician repeats discovery questions, the user loses track of attempted fixes, and unresolved work becomes difficult to follow.</p>
        </article>
        <article>
          <h2>The response</h2>
          <p>The assistant guides the conversation through practical troubleshooting, keeps earlier messages visible, and creates support tickets when a human follow-up is the right next step.</p>
        </article>
      </motion.section>

      <ArchitectureExplorer />

      <motion.section className="case-build" {...reveal}>
        <div className="case-build-heading">
          <h2>Built across the full stack.</h2>
          <p>A Next.js interface talks to a Python API. OpenAI powers the support reasoning, while SQLite keeps ticket data lightweight and local.</p>
        </div>
        <ul className="case-stack" aria-label="Technology stack">
          {stack.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </motion.section>

      <footer className="case-footer">
        <a href="/">Back to selected work</a>
        <a href="https://ai-support-assistant-demo.vercel.app" target="_blank" rel="noreferrer">Open live demo</a>
      </footer>
    </main>
  )
}
