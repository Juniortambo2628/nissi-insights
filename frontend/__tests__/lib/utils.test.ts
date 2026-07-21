import { cn, getMediaUrl } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500')
  })

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'extra')
    expect(result).toContain('base')
    expect(result).toContain('extra')
    expect(result).not.toContain('hidden')
  })

  it('handles undefined and null', () => {
    const result = cn('base', undefined, null)
    expect(result).toBe('base')
  })

  it('merges Tailwind conflicting classes', () => {
    const result = cn('p-2', 'p-4')
    expect(result).toBe('p-4')
  })
})

describe('getMediaUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000/api'
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns empty string for null/undefined', () => {
    expect(getMediaUrl(null)).toBe('')
    expect(getMediaUrl(undefined)).toBe('')
  })

  it('returns full HTTP URLs unchanged', () => {
    expect(getMediaUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
  })

  it('returns data URLs unchanged', () => {
    expect(getMediaUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc')
  })

  it('prepends slash for local assets', () => {
    expect(getMediaUrl('assets/logo.png')).toBe('/assets/logo.png')
    expect(getMediaUrl('/assets/logo.png')).toBe('/assets/logo.png')
  })

  it('prepends slash for logos', () => {
    expect(getMediaUrl('logos/brand.png')).toBe('/logos/brand.png')
  })

  it('prepends slash for NI-Digital-Assets', () => {
    expect(getMediaUrl('NI-Digital-Assets/photo.jpg')).toBe('/NI-Digital-Assets/photo.jpg')
  })

  it('builds storage URL for storage/ prefix', () => {
    expect(getMediaUrl('storage/uploads/file.pdf')).toBe('http://localhost:8000/api/storage/uploads/file.pdf')
  })

  it('builds storage URL for uploads/ prefix', () => {
    expect(getMediaUrl('uploads/file.jpg')).toBe('http://localhost:8000/api/storage/uploads/file.jpg')
  })

  it('builds storage URL for files/ prefix', () => {
    expect(getMediaUrl('files/doc.pdf')).toBe('http://localhost:8000/api/storage/files/doc.pdf')
  })

  it('returns root-relative paths unchanged', () => {
    expect(getMediaUrl('/images/photo.jpg')).toBe('/images/photo.jpg')
  })

  it('falls back to storage/uploads for bare filenames', () => {
    expect(getMediaUrl('photo.jpg')).toBe('http://localhost:8000/api/storage/uploads/photo.jpg')
  })
})
