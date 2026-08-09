import { buildCanonical, buildDynamicMetadata, buildArticleJsonLd, buildEventJsonLd } from '@/lib/seo'
import type { Insight, CaseStudy, Event } from '@/lib/types'

describe('buildCanonical', () => {
  it('builds canonical URL from path', () => {
    const result = buildCanonical('/insights/my-article')
    expect(result).toMatch(/nissi-insights\.com\/insights\/my-article$/)
  })

  it('adds leading slash if missing', () => {
    const result = buildCanonical('about')
    expect(result).toMatch(/\/about$/)
  })

  it('strips trailing slash from base URL', () => {
    const result = buildCanonical('/test')
    expect(result).not.toContain('.com//')
  })
})

describe('buildDynamicMetadata', () => {
  it('returns noindex for null entity', () => {
    const result = buildDynamicMetadata(null, {
      path: '/test',
      fallbackTitle: 'Title',
      fallbackDescription: 'Desc',
    })
    expect(result.robots).toEqual({ index: false, follow: false })
    expect(result.title).toBe('Title')
  })

  it('uses meta_title over title when available', () => {
    const entity = {
      title: 'Original Title',
      meta_title: 'SEO Title',
      description: 'Description',
      is_published: true,
    }
    const result = buildDynamicMetadata(entity, {
      path: '/test',
      fallbackTitle: 'Fallback',
      fallbackDescription: 'Fallback Desc',
    })
    expect(result.title).toBe('SEO Title')
  })

  it('falls back to title when meta_title is null', () => {
    const entity = {
      title: 'Article Title',
      meta_title: null,
      description: 'Description',
      is_published: true,
    }
    const result = buildDynamicMetadata(entity, {
      path: '/test',
      fallbackTitle: 'Fallback',
      fallbackDescription: 'Fallback Desc',
    })
    expect(result.title).toBe('Article Title')
  })

  it('sets noindex for unpublished content', () => {
    const entity = {
      title: 'Draft',
      is_published: false,
    }
    const result = buildDynamicMetadata(entity, {
      path: '/test',
      fallbackTitle: 'Fallback',
      fallbackDescription: 'Fallback Desc',
    })
    expect(result.robots).toEqual({ index: false, follow: false })
  })

  it('includes openGraph with image when provided', () => {
    const entity = {
      title: 'Article',
      image: 'https://example.com/image.jpg',
      is_published: true,
    }
    const result = buildDynamicMetadata(entity, {
      path: '/test',
      fallbackTitle: 'Fallback',
      fallbackDescription: 'Desc',
    })
    expect(result.openGraph).toBeDefined()
    expect(result.openGraph?.images).toEqual([{ url: 'https://example.com/image.jpg' }])
  })

  it('truncates description to 160 chars', () => {
    const longDesc = 'A'.repeat(200)
    const entity = {
      title: 'Article',
      description: longDesc,
      is_published: true,
    }
    const result = buildDynamicMetadata(entity, {
      path: '/test',
      fallbackTitle: 'Fallback',
      fallbackDescription: 'Desc',
    })
    expect(result.description).toHaveLength(160)
  })
})

describe('buildArticleJsonLd', () => {
  it('returns null for falsy entity', () => {
    expect(buildArticleJsonLd(null, '/test')).toBeNull()
  })

  it('builds valid Article structured data', () => {
    const entity = {
      id: 1,
      title: 'Test Article',
      slug: 'test-article',
      category: 'finance',
      excerpt: 'A test article',
      content: 'Content here',
      image: null,
      user_id: 1,
      is_published: true,
      published_at: null,
      tags: [],
      meta_title: null,
      meta_description: null,
      created_at: '2025-01-01',
      updated_at: '2025-01-02',
    } as Insight
    const result = buildArticleJsonLd(entity, '/test')
    expect(result).not.toBeNull()
    expect(result!['@type']).toBe('Article')
    expect(result!.headline).toBe('Test Article')
    expect(result!.datePublished).toBe('2025-01-01')
    expect(result!.dateModified).toBe('2025-01-02')
    expect(result!.author?.name).toBe('Nissi Insights')
  })

  it('includes keywords from tags', () => {
    const entity = {
      id: 1,
      title: 'Article',
      slug: 'article',
      category: 'finance',
      tags: ['finance', ' advisory'],
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    } as Insight
    const result = buildArticleJsonLd(entity, '/test')
    expect(result!.keywords).toBe('finance,  advisory')
  })
})

describe('buildEventJsonLd', () => {
  it('returns null for falsy entity', () => {
    expect(buildEventJsonLd(null, '/test')).toBeNull()
  })

  it('builds valid Event structured data', () => {
    const entity = {
      id: 1,
      title: 'Annual Summit',
      slug: 'annual-summit',
      description: 'Our yearly event',
      overview: null,
      date: '2025-06-15',
      duration_minutes: 60,
      timezone: 'UTC',
      location: 'Nairobi',
      image: null,
      link: null,
      status: 'upcoming' as const,
      is_published: true,
      tags: [],
      meta_title: null,
      meta_description: null,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    } as Event
    const result = buildEventJsonLd(entity, '/test')
    expect(result).not.toBeNull()
    expect(result!['@type']).toBe('Event')
    expect(result!.name).toBe('Annual Summit')
    expect(result!.startDate).toBe('2025-06-15')
    expect(result!.location).toEqual({ '@type': 'Place', name: 'Nairobi' })
  })

  it('omits location when not provided', () => {
    const entity = {
      id: 1,
      title: 'Virtual Event',
      slug: 'virtual-event',
      description: 'Online',
      overview: null,
      date: '2025-06-15',
      duration_minutes: 60,
      timezone: 'UTC',
      location: '',
      image: null,
      link: null,
      status: 'upcoming' as const,
      is_published: true,
      tags: [],
      meta_title: null,
      meta_description: null,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    } as Event
    const result = buildEventJsonLd(entity, '/test')
    expect(result!.location).toBeUndefined()
  })
})
