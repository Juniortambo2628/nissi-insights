import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import ClientLayout from "@/components/ClientLayout";
import { Toaster } from "@/components/ui/toaster";
import type { SiteSetting } from "@/types/api";

const geistSans = Geist({

  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com';
const defaultTitle = 'Nissi Insights | Energy Advisory & Market Intelligence';
const defaultDescription = 'Innovative Energy Advisory, Due Diligence, and Route to Market Strategy for a changing world.';

async function fetchSettings(): Promise<SiteSetting[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const response = await fetch(`${apiUrl}/settings`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const settingsByGroup: Record<string, SiteSetting[]> = await response.json();
    return Object.values(settingsByGroup).flat();
  } catch {
    return [];
  }
}

export async function generateMetadata() {
  const settings = await fetchSettings();
  const get = (key: string) => settings.find(s => s.key === key)?.value;

  const title = get('site_title') || defaultTitle;
  const description = get('site_description') || defaultDescription;
  const favicon = get('favicon') || '/favicon.png';

  return {
    metadataBase: new URL(appUrl),
    title,
    description,
    icons: {
      icon: favicon,
      apple: favicon,
    },
    openGraph: {
      type: 'website',
      title,
      description,
    }
  };
}

import PrelaunchWrapper from "@/components/PrelaunchWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let launchSettings = null;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const response = await fetch(`${apiUrl}/settings/launch`, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
        launchSettings = await response.json();
    } else {
        const text = await response.text();
        console.error(`Failed to fetch launch settings: ${response.status} ${response.statusText}`, text.substring(0, 100));
    }
  } catch (error) {
    console.error('Network error fetching launch settings in RootLayout:', error);
  }

  const settings = await fetchSettings();
  const get = (key: string) => settings.find(s => s.key === key)?.value;
  const siteName = get('site_name') || 'Nissi Insights';
  const siteDescription = get('site_description') || defaultDescription;
  const logoUrl = get('logo_dark') || `${appUrl}/favicon.png`;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${appUrl}/#organization`,
                  "name": siteName,
                  "url": appUrl,
                  "logo": {
                    "@type": "ImageObject",
                    "url": logoUrl.startsWith('http') ? logoUrl : `${appUrl}${logoUrl}`
                  },
                  "description": siteDescription,
                  "sameAs": [
                    "https://www.linkedin.com/company/nissi-insights"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": `${appUrl}/#website`,
                  "url": appUrl,
                  "name": siteName,
                  "publisher": {
                    "@id": `${appUrl}/#organization`
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${appUrl}/knowledge-base?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "SiteNavigationElement",
                  "name": "Main Navigation",
                  "hasPart": [
                    { "@type": "SiteNavigationElement", "name": "Services", "url": `${appUrl}/services` },
                    { "@type": "SiteNavigationElement", "name": "Insights", "url": `${appUrl}/insights` },
                    { "@type": "SiteNavigationElement", "name": "Case Studies", "url": `${appUrl}/case-studies` },
                    { "@type": "SiteNavigationElement", "name": "Client Impact", "url": `${appUrl}/client-impact` },
                    { "@type": "SiteNavigationElement", "name": "Knowledge Hub", "url": `${appUrl}/knowledge-base` },
                    { "@type": "SiteNavigationElement", "name": "Events", "url": `${appUrl}/events` },
                    { "@type": "SiteNavigationElement", "name": "About", "url": `${appUrl}/about` },
                    { "@type": "SiteNavigationElement", "name": "Contact", "url": `${appUrl}/contact` }
                  ]
                }
              ]
            })
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <PrelaunchWrapper launchSettings={launchSettings}>
              <ClientLayout>
                {children}
                <Toaster />
              </ClientLayout>
            </PrelaunchWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
