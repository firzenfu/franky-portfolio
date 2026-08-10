import { describe, expect, it } from 'vitest'
import { capabilities, experience, projects } from './portfolio'

describe('portfolio data', () => {
  it('keeps three linkable projects with recruiter-focused narratives', () => {
    expect(projects).toHaveLength(3)
    for (const project of projects) {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/)
      expect(project.href).toMatch(/^(https:\/\/|\/)/)
      expect(project.stack.length).toBeGreaterThanOrEqual(3)
      expect(project.problem.length).toBeGreaterThan(20)
      expect(project.solution.length).toBeGreaterThan(20)
    }
  })

  it('preserves the five capabilities and three experience entries', () => {
    expect(capabilities).toHaveLength(5)
    expect(experience).toHaveLength(3)
    expect(experience[0]).toMatchObject({ company: 'NAIT', role: 'Software Development' })
  })
})
