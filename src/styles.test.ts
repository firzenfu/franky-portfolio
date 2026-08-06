// @vitest-environment node

// @ts-expect-error The app build intentionally omits test-only Node declarations.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const styles = readFileSync('src/styles.css', 'utf8')

describe('responsive fixed-control clearance', () => {
  it('reserves the contact rail only through the single-column breakpoint', () => {
    const desktopStyles = styles.slice(0, styles.indexOf('@media (max-width: 879px)'))
    const singleColumnStyles = styles.match(
      /@media \(max-width: 879px\) \{([\s\S]*?)\r?\n\}\r?\n\r?\n@media \(max-width: 767px\)/,
    )?.[1]
    const mobileLayoutStyles = styles.match(
      /@media \(max-width: 767px\) \{([\s\S]*?)\r?\n\}\r?\n\r?\n@media \(prefers-reduced-transparency: reduce\)/,
    )?.[1]
    const mobileControlStart = styles.lastIndexOf('@media (max-width: 767px)')
    const mobileControlEnd = styles.indexOf('@media (prefers-reduced-motion: reduce)', mobileControlStart)
    const mobileControlStyles = styles.slice(mobileControlStart, mobileControlEnd)
    const railRule = /\.contact-scene-layout,\s*\.site-footer\s*\{\s*padding-right:\s*42px;\s*\}/

    expect(singleColumnStyles).toMatch(railRule)
    expect(mobileLayoutStyles).not.toMatch(railRule)
    expect(desktopStyles).not.toMatch(railRule)
    expect(mobileControlStyles).toMatch(/\.music-control\s*\{[\s\S]*?right:\s*16px;/)
    expect(mobileControlStyles).toMatch(/\.music-control-button\s*\{[\s\S]*?width:\s*46px;[\s\S]*?height:\s*46px;/)
  })
})
