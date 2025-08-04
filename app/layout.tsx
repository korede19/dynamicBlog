import type { Metadata } from "next";
import { Encode_Sans_Condensed } from "next/font/google";
import "./globals.css";
import MegaMenu from "@/components/megaMenu";
import Script from "next/script";

const encodeSans = Encode_Sans_Condensed({ 
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"], // Only keep weights you actually use
  variable: '--font-encode-sans',
  display: 'swap', // Prevent layout shift
  preload: true,
});
export const metadata: Metadata = {
  title: "PeakPurzuit",
  description: "PeakPurzuit delivers straight-talking fitness and nutrition advice—no fluff, just results. Get science-backed workout plans, diet tips, and gym hacks to train smarter and eat better. For lifters, athletes, and beginners who want real progress.",
  // 🚀 MOVED: Meta tags to proper metadata object
  other: {
    "monetag": "7bbdcbb2baafcde4d49d37f6d395afd6"
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={encodeSans.variable}>
      <body className={encodeSans.className}>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6031925946912275"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RV6NGH4RBE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RV6NGH4RBE');
          `}
        </Script>

        {/* App UI */}
        <MegaMenu />
        <main>{children}</main>
      </body>
    </html>
  );
}