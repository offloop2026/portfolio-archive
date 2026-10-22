import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "김유리 — Yuri Kim (glass.gkim)",
  description: "Independent fine art, sound, video, and installation archive of Yuri Kim (glass.gkim).",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="w-full antialiased md:h-full md:overflow-hidden">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="w-full bg-white text-black selection:bg-black selection:text-white md:h-full md:overflow-hidden">
        {children}
      </body>
    </html>
  );
}

