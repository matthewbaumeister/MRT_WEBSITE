import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Make Ready Consulting - Strategic Solutions for Government Success",
  description: "Veteran-owned company providing strategic solutions for US Government. Services include AI, Program Management, Geospatial Science, IT Support, Data Analytics, and Corporate Support.",
  keywords: ["government consulting", "veteran owned", "AI solutions", "program management", "geospatial science", "DoD", "intelligence community"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

