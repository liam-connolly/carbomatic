import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

// Import Big Shoulders Display from Google Fonts via CSS
const bigShouldersDisplay = {
  variable: "--font-big-shoulders",
};

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Carbomatic - Marathon Carb Loading Calculator",
  description: "Calculate your marathon carb loading needs and get AI-generated meal plans with Claude",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={`${bigShouldersDisplay.variable} ${roboto.variable} antialiased`}
        style={{ fontFamily: 'var(--font-roboto)' }}
      >
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </body>
    </html>
  );
}
