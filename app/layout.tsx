import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ConditionalLayout from "@/components/conditional-layout";
import CookieConsent from "@/components/cookie-consent";
import ScrollToTop from "@/components/scroll-to-top";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Aging Platform",
  description: "Advanced aging analysis and management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="work-sans">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <CookieConsent />
          <ScrollToTop />
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
