import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

const issues = [
  {
    id: 'wifi',
    label: 'Wi-Fi will not connect',
    userMessage: 'My laptop sees the network, but it keeps rejecting the connection.',
    response: 'I would first separate a saved-password problem from a network problem.',
    checks: ['Forget and rejoin the network', 'Test another device on the same network', 'Capture the exact connection error'],
  },
  {
    id: 'screen',
    label: 'Screen stays blank',
    userMessage: 'The computer turns on, but the display remains black.',
    response: 'I would check whether the issue is the display path, power state, or startup process.',
    checks: ['Confirm the monitor input and cable', 'Test the brightness and wake controls', 'Check for startup sounds or status lights'],
  },
  {
    id: 'printer',
    label: 'Printer is unavailable',
    userMessage: 'The printer is online, but my document never reaches it.',
    response: 'I would verify the selected device, queue state, and local connection before escalating.',
    checks: ['Confirm the selected printer', 'Clear paused jobs from the queue', 'Print a local test page'],
  },
] as const

export function AiSupportDemo() {
  const reducedMotion = Boolean(useReducedMotion())
  const [activeId, setActiveId] = useState<(typeof issues)[number]['id']>('wifi')
  const [ticketReady, setTicketReady] = useState(false)
  const activeIssue = issues.find((issue) => issue.id === activeId) ?? issues[0]

  function selectIssue(id: (typeof issues)[number]['id']) {
    setActiveId(id)
    setTicketReady(false)
  }

  return (
    <section className="ai-demo-section" aria-labelledby="ai-demo-title">
      <div className="section-shell ai-demo-layout">
        <div className="ai-demo-intro">
          <h2 id="ai-demo-title">Try the support flow.</h2>
          <p>Choose a common issue and inspect the troubleshooting path. This guided sample runs entirely in your browser.</p>
          <a href="/projects/ai-support-assistant">Read the case study</a>
        </div>

        <div className="ai-demo-workspace">
          <div className="ai-demo-issues" aria-label="Choose a support issue">
            {issues.map((issue) => (
              <button
                key={issue.id}
                type="button"
                className={issue.id === activeId ? 'is-selected' : ''}
                aria-pressed={issue.id === activeId}
                onClick={() => selectIssue(issue.id)}
              >
                {issue.label}
              </button>
            ))}
          </div>

          <motion.div
            key={activeIssue.id}
            className="ai-demo-conversation"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
              <div className="ai-demo-message ai-demo-message-user">
                <span>You</span>
                <p>{activeIssue.userMessage}</p>
              </div>
              <div className="ai-demo-message ai-demo-message-assistant">
                <span>Support assistant</span>
                <p>{activeIssue.response}</p>
              </div>
              <ol className="ai-demo-checks">
                {activeIssue.checks.map((check) => <li key={check}>{check}</li>)}
              </ol>
              <div className="ai-demo-outcome" aria-live="polite">
                <p>{ticketReady ? 'Sample ticket ready for human follow-up.' : 'Still unresolved? Preserve the context for a technician.'}</p>
                <button type="button" onClick={() => setTicketReady(true)} disabled={ticketReady}>
                  {ticketReady ? 'Ticket prepared' : 'Prepare sample ticket'}
                </button>
              </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
