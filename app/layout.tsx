import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  applicationName: "Bit-Chat",
  title: "Bit-Chat — AI in Your Browser",
  description:
    "Run a tiny LLM entirely in your browser using WebGPU. No server, no API key, no signup. 100% private.",
  metadataBase: new URL("https://bit-chat.vercel.app"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Bit-Chat — AI in Your Browser",
    description:
      "Run a tiny LLM entirely in your browser using WebGPU. No server, no API key, no signup. 100% private.",
    url: "https://bit-chat.vercel.app",
    siteName: "Bit-Chat",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Bit-Chat OpenGraph preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Bit-Chat — AI in Your Browser",
    description:
      "Run a tiny LLM entirely in your browser using WebGPU. No server, no API key, no signup. 100% private.",
    creator: "@somevyn",
    site: "@somevyn",
    images: [
      {
        url: "/og.png",
        alt: "Bit-Chat OpenGraph preview"
      }
    ]
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  },
  category: "technology"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#09090b"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-dvh bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
