import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "./providers";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AuraCart - Modern Premium E-Commerce Experience",
  description: "A highly-responsive, production-grade e-commerce platform. Discover trending products, enjoy smooth checkout options, and experience state-of-the-art navigation.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <Navbar />
          <main className="flex-grow w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
