import { MetadataRoute } from 'next'
import { appUrl } from '@/lib/seo'

interface SeoItem {
    slug: string
    updated_at?: string
    created_at?: string
    is_published?: boolean
}

function buildUrl(path: string): string {
    const base = appUrl.replace(/\/$/, '')
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${base}${cleanPath}`
}

function lastModified(item: SeoItem): string {
    return new Date(item.updated_at || item.created_at || new Date()).toISOString()
}

function onlyPublished(items: SeoItem[]): SeoItem[] {
    return items.filter((item) => item.is_published !== false)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Core static pages
    const coreRoutes = [
        '',
        '/about',
        '/services',
        '/insights',
        '/knowledge-base',
        '/case-studies',
        '/client-impact',
        '/events',
        '/contact',
        '/consultation',
    ].map((route) => ({
        url: buildUrl(route),
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Legal / secondary static pages
    const secondaryRoutes = [
        '/privacy',
        '/terms',
        '/cookies',
    ].map((route) => ({
        url: buildUrl(route),
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.3,
    }))

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const [insightsRes, caseStudiesRes, resourcesRes, eventsRes, servicesRes] = await Promise.all([
            fetch(`${apiUrl}/insights`, { next: { revalidate: 3600 } }),
            fetch(`${apiUrl}/case-studies`, { next: { revalidate: 3600 } }),
            fetch(`${apiUrl}/resources`, { next: { revalidate: 3600 } }),
            fetch(`${apiUrl}/events`, { next: { revalidate: 3600 } }),
            fetch(`${apiUrl}/services`, { next: { revalidate: 3600 } }),
        ])

        const insights = insightsRes.ok ? await insightsRes.json() : []
        const caseStudies = caseStudiesRes.ok ? await caseStudiesRes.json() : []
        const resources = resourcesRes.ok ? await resourcesRes.json() : []
        const events = eventsRes.ok ? await eventsRes.json() : []
        const servicesData = servicesRes.ok ? await servicesRes.json() : []

        // Handle paginated API responses (data may be in .data property)
        const insightsList: SeoItem[] = Array.isArray(insights) ? insights : (insights.data || [])
        const caseStudiesList: SeoItem[] = Array.isArray(caseStudies) ? caseStudies : (caseStudies.data || [])
        const resourcesList: SeoItem[] = Array.isArray(resources) ? resources : (resources.data || [])
        const eventsList: SeoItem[] = Array.isArray(events) ? events : (events.data || [])
        const servicesList: SeoItem[] = Array.isArray(servicesData) ? servicesData : (servicesData.data || [])

        const insightRoutes = onlyPublished(insightsList).map((insight) => ({
            url: buildUrl(`/insights/${insight.slug}`),
            lastModified: lastModified(insight),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        const caseStudyRoutes = onlyPublished(caseStudiesList).map((cs) => ({
            url: buildUrl(`/case-studies/${cs.slug}`),
            lastModified: lastModified(cs),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        const resourceRoutes = onlyPublished(resourcesList).map((resource) => ({
            url: buildUrl(`/knowledge-base/${resource.slug}`),
            lastModified: lastModified(resource),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        const eventRoutes = onlyPublished(eventsList).map((event) => ({
            url: buildUrl(`/events/${event.slug}`),
            lastModified: lastModified(event),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        const serviceRoutes = onlyPublished(servicesList).map((service) => ({
            url: buildUrl(`/services/${service.slug}`),
            lastModified: lastModified(service),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }))

        return [
            ...coreRoutes,
            ...secondaryRoutes,
            ...insightRoutes,
            ...caseStudyRoutes,
            ...resourceRoutes,
            ...eventRoutes,
            ...serviceRoutes,
        ]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        return [...coreRoutes, ...secondaryRoutes]
    }
}
