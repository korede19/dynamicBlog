import type { Metadata } from "next";
import { Encode_Sans_Condensed, Lato } from "next/font/google";
import "./globals.css";

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${encodeSans.variable} ${lato.variable}`}>
      <body className={encodeSans.className}>
        {children}
      </body>
    </html>
  );
}