import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com'

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
    url: `${appUrl}${route}`,
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
    url: `${appUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  }))

  try {
    // Fetch all dynamic content
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
    const insightsList = Array.isArray(insights) ? insights : (insights.data || [])
    const caseStudiesList = Array.isArray(caseStudies) ? caseStudies : (caseStudies.data || [])
    const resourcesList = Array.isArray(resources) ? resources : (resources.data || [])
    const eventsList = Array.isArray(events) ? events : (events.data || [])
    const servicesList = Array.isArray(servicesData) ? servicesData : (servicesData.data || [])

    const insightRoutes = insightsList.map((insight: any) => ({
      url: `${appUrl}/insights/${insight.slug}`,
      lastModified: new Date(insight.updated_at || insight.created_at).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const caseStudyRoutes = caseStudiesList.map((cs: any) => ({
      url: `${appUrl}/case-studies/${cs.slug}`,
      lastModified: new Date(cs.updated_at || cs.created_at).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const resourceRoutes = resourcesList.map((resource: any) => ({
      url: `${appUrl}/knowledge-base/${resource.slug}`,
      lastModified: new Date(resource.updated_at || resource.created_at).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const eventRoutes = eventsList.map((event: any) => ({
      url: `${appUrl}/events/${event.slug}`,
      lastModified: new Date(event.updated_at || event.created_at).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const serviceRoutes = servicesList.map((service: any) => ({
      url: `${appUrl}/services/${service.slug}`,
      lastModified: new Date(service.updated_at || service.created_at).toISOString(),
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
