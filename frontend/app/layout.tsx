import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import ClientLayout from "@/components/ClientLayout";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({

  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const response = await fetch(`${apiUrl}/settings`, { next: { revalidate: 60 } });
    const settingsByGroup = await response.json();
    const allSettings = Object.values(settingsByGroup).flat() as any[];
    const favicon = allSettings.find(s => s.key === 'favicon')?.value;
    
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com'),
      title: "Nissi Insights | Energy Advisory & Market Intelligence",
      description: "Innovative Energy Advisory, Due Diligence, and Route to Market Strategy for a changing world.",
      icons: {
        icon: favicon || '/favicon.png',
        apple: favicon || '/favicon.png',
      },
      openGraph: {
        type: 'website',
        title: "Nissi Insights | Energy Advisory & Market Intelligence",
        description: "Innovative Energy Advisory, Due Diligence, and Route to Market Strategy for a changing world.",
      }
    };
  } catch (error) {
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com'),
      title: "Nissi Insights | Energy Advisory & Market Intelligence",
      description: "Innovative Energy Advisory, Due Diligence, and Route to Market Strategy for a changing world.",
      icons: {
        icon: '/favicons/favicon.png',
        apple: '/favicons/favicon.png',
      },
      openGraph: {
        type: 'website',
        title: "Nissi Insights | Energy Advisory & Market Intelligence",
        description: "Innovative Energy Advisory, Due Diligence, and Route to Market Strategy for a changing world.",
      }
    };
  }
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
                  "@id": "https://nissi-insights.com/#organization",
                  "name": "Nissi Insights",
                  "url": "https://nissi-insights.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://nissi-insights.com/favicon.png"
                  },
                  "description": "Innovative Energy Advisory, Due Diligence, and Route to Market Strategy for a changing world.",
                  "sameAs": [
                    "https://www.linkedin.com/company/nissi-insights"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://nissi-insights.com/#website",
                  "url": "https://nissi-insights.com",
                  "name": "Nissi Insights",
                  "publisher": {
                    "@id": "https://nissi-insights.com/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://nissi-insights.com/knowledge-base?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "SiteNavigationElement",
                  "name": "Main Navigation",
                  "hasPart": [
                    { "@type": "SiteNavigationElement", "name": "Services", "url": "https://nissi-insights.com/services" },
                    { "@type": "SiteNavigationElement", "name": "Insights", "url": "https://nissi-insights.com/insights" },
                    { "@type": "SiteNavigationElement", "name": "Case Studies", "url": "https://nissi-insights.com/case-studies" },
                    { "@type": "SiteNavigationElement", "name": "Client Impact", "url": "https://nissi-insights.com/client-impact" },
                    { "@type": "SiteNavigationElement", "name": "Knowledge Hub", "url": "https://nissi-insights.com/knowledge-base" },
                    { "@type": "SiteNavigationElement", "name": "Events", "url": "https://nissi-insights.com/events" },
                    { "@type": "SiteNavigationElement", "name": "About", "url": "https://nissi-insights.com/about" },
                    { "@type": "SiteNavigationElement", "name": "Contact", "url": "https://nissi-insights.com/contact" }
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
