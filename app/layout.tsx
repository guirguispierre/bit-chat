import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Bit-Chat — AI in Your Browser",
  description:
    "Run a tiny LLM entirely in your browser using WebGPU. No server, no API key, no signup. 100% private.",
  metadataBase: new URL("https://bit-chat.vercel.app"),
  openGraph: {
    title: "Bit-Chat — AI in Your Browser",
    description:
      "Run a tiny LLM entirely in your browser using WebGPU. No server, no API key, no signup. 100% private.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Bit-Chat OpenGraph preview"
      }
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover"
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
