import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PROSEGUR - Incident Tracking Dashboard",
  description: "Sistema de seguimiento de incidentes de seguridad",
};

// Force dynamic rendering to prevent build-time static generation
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>
            <Layout>{children}</Layout>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
