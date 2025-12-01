import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import "./globals.css";

// Primary SaaS font: Inter
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Job Notifier · Dashboard",
  description:
    "Serious job tracking with a clean, fast, SaaS-grade dashboard UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="ui-page-shell flex min-h-screen flex-col">
          <Header />
          {/* <-- change here: make main a centering flex container */}
          <main className="flex-1 flex items-center justify-center">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
