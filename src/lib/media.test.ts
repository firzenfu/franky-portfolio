import { describe, expect, it } from 'vitest'
import { selectMediaMode } from './media'

describe('selectMediaMode', () => {
  it('uses the poster when reduced motion is requested', () => {
    expect(selectMediaMode({ reducedMotion: true, failed: false })).toBe('poster')
  })

  it('uses the poster after a video failure', () => {
    expect(selectMediaMode({ reducedMotion: false, failed: true })).toBe('poster')
  })

  it('uses video when motion is allowed and loading has not failed', () => {
    expect(selectMediaMode({ reducedMotion: false, failed: false })).toBe('video')
  })
})
