import { parseEmailList, countInvalidEmailTokens, isValidEmail } from '@/lib/emails'

describe('parseEmailList', () => {
  it('parses newline separated emails', () => {
    expect(parseEmailList('a@example.com\nb@example.com')).toEqual([
      'a@example.com',
      'b@example.com',
    ])
  })

  it('parses comma and semicolon separated emails', () => {
    expect(parseEmailList('a@example.com, b@example.com;c@example.com')).toEqual([
      'a@example.com',
      'b@example.com',
      'c@example.com',
    ])
  })

  it('normalizes case and deduplicates', () => {
    expect(parseEmailList('A@Example.com\na@example.com')).toEqual(['a@example.com'])
  })

  it('drops invalid tokens', () => {
    expect(parseEmailList('not-an-email, a@example.com, @@@')).toEqual(['a@example.com'])
  })

  it('handles empty input', () => {
    expect(parseEmailList('')).toEqual([])
    expect(parseEmailList('   \n ')).toEqual([])
  })
})

describe('countInvalidEmailTokens', () => {
  it('counts tokens that failed to parse', () => {
    expect(countInvalidEmailTokens('a@example.com, nope, b@example.com')).toBe(1)
  })

  it('returns 0 for a clean list', () => {
    expect(countInvalidEmailTokens('a@example.com\nb@example.com')).toBe(0)
  })
})

describe('isValidEmail', () => {
  it('accepts normal addresses', () => {
    expect(isValidEmail('pauline@example.com')).toBe(true)
  })

  it('rejects malformed addresses', () => {
    expect(isValidEmail('nope')).toBe(false)
    expect(isValidEmail('a@b')).toBe(false)
  })
})
