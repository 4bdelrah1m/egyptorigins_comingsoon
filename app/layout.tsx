import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Egypt Origin — Private Egypt Travel Atelier",
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "Travel",
  creator: siteConfig.name,
  keywords: [
    "Egypt travel",
    "private Egypt tours",
    "luxury Egypt itinerary",
    "Egypt travel atelier",
    "Giza",
    "Luxor",
    "Nile",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: "Egypt Origin — Private Egypt Travel Atelier",
    description: siteConfig.description,
    images: [
      {
        url: "/images/og-giza.webp",
        width: 1200,
        height: 630,
        alt: "The pyramids of Giza in black and white",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Egypt Origin — Private Egypt Travel Atelier",
    description: siteConfig.description,
    images: ["/images/og-giza.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f1ea",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full bg-paper text-ink antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
