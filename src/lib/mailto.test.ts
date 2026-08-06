import { describe, expect, it } from 'vitest'
import { buildMailtoUrl } from './mailto'

describe('buildMailtoUrl', () => {
  it('encodes the sender and multiline message', () => {
    const url = buildMailtoUrl({
      name: 'Ada Wong',
      email: 'ada@example.com',
      message: 'Hello Franky\nLet us talk.',
    })

    expect(url).toContain('mailto:firzenfu@gmail.com')
    expect(url).toContain('Portfolio%20enquiry%20from%20Ada%20Wong')
    expect(url).toContain('ada%40example.com')
    expect(url).toContain('Hello%20Franky%0ALet%20us%20talk.')
  })
})
