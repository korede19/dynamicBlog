import type { Metadata } from "next";
import { Encode_Sans_Condensed, Lato } from "next/font/google";
import "./globals.css";
import MegaMenu from "@/components/megaMenu";
import Script from "next/script";

const encodeSans = Encode_Sans_Condensed({ 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-encode-sans',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ["100", "300", "400", "700", "900"],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: "PeakPurzuit",
  description: "PeakPurzuit delivers straight-talking fitness and nutrition advice—no fluff, just results. Get science-backed workout plans, diet tips, and gym hacks to train smarter and eat better. For lifters, athletes, and beginners who want real progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${encodeSans.variable} ${lato.variable}`}>
      <meta name="monetag" content="7bbdcbb2baafcde4d49d37f6d395afd6"></meta>
      <body className={encodeSans.className}>
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
        <main>
          {children}
        </main>
        <Script id="infolinks-config" strategy="beforeInteractive">
          {`var infolinks_pid = 3438518; var infolinks_wsid = 0;`}
        </Script>

        {/* Infolinks loader script */}
        <Script
          src="//resources.infolinks.com/js/infolinks_main.js"
          strategy="beforeInteractive"
        />
        <script type='text/javascript' src='//pl27242710.profitableratecpm.com/66/50/8a/66508a9c4445f297d8c780783f876255.js'></script>
        <script async={true} data-cfasync="false" src="//pl27261617.profitableratecpm.com/cf13a514ad8f0327c56109e0993b42c4/invoke.js"></script>
<div id="container-cf13a514ad8f0327c56109e0993b42c4"></div>
<Script id="ad-options" strategy="beforeInteractive">
  {`
    atOptions = {
      key: '513143e2bd3c79f09c6bc05d8edf528b',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {}
    };
  `}
</Script>
<Script
  src="//www.highperformanceformat.com/513143e2bd3c79f09c6bc05d8edf528b/invoke.js"
  strategy="beforeInteractive"
/>
      </body>
    </html>
  );
}
