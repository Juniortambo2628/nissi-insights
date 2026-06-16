import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com'

  const routes = [
    '',
    '/about',
    '/services',
    '/insights',
    '/knowledge-base',
    '/case-studies',
    '/events',
    '/contact',
  ].map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    // Fetch dynamic content
    const [insightsRes, caseStudiesRes, resourcesRes, eventsRes] = await Promise.all([
      fetch(`${apiUrl}/insights`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/case-studies`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/resources`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/events`, { next: { revalidate: 3600 } }),
    ])

    const insights = insightsRes.ok ? await insightsRes.json() : []
    const caseStudies = caseStudiesRes.ok ? await caseStudiesRes.json() : []
    const resources = resourcesRes.ok ? await resourcesRes.json() : []
    const events = eventsRes.ok ? await eventsRes.json() : []

    const insightRoutes = insights.map((insight: any) => ({
      url: `${appUrl}/insights/${insight.slug}`,
      lastModified: new Date(insight.updated_at || insight.created_at).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    const caseStudyRoutes = caseStudies.map((cs: any) => ({
      url: `${appUrl}/case-studies/${cs.slug}`,
      lastModified: new Date(cs.updated_at || cs.created_at).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    const resourceRoutes = resources.map((resource: any) => ({
      url: `${appUrl}/knowledge-base/${resource.slug}`,
      lastModified: new Date(resource.updated_at || resource.created_at).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    const eventRoutes = events.map((event: any) => ({
      url: `${appUrl}/events/${event.slug}`,
      lastModified: new Date(event.updated_at || event.created_at).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...routes, ...insightRoutes, ...caseStudyRoutes, ...resourceRoutes, ...eventRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return routes
  }
}
