import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "Life & Tech Journal — Stories That Inspire. Technology That Empowers.",
    template: "%s | Life & Tech Journal",
  },
  description: "Explore life lessons, career journeys, personal growth stories, AI innovations, technology trends, and practical insights.",
  metadataBase: new URL("https://lifetechjournal.com"),
  openGraph: { siteName: "Life & Tech Journal", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {/* AuthProvider silently refreshes the JWT every 14 minutes */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}