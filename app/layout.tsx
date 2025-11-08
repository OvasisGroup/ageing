import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ConditionalLayout from "@/components/conditional-layout";
import CookieConsent from "@/components/cookie-consent";
import ScrollToTop from "@/components/scroll-to-top";
import { Toaster } from "react-hot-toast";
import PWAInstallPrompt from "@/components/pwa-install-prompt";

export const metadata: Metadata = {
  title: "MyNestShield - Aging Care Platform",
  description: "Professional aging care services platform connecting caregivers with those in need of compassionate, quality care.",
  keywords: ["aging care", "elderly care", "caregivers", "home care", "medical care", "companionship"],
  authors: [{ name: "MyNestShield" }],
  creator: "MyNestShield",
  publisher: "MyNestShield",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MyNestShield",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "MyNestShield",
    title: "MyNestShield - Aging Care Platform",
    description: "Professional aging care services platform connecting caregivers with those in need of compassionate, quality care.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyNestShield - Aging Care Platform",
    description: "Professional aging care services platform connecting caregivers with those in need of compassionate, quality care.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="application-name" content="MyNestShield" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MyNestShield" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0066cc" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="work-sans">
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <CookieConsent />
          <ScrollToTop />
          <PWAInstallPrompt />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
              success: {
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(142 76% 36%)',
                },
                iconTheme: {
                  primary: 'hsl(142 76% 36%)',
                  secondary: 'hsl(var(--background))',
                },
              },
              error: {
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--destructive))',
                },
                iconTheme: {
                  primary: 'hsl(var(--destructive))',
                  secondary: 'hsl(var(--background))',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
