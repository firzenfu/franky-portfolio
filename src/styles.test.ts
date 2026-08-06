// @vitest-environment node

// @ts-expect-error The app build intentionally omits test-only Node declarations.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const styles = readFileSync('src/styles.css', 'utf8')

describe('responsive fixed-control clearance', () => {
  it('reserves a mobile contact rail for the music control', () => {
    const mobileContactStyles = styles.match(
      /@media \(max-width: 767px\) \{([\s\S]*?)\r?\n\}\r?\n\r?\n@media \(prefers-reduced-transparency: reduce\)/,
    )?.[1]

    expect(mobileContactStyles).toMatch(
      /\.contact-scene-layout,\s*\.site-footer\s*\{\s*padding-right:\s*42px;\s*\}/,
    )
  })
})
