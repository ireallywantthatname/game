import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { NoiseBackground } from "@/components/NoiseBackground";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GAME",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-sans antialiased min-h-dvh text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <NoiseBackground />
        {children}
      </body>
    </html>
  );
}
