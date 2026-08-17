import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { CommandPalette } from './CommandPalette'

afterEach(cleanup)

describe('CommandPalette', () => {
  it('opens from the keyboard, filters commands, and closes with Escape', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)

    await user.keyboard('{Control>}k{/Control}')
    expect(screen.getByRole('dialog', { name: 'Command menu' })).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: 'Search commands' }), 'skills')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: /skills/i })).toHaveAttribute('href', '#skills')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Command menu' })).not.toBeInTheDocument()
  })
})
