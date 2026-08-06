// @vitest-environment node

// @ts-expect-error The app build intentionally omits test-only Node declarations.
import { readFileSync } from 'node:fs'
// @ts-expect-error The app build intentionally omits test-only jsdom declarations.
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'

describe('index fallback', () => {
  it('keeps the core portfolio usable outside the noscript-only path', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
    const document = new JSDOM(html).window.document
    const root = document.querySelector('#root')

    expect(root).not.toBeNull()
    expect(root?.querySelector('header nav')).not.toBeNull()
    expect(root?.querySelector('main')).not.toBeNull()

    for (const id of ['top', 'about', 'work', 'skills', 'contact']) {
      expect(root?.querySelectorAll(`#${id}`)).toHaveLength(1)
      expect(root?.querySelector(`a[href="#${id}"]`)).not.toBeNull()
    }

    const elementsWithIds = (root?.querySelectorAll('[id]') ?? []) as NodeListOf<Element>
    const ids = Array.from(elementsWithIds, (element) => element.id)
    expect(new Set(ids).size).toBe(ids.length)

    for (const project of ['Bikes R Us', 'Job Board', 'Next Experiment']) {
      expect(root?.querySelector(`h3[data-project="${project}"]`)).not.toBeNull()
    }

    expect(root?.querySelector('a[href="https://github.com/firzenfu"]')).not.toBeNull()
    expect(root?.querySelector('a[href="mailto:firzenfu@gmail.com"]')).not.toBeNull()
    expect(root?.textContent).toContain('Software developer')

    const noscriptText = document.querySelector('noscript')?.textContent ?? ''
    expect(noscriptText).not.toContain('Bikes R Us')
  })
})
