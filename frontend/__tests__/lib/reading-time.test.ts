import { readingTime } from '@/lib/reading-time'

describe('readingTime', () => {
  it('returns 1 min read for empty content', () => {
    expect(readingTime('')).toBe('1 min read')
  })

  it('returns 1 min read for short text', () => {
    expect(readingTime('Hello world')).toBe('1 min read')
  })

  it('calculates reading time for longer content', () => {
    const words = Array(400).fill('word').join(' ')
    expect(readingTime(words)).toBe('2 min read')
  })

  it('strips HTML tags before calculating', () => {
    const html = '<p>' + Array(400).fill('word').join(' ') + '</p>'
    expect(readingTime(html)).toBe('2 min read')
  })

  it('rounds up to next minute', () => {
    const words = Array(201).fill('word').join(' ')
    expect(readingTime(words)).toBe('2 min read')
  })

  it('returns minimum 1 minute', () => {
    expect(readingTime('a')).toBe('1 min read')
  })
})
