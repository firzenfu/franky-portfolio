import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AiSupportDemo } from './AiSupportDemo'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('AiSupportDemo', () => {
  it('switches sample issues and previews a complete technician handoff', async () => {
    const user = userEvent.setup()
    render(<AiSupportDemo />)

    await user.click(screen.getByRole('button', { name: 'Printer is unavailable' }))
    expect(screen.getByText(/verify the selected device, queue state/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Preview sample ticket' }))

    expect(screen.getByRole('heading', { name: 'SAMPLE-PRINT' })).toBeInTheDocument()
    expect(screen.getByText('Needs technician review')).toBeInTheDocument()
    expect(screen.getByText('Preview only. Nothing is submitted.')).toBeInTheDocument()
    expect(screen.getAllByText('Print a local test page')).toHaveLength(2)
  })

  it('copies the visible sample ticket without submitting it', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText')
    render(<AiSupportDemo />)

    await user.click(screen.getByRole('button', { name: 'Preview sample ticket' }))
    await user.click(screen.getByRole('button', { name: 'Copy ticket' }))

    expect(writeText).toHaveBeenCalledTimes(1)
    expect(writeText.mock.calls[0][0]).toContain('ID: SAMPLE-WIFI')
    expect(writeText.mock.calls[0][0]).toContain('Status: Needs technician review')
    expect(writeText.mock.calls[0][0]).toContain('This ticket was not submitted.')
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Ticket copied to your clipboard.')
  })

  it('shows a recoverable error when clipboard access fails', async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new DOMException('Clipboard blocked'))
    render(<AiSupportDemo />)

    await user.click(screen.getByRole('button', { name: 'Preview sample ticket' }))
    await user.click(screen.getByRole('button', { name: 'Copy ticket' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Clipboard access is unavailable')
    expect(screen.getByRole('button', { name: 'Try copy again' })).toBeInTheDocument()
  })
})
