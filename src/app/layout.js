import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

import Providers from "./providers";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Aura Shop | Crafted Scents. Timeless Presence.",
  description: "A luxury perfume house crafting exquisite inspired scents, custom perfumes, samples, and gift sets. Explore the essence of elegance and timeless presence.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Providers>
          <Navbar />
          <main className="flex-grow w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
