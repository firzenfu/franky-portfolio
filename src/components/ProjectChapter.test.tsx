import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useReducedMotion } from 'framer-motion'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SceneMedia } from '../data/media'
import type { Project } from '../data/portfolio'
import { ProjectChapter } from './ProjectChapter'

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return { ...actual, useReducedMotion: vi.fn(() => false) }
})

const project: Project = {
  slug: 'bikes-r-us',
  title: 'Bikes R Us',
  subtitle: 'Sales & Returns System',
  year: '2025',
  image: '/images/bikes-r-us-sales.png',
  href: 'https://github.com/firzenfu/bikes-r-us',
  stack: ['Blazor Server', 'MudBlazor', 'EF Core', 'SQL Server'],
  problem: 'Sales and returns workflows needed one dependable place.',
  solution: 'Built a focused operations system.',
}

const media: SceneMedia = {
  video: '/video/bikes.mp4',
  mobileVideo: '/video/bikes-mobile.mp4',
  poster: '/images/bikes-poster.jpg',
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

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

describe('ProjectChapter', () => {
  beforeEach(() => {
    IntersectionObserverStub.instances = []
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub)
    vi.stubGlobal('ResizeObserver', ResizeObserverStub)
  })

  afterEach(() => {
    cleanup()
    vi.mocked(useReducedMotion).mockReturnValue(false)
    vi.unstubAllGlobals()
  })

  it('renders the project narrative, metadata, proof, and destination', () => {
    render(<ProjectChapter project={project} media={media} index={0} />)

    expect(screen.getByRole('heading', { name: 'Bikes R Us' })).toBeInTheDocument()
    expect(screen.getByText(project.problem)).toBeInTheDocument()
    expect(screen.getByText(project.solution)).toBeInTheDocument()
    expect(screen.getByText('2025')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Bikes R Us technology stack' })).toHaveTextContent(
      'Blazor ServerMudBlazorEF CoreSQL Server',
    )
    expect(screen.getByRole('link', { name: 'View GitHub profile' })).toHaveAttribute(
      'href',
      'https://github.com/firzenfu/bikes-r-us',
    )
    expect(screen.getByRole('img', { name: 'Bikes R Us interface' })).toHaveAttribute(
      'src',
      '/images/bikes-r-us-sales.png',
    )
  })

  it('mounts project video only while the chapter is near the viewport and supports re-entry', () => {
    render(<ProjectChapter project={project} media={media} index={0} />)

    expect(screen.queryByTestId('scene-video')).not.toBeInTheDocument()
    expect(screen.getByTestId('project-atmosphere-poster')).toHaveAttribute(
      'src',
      '/images/bikes-poster.jpg',
    )
    expect(IntersectionObserverStub.instances[0].options?.rootMargin).toBe('600px 0px')

    act(() => IntersectionObserverStub.instances[0].trigger(true))

    const video = screen.getByTestId('scene-video')
    expect(video.querySelector('source[src="/video/bikes.mp4"]')).toBeInTheDocument()
    expect(video.querySelector('source[src="/video/bikes-mobile.mp4"]')).toBeInTheDocument()

    act(() => IntersectionObserverStub.instances[0].trigger(false))
    expect(screen.queryByTestId('scene-video')).not.toBeInTheDocument()
    expect(screen.getByTestId('project-atmosphere-poster')).toBeInTheDocument()

    act(() => IntersectionObserverStub.instances[0].trigger(true))
    expect(screen.getByTestId('scene-video')).toBeInTheDocument()
  })

  it('keeps the atmosphere on its poster under reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    render(<ProjectChapter project={project} media={media} index={0} />)

    expect(IntersectionObserverStub.instances).toHaveLength(0)
    expect(screen.queryByTestId('scene-video')).not.toBeInTheDocument()
    expect(screen.getByTestId('project-atmosphere-poster')).toHaveAttribute(
      'src',
      '/images/bikes-poster.jpg',
    )
  })

  it('does not retry a failed project video after viewport re-entry', () => {
    render(<ProjectChapter project={project} media={media} index={0} />)
    act(() => IntersectionObserverStub.instances[0].trigger(true))

    fireEvent.error(screen.getByTestId('scene-video'))
    expect(screen.queryByTestId('scene-video')).not.toBeInTheDocument()

    act(() => IntersectionObserverStub.instances[0].trigger(false))
    act(() => IntersectionObserverStub.instances[0].trigger(true))

    expect(screen.queryByTestId('scene-video')).not.toBeInTheDocument()
    expect(screen.getByTestId('project-atmosphere-poster')).toBeInTheDocument()
  })

  it('omits failed proof imagery without removing chapter content', () => {
    render(<ProjectChapter project={project} media={media} index={0} />)

    fireEvent.error(screen.getByRole('img', { name: 'Bikes R Us interface' }))

    expect(screen.queryByRole('img', { name: 'Bikes R Us interface' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bikes R Us' })).toBeInTheDocument()
    expect(screen.getByText(project.problem)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View GitHub profile' })).toBeInTheDocument()
  })

  it('does not create a proof layer when no real screenshot exists', () => {
    const projectWithoutImage = { ...project, image: undefined } as unknown as Project

    render(<ProjectChapter project={projectWithoutImage} media={media} index={2} />)

    expect(screen.queryByRole('img', { name: 'Bikes R Us interface' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bikes R Us' })).toBeInTheDocument()
  })
})
