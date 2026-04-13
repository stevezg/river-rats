import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "River Rats — Never Run a River Alone",
    template: "%s | River Rats",
  },
  description:
    "Find paddling partners at your skill level, check live river flows, and log your whitewater runs. The social platform for kayakers.",
  keywords: ["kayaking", "whitewater", "river", "paddling", "kayak", "rafting"],
  openGraph: {
    title: "River Rats — Never Run a River Alone",
    description:
      "Find paddling partners at your skill level, check live river flows, and log your whitewater runs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#0F1117] text-white">
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <div className="md:hidden">
            <BottomNav />
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
