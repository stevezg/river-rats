import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0F1117] text-white">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <div className="md:hidden">
          <BottomNav />
        </div>
        <Footer />
      </body>
    </html>
  );
}
