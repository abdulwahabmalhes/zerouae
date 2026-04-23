import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { LanguageProvider } from "@/lib/context/LanguageContext";

export const metadata: Metadata = {
  title: {
    default: "ZORO UAE — Buy & Sell Everything in the Emirates",
    template: "%s | ZORO UAE",
  },
  description:
    "ZORO UAE is the leading classified ads marketplace in the United Arab Emirates. Buy and sell cars, real estate, electronics, jobs, and more.",
  keywords: ["UAE classifieds", "Dubai ads", "Abu Dhabi marketplace", "buy sell UAE", "Zoro UAE"],
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://zorouae.com",
    siteName: "ZORO UAE",
    title: "ZORO UAE — Buy & Sell Everything in the Emirates",
    description: "The UAE's #1 classified ads platform.",
  },
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
