import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchRedirects(): Promise<Array<{ source: string; destination: string; permanent: boolean }>> {
  try {
    const res = await fetch(`${apiUrl}/redirects-public`, { next: { revalidate: 60 } });
    if (!res.ok) return [];

    const redirects = await res.json();

    return redirects.map((r: { from_path: string; to: string; status_code: number }) => ({
      source: r.from_path,
      destination: r.to,
      permanent: r.status_code === 301,
    }));
  } catch (error) {
    console.warn('Could not fetch redirects from backend, using none:', error);
    return [];
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'nissi-insights.com',
      },
      {
        protocol: 'https',
        hostname: 'api.nissi-insights.com',
      },
    ],
  },
  async redirects() {
    return fetchRedirects();
  },
  async headers() {
    return [
      {
        // Security & SEO headers for all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/:path*.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|otf|css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
