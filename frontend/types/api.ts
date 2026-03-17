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
  created_at: string;
  updated_at: string;
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

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
