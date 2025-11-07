import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";
import CookieConsent from "@/components/cookie-consent";
import ScrollToTop from "@/components/scroll-to-top";

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
          <Navbar />
          {children}
          <Newsletter />
          <Footer />
          <CookieConsent />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
