import { monicaEverettProject, spellBoundaryProject } from './motionProjects'
import { projects } from './portfolio'

export type WorkCategory = 'Product' | 'AI' | 'Game' | 'Motion'

export type WorkItem = {
  id: string
  title: string
  subtitle: string
  year: string
  category: WorkCategory
  image: string
  imageAlt: string
  href: string
  summary: string
  tools: string[]
  external?: boolean
  actionLabel?: string
}

const [bikes, jobBoard, aiSupport] = projects

export const workItems: WorkItem[] = [
  {
    id: 'star-card',
    title: '星澜',
    subtitle: 'Interactive holographic art card',
    year: '2026',
    category: 'Motion',
    image: '/images/star-card-preview.png',
    imageAlt: '星澜 layered art card in the White Atelier interactive viewer',
    href: '/star-card/',
    summary: 'Explore layered artwork through rotation, depth, and shifting pearl, silver, and gold finishes.',
    tools: ['Three.js', 'WebGL', 'Interactive 3D'],
    actionLabel: 'Explore card',
  },
  {
    id: aiSupport.slug,
    title: aiSupport.title,
    subtitle: aiSupport.subtitle,
    year: aiSupport.year,
    category: 'AI',
    image: aiSupport.image ?? '/images/ai-support-assistant.png',
    imageAlt: 'AI Support Assistant conversation and ticket interface',
    href: aiSupport.href,
    summary: 'A guided support workflow that turns uncertain conversations into trackable resolutions.',
    tools: aiSupport.stack,
  },
  {
    id: spellBoundaryProject.id,
    title: spellBoundaryProject.title,
    subtitle: spellBoundaryProject.subtitle,
    year: spellBoundaryProject.year,
    category: 'Game',
    image: spellBoundaryProject.poster,
    imageAlt: spellBoundaryProject.posterAlt,
    href: '/#spell-boundary',
    summary: 'An original turn-based squad RPG with elemental breaks and cinematic ultimate attacks.',
    tools: spellBoundaryProject.disciplines,
  },
  {
    id: bikes.slug,
    title: bikes.title,
    subtitle: bikes.subtitle,
    year: bikes.year,
    category: 'Product',
    image: bikes.image ?? '/images/bikes-r-us-sales.png',
    imageAlt: 'Bikes R Us sales and returns interface',
    href: bikes.href,
    summary: 'A dependable operational system for sales, returns, and aligned staff records.',
    tools: bikes.stack,
    external: true,
  },
  {
    id: jobBoard.slug,
    title: jobBoard.title,
    subtitle: jobBoard.subtitle,
    year: jobBoard.year,
    category: 'Product',
    image: jobBoard.image ?? '/images/job-board.png',
    imageAlt: 'Job Board recruitment interface',
    href: jobBoard.href,
    summary: 'A structured recruitment experience for listings, applications, and candidate data.',
    tools: jobBoard.stack,
    external: true,
  },
  {
    id: monicaEverettProject.id,
    title: monicaEverettProject.title,
    subtitle: monicaEverettProject.subtitle,
    year: monicaEverettProject.year,
    category: 'Motion',
    image: monicaEverettProject.poster,
    imageAlt: monicaEverettProject.posterAlt,
    href: monicaEverettProject.video,
    summary: 'A compact character film shaped through rhythmic reveals, color, motion, and sound.',
    tools: monicaEverettProject.disciplines,
    actionLabel: 'Watch film',
  },
]

export const workCategories = ['All', 'Product', 'AI', 'Game', 'Motion'] as const
export type WorkFilter = (typeof workCategories)[number]
