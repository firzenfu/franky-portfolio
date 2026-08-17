import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { ArchitectureExplorer } from './ArchitectureExplorer'

afterEach(cleanup)

describe('ArchitectureExplorer', () => {
  it('explains the selected system layer', async () => {
    const user = userEvent.setup()
    render(<ArchitectureExplorer />)

    await user.click(screen.getByRole('button', { name: /reasoning, openai api/i }))
    expect(screen.getByText(/suggest a focused diagnostic action/i)).toBeInTheDocument()
    expect(screen.getByText(/previous checks, and the next support objective/i)).toBeInTheDocument()
  })
})
