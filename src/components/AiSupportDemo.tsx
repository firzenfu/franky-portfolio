import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

const issues = [
  {
    id: 'wifi',
    ticketId: 'SAMPLE-WIFI',
    label: 'Wi-Fi will not connect',
    priority: 'Medium',
    userMessage: 'My laptop sees the network, but it keeps rejecting the connection.',
    response: 'I would first separate a saved-password problem from a network problem.',
    checks: ['Forget and rejoin the network', 'Test another device on the same network', 'Capture the exact connection error'],
  },
  {
    id: 'screen',
    ticketId: 'SAMPLE-DISPLAY',
    label: 'Screen stays blank',
    priority: 'High',
    userMessage: 'The computer turns on, but the display remains black.',
    response: 'I would check whether the issue is the display path, power state, or startup process.',
    checks: ['Confirm the monitor input and cable', 'Test the brightness and wake controls', 'Check for startup sounds or status lights'],
  },
  {
    id: 'printer',
    ticketId: 'SAMPLE-PRINT',
    label: 'Printer is unavailable',
    priority: 'Medium',
    userMessage: 'The printer is online, but my document never reaches it.',
    response: 'I would verify the selected device, queue state, and local connection before escalating.',
    checks: ['Confirm the selected printer', 'Clear paused jobs from the queue', 'Print a local test page'],
  },
] as const

type CopyState = 'idle' | 'copying' | 'copied' | 'error'

function ticketText(issue: (typeof issues)[number]) {
  return [
    'SAMPLE SUPPORT TICKET',
    `ID: ${issue.ticketId}`,
    `Issue: ${issue.label}`,
    `Priority: ${issue.priority}`,
    'Status: Needs technician review',
    '',
    'User report:',
    issue.userMessage,
    '',
    'Initial assessment:',
    issue.response,
    '',
    'Troubleshooting steps:',
    ...issue.checks.map((check) => `- ${check}`),
    '',
    'Preview only. This ticket was not submitted.',
  ].join('\n')
}

export function AiSupportDemo() {
  const reducedMotion = Boolean(useReducedMotion())
  const [activeId, setActiveId] = useState<(typeof issues)[number]['id']>('wifi')
  const [ticketReady, setTicketReady] = useState(false)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const activeIssue = issues.find((issue) => issue.id === activeId) ?? issues[0]

  function selectIssue(id: (typeof issues)[number]['id']) {
    setActiveId(id)
    setTicketReady(false)
    setCopyState('idle')
  }

  async function copyTicket() {
    setCopyState('copying')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(ticketText(activeIssue))
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
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
              {!ticketReady ? (
                <div className="ai-demo-outcome">
                  <p>Still unresolved? Preview the complete handoff a technician would receive.</p>
                  <button type="button" onClick={() => setTicketReady(true)}>
                    Preview sample ticket
                  </button>
                </div>
              ) : (
                <motion.section
                  className="ai-demo-ticket"
                  aria-labelledby={`${activeIssue.id}-ticket-title`}
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <header className="ai-demo-ticket-header">
                    <div>
                      <span>Sample ticket</span>
                      <h3 id={`${activeIssue.id}-ticket-title`}>{activeIssue.ticketId}</h3>
                    </div>
                    <p>Preview only. Nothing is submitted.</p>
                  </header>

                  <dl className="ai-demo-ticket-summary">
                    <div>
                      <dt>Issue</dt>
                      <dd>{activeIssue.label}</dd>
                    </div>
                    <div>
                      <dt>Priority</dt>
                      <dd>{activeIssue.priority}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>Needs technician review</dd>
                    </div>
                  </dl>

                  <div className="ai-demo-ticket-context">
                    <div>
                      <h4>User report</h4>
                      <p>{activeIssue.userMessage}</p>
                      <h4>Initial assessment</h4>
                      <p>{activeIssue.response}</p>
                    </div>
                    <div>
                      <h4>Troubleshooting captured</h4>
                      <ul>
                        {activeIssue.checks.map((check) => <li key={check}>{check}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="ai-demo-ticket-footer">
                    <p role={copyState === 'error' ? 'alert' : 'status'}>
                      {copyState === 'copied' && 'Ticket copied to your clipboard.'}
                      {copyState === 'error' && 'Clipboard access is unavailable. Try again or select the ticket text manually.'}
                      {(copyState === 'idle' || copyState === 'copying') && 'Copy this sample to see how context moves into a support workflow.'}
                    </p>
                    <div className="ai-demo-ticket-actions">
                      <button
                        type="button"
                        className="is-secondary"
                        onClick={() => {
                          setTicketReady(false)
                          setCopyState('idle')
                        }}
                      >
                        Close preview
                      </button>
                      <button type="button" onClick={copyTicket} disabled={copyState === 'copying'}>
                        {copyState === 'copying' && 'Copying'}
                        {copyState === 'copied' && 'Copied'}
                        {copyState === 'error' && 'Try copy again'}
                        {copyState === 'idle' && 'Copy ticket'}
                      </button>
                    </div>
                  </div>
                </motion.section>
              )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
