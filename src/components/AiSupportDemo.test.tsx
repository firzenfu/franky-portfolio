import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { AiSupportDemo } from './AiSupportDemo'

afterEach(cleanup)

describe('AiSupportDemo', () => {
  it('switches sample issues and prepares a local ticket outcome', async () => {
    const user = userEvent.setup()
    render(<AiSupportDemo />)

    await user.click(screen.getByRole('button', { name: 'Printer is unavailable' }))
    expect(screen.getByText(/verify the selected device, queue state/i)).toBeInTheDocument()

    const prepare = screen.getByRole('button', { name: 'Prepare sample ticket' })
    await user.click(prepare)
    expect(screen.getByText('Sample ticket ready for human follow-up.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ticket prepared' })).toBeDisabled()
  })
})
