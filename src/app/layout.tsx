import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], weight: ['100', '300', '400', '500', '600', '800'] });

export const metadata: Metadata = {
  title: "Lawstack Chats",
  description: "A chat application for law",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(`antialiased`, 'bg-gradient-to-tr from-black via-orange-950 to-black min-h-screen relative', inter.className)}
      >
        {children}
      </body>
    </html>
  );
}
