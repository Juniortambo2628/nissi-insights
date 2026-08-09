import type { Metadata } from 'next'

export const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com'

export interface SeoEntity {
    title: string
    description?: string | null
    image?: string | null
    updated_at?: string | null
    created_at?: string | null
    is_published?: boolean
    meta_title?: string | null
    meta_description?: string | null
    tags?: string[] | null
}

export function buildCanonical(path: string): string {
    const base = appUrl.replace(/\/$/, '')
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${base}${cleanPath}`
}

export function buildDynamicMetadata(
    entity: SeoEntity | null,
    options: {
        path: string
        fallbackTitle: string
        fallbackDescription: string
        type?: 'article' | 'website' | 'event'
    }
): Metadata {
    const { path, fallbackTitle, fallbackDescription, type = 'article' } = options

    if (!entity) {
        return {
            title: fallbackTitle,
            description: fallbackDescription,
            robots: { index: false, follow: false },
        }
    }

    const isIndexable = entity.is_published !== false
    const title = entity.meta_title || entity.title
    const description = (entity.meta_description || entity.description || fallbackDescription).substring(0, 160)
    const canonical = buildCanonical(path)
    const image = entity.image || undefined

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        robots: isIndexable
            ? { index: true, follow: true }
            : { index: false, follow: false },
        openGraph: {
            type: type === 'event' ? 'website' : type,
            title,
            description,
            url: canonical,
            siteName: 'Nissi Insights',
            ...(image && { images: [{ url: image }] }),
            ...(entity.created_at && { publishedTime: entity.created_at }),
            ...(entity.updated_at && { modifiedTime: entity.updated_at }),
            ...(entity.tags && { tags: entity.tags }),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    }
}

export function buildArticleJsonLd(entity: SeoEntity | null, path: string) {
    if (!entity) return null

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: entity.meta_title || entity.title,
        description: entity.meta_description || entity.description || '',
        datePublished: entity.created_at,
        dateModified: entity.updated_at || entity.created_at,
        author: {
            '@type': 'Organization',
            name: 'Nissi Insights',
            url: appUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Nissi Insights',
            url: appUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${appUrl}/favicon.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': buildCanonical(path),
        },
        ...(entity.image && { image: entity.image }),
        ...(entity.tags && entity.tags.length > 0 && { keywords: entity.tags.join(', ') }),
    }
}

export function buildEventJsonLd(entity: (SeoEntity & { date?: string; location?: string | null }) | null, path: string) {
    if (!entity) return null

    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: entity.meta_title || entity.title,
        description: entity.meta_description || entity.description || '',
        ...(entity.date && { startDate: entity.date }),
        ...(entity.location && {
            location: {
                '@type': 'Place',
                name: entity.location,
            },
        }),
        organizer: {
            '@type': 'Organization',
            name: 'Nissi Insights',
            url: appUrl,
        },
        ...(entity.image && { image: entity.image }),
        ...(entity.tags && entity.tags.length > 0 && { keywords: entity.tags.join(', ') }),
    }
}
