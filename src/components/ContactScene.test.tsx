import { act, cleanup, render, screen } from '@testing-library/react'
import { useReducedMotion } from 'framer-motion'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactScene } from './ContactScene'

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return { ...actual, useReducedMotion: vi.fn(() => false) }
})

class IntersectionObserverStub {
  static instances: IntersectionObserverStub[] = []
  private target?: Element

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    IntersectionObserverStub.instances.push(this)
  }

  observe(target: Element) {
    this.target = target
  }

  unobserve() {}
  disconnect() {}

  trigger(isIntersecting: boolean) {
    if (!this.target) throw new Error('Observer target was not registered')
    this.callback([
      { isIntersecting, target: this.target } as IntersectionObserverEntry,
    ], this as unknown as IntersectionObserver)
  }
}

describe('ContactScene', () => {
  beforeEach(() => {
    IntersectionObserverStub.instances = []
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub)
  })

  afterEach(() => {
    cleanup()
    vi.mocked(useReducedMotion).mockReturnValue(false)
    vi.unstubAllGlobals()
  })

  it('mounts contact video only while the section is near the viewport', () => {
    render(<ContactScene />)

    expect(screen.queryByTestId('scene-video')).not.toBeInTheDocument()
    expect(screen.getByTestId('contact-atmosphere-poster')).toBeInTheDocument()
    expect(IntersectionObserverStub.instances[0].options?.rootMargin).toBe('600px 0px')

    act(() => IntersectionObserverStub.instances[0].trigger(true))
    expect(screen.getByTestId('scene-video')).toBeInTheDocument()

    act(() => IntersectionObserverStub.instances[0].trigger(false))
    expect(screen.queryByTestId('scene-video')).not.toBeInTheDocument()
    expect(screen.getByTestId('contact-atmosphere-poster')).toBeInTheDocument()
  })

  it('keeps contact media on its poster without observing under reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)

    render(<ContactScene />)

    expect(IntersectionObserverStub.instances).toHaveLength(0)
    expect(screen.queryByTestId('scene-video')).not.toBeInTheDocument()
    expect(screen.getByTestId('contact-atmosphere-poster')).toBeInTheDocument()
  })
})
