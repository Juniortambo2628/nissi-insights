export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Pillar {
  id: number;
  title: string;
  slug: string;
  overview: string | null;
  content: string | null;
  icon: string | null;
  image: string | null;
  is_active: boolean;
  services?: Service[];
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  pillar_id?: number;
  pillar?: Pillar;
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string | null;
  icon: string | null;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Insight {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  content: string;
  image: string | null;
  user_id: number;
  user?: User;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  client_name: string;
  significant_figure: string;
  problem: string;
  methodology: string;
  outcome: string;
  image: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  source: string | null;
  is_active: boolean;
  unsubscribed_at: string | null;
  is_opted_out: boolean;
  created_at: string;
  updated_at: string;
}

export interface Newsletter {
  id: number;
  user_id: number;
  title: string;
  subject: string;
  preheader: string | null;
  content: string | null;
  header_image: string | null;
  background_color: string;
  text_color: string;
  accent_color: string;
  status: 'draft' | 'sent';
  sent_at: string | null;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface NewsletterRevision {
  id: number;
  source: 'manual' | 'autosave' | 'restore';
  title: string | null;
  subject: string | null;
  excerpt: string;
  user: { id: number; name: string } | null;
  created_at: string;
}

export interface NewsletterTemplate {
  id: number;
  user_id: number;
  name: string;
  background_color: string;
  text_color: string;
  accent_color: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: number;
  user_id: number;
  newsletter_id: number;
  newsletter?: Pick<Newsletter, 'id' | 'title' | 'subject' | 'status'>;
  name: string;
  subject: string | null;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignSendResult {
  message: string;
  sent: number;
  failed: number;
  total: number;
  errors: { email: string; error: string }[];
}

export interface Stat {
  id: number;
  label: string;
  value: string;
  icon: string | null;
  order: number;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
  type: string;
  group: string;
}

export interface EmailTemplate {
  id: number;
  key: string;
  name: string;
  subject: string;
  body: string;
  variables: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: number;
  sendable_type: string;
  sendable_id: number;
  template_key: string;
  recipient: string;
  status: 'queued' | 'sent' | 'failed';
  error: string | null;
  sent_at: string | null;
  created_at: string;
  sendable?: unknown;
}

export interface EmailContact {
  id: number;
  email: string;
  name: string | null;
  source: string | null;
  unsubscribed_at: string | null;
  is_opted_out: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBroadcastResult {
  message: string;
  sent: number;
  failed: number;
  total: number;
  errors: string[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
