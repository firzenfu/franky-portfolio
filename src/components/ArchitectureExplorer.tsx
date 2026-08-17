import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

const layers = [
  {
    id: 'interface',
    label: 'Interface',
    technology: 'Next.js',
    purpose: 'Keeps the support conversation readable and collects the user context needed for the next action.',
    data: 'Issue description, conversation history, and ticket intent.',
  },
  {
    id: 'api',
    label: 'Workflow API',
    technology: 'FastAPI',
    purpose: 'Validates requests and coordinates the troubleshooting and ticket workflows.',
    data: 'Structured messages, workflow state, and validated ticket fields.',
  },
  {
    id: 'reasoning',
    label: 'Reasoning',
    technology: 'OpenAI API',
    purpose: 'Uses the current context to suggest a focused diagnostic action instead of a generic answer.',
    data: 'The active issue, previous checks, and the next support objective.',
  },
  {
    id: 'records',
    label: 'Ticket records',
    technology: 'SQLite',
    purpose: 'Stores unresolved requests so a technician can continue without repeating discovery questions.',
    data: 'Contact details, issue summary, attempted fixes, and ticket status.',
  },
] as const

export function ArchitectureExplorer() {
  const reducedMotion = Boolean(useReducedMotion())
  const [activeId, setActiveId] = useState<(typeof layers)[number]['id']>('interface')
  const activeLayer = layers.find((layer) => layer.id === activeId) ?? layers[0]

  return (
    <section className="case-architecture" aria-labelledby="architecture-title">
      <div className="case-architecture-heading">
        <h2 id="architecture-title">Follow one request.</h2>
        <p>Select a layer to see how context moves from the interface to a useful support outcome.</p>
      </div>
      <div className="architecture-layout">
        <div className="architecture-map" aria-label="AI Support system architecture">
          {layers.map((layer, index) => (
            <button
              key={layer.id}
              type="button"
              className={layer.id === activeId ? 'is-selected' : ''}
              aria-label={`${layer.label}, ${layer.technology}`}
              aria-pressed={layer.id === activeId}
              onClick={() => setActiveId(layer.id)}
            >
              <span>{layer.label}</span>
              <strong>{layer.technology}</strong>
              {index < layers.length - 1 && <i aria-hidden="true" />}
            </button>
          ))}
        </div>
        <motion.div
          key={activeLayer.id}
          className="architecture-detail"
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          aria-live="polite"
        >
          <p>{activeLayer.label}</p>
          <h3>{activeLayer.technology}</h3>
          <span>{activeLayer.purpose}</span>
          <dl>
            <dt>Data handled</dt>
            <dd>{activeLayer.data}</dd>
          </dl>
        </motion.div>
      </div>
    </section>
  )
}
