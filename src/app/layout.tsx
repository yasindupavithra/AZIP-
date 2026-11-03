import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AZip Store | Educational Materials & Electronics - Kandy",
  description: "Your one-stop shop for educational materials, stationery, and electronics in Kandy, Sri Lanka. Books, pens, school supplies, calculators, headphones, and more.",
  keywords: ["AZip Store", "Kandy", "stationery", "electronics", "school supplies", "Sri Lanka"],
  icons: {
    icon: "/favicon.ico",
    apple: "/azip-logo.png",
  },
};

import { LanguageProvider } from "@/lib/languageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: '*, *::before, *::after { border-radius: 0px !important; }',
          }}
        />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
