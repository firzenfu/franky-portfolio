import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { buildMailtoUrl, navigateToMailto } from './lib/mailto'

vi.mock('./lib/mailto', async () => {
  const actual = await vi.importActual<typeof import('./lib/mailto')>('./lib/mailto')
  return {
    ...actual,
    buildMailtoUrl: vi.fn(actual.buildMailtoUrl),
    navigateToMailto: vi.fn(),
  }
})

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('IntersectionObserver', ObserverStub)
vi.stubGlobal('ResizeObserver', ObserverStub)

beforeEach(() => {
  window.history.replaceState({}, '', '/')
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.restoreAllMocks()
  localStorage.removeItem('franky-portfolio:background-music-muted')
})

describe('portfolio shell', () => {
  it('mounts one accessible background music control', () => {
    const { container } = render(<App />)

    expect(screen.getByRole('button', { name: 'Play background music' })).toBeInTheDocument()
    expect(container.querySelectorAll('audio[src="/audio/title-arcana-ver2.mp3"]')).toHaveLength(1)
  })

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
    for (const title of ['Bikes R Us', 'Job Board', 'AI Support']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    }
    expect(screen.getAllByRole('link', { name: 'View GitHub profile' })).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'View case study' })).toHaveAttribute('href', '/projects/ai-support-assistant')
    expect(screen.getByText(/sales and returns workflows needed/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'AI Support interface' })).toBeInTheDocument()
  })

  it('renders the AI support case study at its project path', () => {
    window.history.replaceState({}, '', '/projects/ai-support-assistant')
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Resolve IT issues faster.' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'AI Support Assistant conversation and ticket interface' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Try live demo' })).toHaveAttribute(
      'href',
      'https://ai-support-assistant-demo.vercel.app',
    )
  })

  it('renders personal facts, capabilities, and experience', () => {
    render(<App />)
    expect(screen.getByText('NAIT Software Development')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Illustrated avatar used by Franky Fu' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Frontend Engineering' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Backend Systems' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'NAIT' })).toBeInTheDocument()
  })

  it('keeps the visible contact label in the link accessible name', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: "Let's talk with Franky Fu" })).toHaveTextContent("Let's talk")
  })

  it('submits the accessible contact form through the mailto builder', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Name'), 'Ada Wong')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Message'), 'A product role in Edmonton.')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(buildMailtoUrl).toHaveBeenCalledWith({
      name: 'Ada Wong',
      email: 'ada@example.com',
      message: 'A product role in Edmonton.',
    })
    expect(navigateToMailto).toHaveBeenCalledWith(
      'mailto:firzenfu@gmail.com?subject=Portfolio%20enquiry%20from%20Ada%20Wong&body=Name%3A%20Ada%20Wong%0AEmail%3A%20ada%40example.com%0A%0AA%20product%20role%20in%20Edmonton.',
    )
  })
})
