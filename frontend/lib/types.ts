// Entity types matching backend models

export interface Service {
  id: number
  pillar_id: number
  title: string
  slug: string
  category: string
  description: string
  content: string | null
  icon: string
  image: string | null
  video_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Insight {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string | null
  content: string | null
  image: string | null
  user_id: number
  is_published: boolean
  published_at: string | null
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface CaseStudy {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string | null
  content: string | null
  image: string | null
  client_name: string | null
  problem: string | null
  methodology: string | null
  outcome: string | null
  significant_figure: string | null
  stats: Record<string, unknown> | null
  is_published: boolean
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: number
  title: string
  slug: string
  description: string
  overview: string | null
  date: string
  duration_minutes: number
  timezone: string
  location: string
  image: string | null
  link: string | null
  status: 'upcoming' | 'past'
  is_published: boolean
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  registrations_count?: number
}

export interface EventRegistration {
  id: number
  event_id: number
  full_name: string
  email: string
  phone: string | null
  organization: string | null
  notes: string | null
  consent: boolean
  newsletter: boolean
  status: string
  created_at: string
  updated_at: string
}

export interface EventDocument {
  id: number
  event_id: number
  resource_id: number | null
  title: string
  type: 'file' | 'link'
  file_path: string | null
  path: string | null
  url: string | null
  file_name: string | null
  original_filename: string | null
  mime_type: string | null
  file_size: number | null
  size: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Pillar {
  id: number
  title: string
  slug: string
  overview: string
  content: string | null
  icon: string
  image: string | null
  is_active: boolean
  services?: Service[]
  created_at: string
  updated_at: string
}

export interface Client {
  id: number
  name: string
  logo: string
  website: string | null
  is_active: boolean
  sort_order: number
  order: number
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: number
  name: string
  role: string
  bio: string | null
  image: string | null
  linkedin: string | null
  email: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: number
  name: string
  client_name: string
  role: string
  company: string
  content: string
  quote: string
  rating: number
  is_featured: boolean
  avatar: string | null
  order: number
  created_at: string
  updated_at: string
}

export interface Stat {
  id: number
  label: string
  value: string
  icon: string
  order: number
  created_at: string
  updated_at: string
}

export interface Value {
  id: number
  title: string
  description: string
  icon: string
  order: number
  created_at: string
  updated_at: string
}

export interface Resource {
  id: number
  title: string
  slug: string
  description: string | null
  content: string | null
  image: string | null
  file_path: string | null
  category: string | null
  is_published: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Subscriber {
  id: number
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Rsvp {
  id: number
  event_id: number
  name: string
  email: string
  attendance: 'yes' | 'no' | 'maybe'
  dietary: string | null
  plus_one: boolean
  consent: boolean
  newsletter: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ConsultationRequest {
  id: number
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string
  budget: string | null
  timeline: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: number
  key: string
  value: string | null
  type: string
  group: string
  created_at: string
  updated_at: string
}

export interface EmailTemplate {
  id: number
  key: string
  subject: string
  content: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EmailLog {
  id: number
  template_key: string | null
  recipient: string
  subject: string
  status: string
  error: string | null
  sent_at: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
}

export interface AnalyticsSummary {
  pageViews: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
  }
  notFound: {
    total: number
    today: number
    uniquePaths: number
  }
  recentPageViews: Array<{
    path: string
    count: number
  }>
  recentNotFound: Array<{
    path: string
    count: number
  }>
}
