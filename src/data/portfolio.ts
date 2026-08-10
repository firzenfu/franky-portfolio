export type Project = {
  slug: string
  title: string
  subtitle: string
  year: string
  image?: string
  href: string
  stack: string[]
  problem: string
  solution: string
}

export type Capability = {
  shortLabel: string
  title: string
  description: string
  tools: string[]
}

export type Experience = {
  period: string
  company: string
  role: string
  description: string
  emphasis: 'primary' | 'supporting'
}

export const projects: Project[] = [
  {
    slug: 'bikes-r-us',
    title: 'Bikes R Us',
    subtitle: 'Sales & Returns System',
    year: '2025',
    image: '/images/bikes-r-us-sales.png',
    href: 'https://github.com/firzenfu',
    stack: ['Blazor Server', 'MudBlazor', 'EF Core', 'SQL Server'],
    problem: 'Sales and returns workflows needed one dependable place for staff to review activity and keep records aligned.',
    solution: 'Built a Blazor Server system with MudBlazor, Entity Framework Core, SQL Server, and focused operational views.',
  },
  {
    slug: 'job-board',
    title: 'Job Board',
    subtitle: 'Recruitment Web App',
    year: '2025',
    image: '/images/job-board.png',
    href: 'https://github.com/firzenfu',
    stack: ['Next.js', 'Prisma', 'REST API', 'Jest'],
    problem: 'Candidates and recruiters needed a clearer path through listings, applications, and structured job data.',
    solution: 'Created a Next.js recruitment application with Prisma, REST endpoints, and Jest coverage for core flows.',
  },
  {
    slug: 'ai-support-assistant',
    title: 'AI Support',
    subtitle: 'Intelligent IT Help Desk',
    year: '2026',
    image: '/images/ai-support-assistant.png',
    href: '/projects/ai-support-assistant',
    stack: ['Next.js', 'Python', 'OpenAI API', 'SQLite'],
    problem: 'Technical support often starts with scattered symptoms, repeated questions, and no clear path from conversation to action.',
    solution: 'Built an AI-assisted help desk that guides troubleshooting, preserves conversation context, and turns unresolved issues into trackable tickets.',
  },
]

export const capabilities: Capability[] = [
  {
    shortLabel: 'FE',
    title: 'Frontend Engineering',
    description: 'React, Next.js, TypeScript, HTML5 and CSS3 for responsive, accessible product interfaces.',
    tools: ['React', 'Next.js', 'TypeScript'],
  },
  {
    shortLabel: 'BE',
    title: 'Backend Systems',
    description: 'C#/.NET, Blazor Server, SQL Server, Entity Framework Core, Prisma and REST APIs.',
    tools: ['.NET', 'Blazor', 'SQL'],
  },
  {
    shortLabel: 'AI',
    title: 'AI Workflow',
    description: 'GitHub Copilot and Claude integrated into development, debugging and automation.',
    tools: ['Copilot', 'Claude', 'Automation'],
  },
  {
    shortLabel: 'UX',
    title: 'Product Craft',
    description: 'A visual eye for hierarchy, interaction, clarity and polished digital experiences.',
    tools: ['Figma', 'Canva', 'UI'],
  },
  {
    shortLabel: 'CM',
    title: 'Communication',
    description: 'English, Mandarin and native Cantonese for thoughtful multilingual collaboration.',
    tools: ['English', 'Mandarin', 'Cantonese'],
  },
]

export const experience: Experience[] = [
  {
    period: '2024 - 2026',
    company: 'NAIT',
    role: 'Software Development',
    description: 'Full-stack development across modern frontend, backend, database and testing workflows.',
    emphasis: 'primary',
  },
  {
    period: '2021 - 2022',
    company: 'Victoria International Tubular',
    role: 'Quality Control',
    description: 'Maintained precise production records and communicated findings across teams.',
    emphasis: 'supporting',
  },
  {
    period: '2020 - 2021',
    company: 'Tokyo Express / UW Insure',
    role: 'Operations & Accounting',
    description: 'Led daily operations and managed confidential financial records with accuracy.',
    emphasis: 'supporting',
  },
]
