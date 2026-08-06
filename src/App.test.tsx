import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('IntersectionObserver', ObserverStub)
vi.stubGlobal('ResizeObserver', ObserverStub)

afterEach(cleanup)

describe('portfolio shell', () => {
  it('preserves navigation labels and section anchors', () => {
    const { container } = render(<App />)

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Works' })).toHaveAttribute('href', '#work')
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills')
    expect(screen.getByRole('link', { name: "Let's talk" })).toHaveAttribute('href', '#contact')

    for (const id of ['top', 'about', 'work', 'skills', 'contact']) {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument()
    }
  })

  it('states Franky’s role without decorative section numbering', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /software with a point of view/i })).toBeInTheDocument()
    expect(screen.queryByText(/01 \/|02 \/|03 \/|04 \/|scroll to explore/i)).not.toBeInTheDocument()
  })
})
