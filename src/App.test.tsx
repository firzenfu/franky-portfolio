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

  it('balances the two hero lines for narrow viewports', () => {
    const { container } = render(<App />)
    const lines = [...container.querySelectorAll('.hero-copy h1 span')]

    expect(lines.map((line) => line.textContent)).toEqual(['Software with a', 'point of view.'])
  })

  it('renders every project as a linked narrative chapter', () => {
    render(<App />)
    for (const title of ['Bikes R Us', 'Job Board', 'Next Experiment']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    }
    expect(screen.getAllByRole('link', { name: 'Open project' })).toHaveLength(3)
    expect(screen.getByText(/sales and returns workflows needed/i)).toBeInTheDocument()
  })
})
