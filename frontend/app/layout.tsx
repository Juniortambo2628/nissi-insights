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
      title: "Nissi Insights | Energy Advisory & Market Intelligence",
      description: "Innovative Energy Advisory, Due Diligence, and Route to Market Strategy for a changing world.",
      icons: {
        icon: favicon || '/favicon.png',
        apple: favicon || '/favicon.png',
      },
    };
  } catch (error) {
    return {
      title: "Nissi Insights | Energy Advisory & Market Intelligence",
      description: "Innovative Energy Advisory, Due Diligence, and Route to Market Strategy for a changing world.",
      icons: {
        icon: '/favicons/favicon.png',
        apple: '/favicons/favicon.png',
      },
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
