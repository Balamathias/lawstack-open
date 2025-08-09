import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/query-provider";

const inter = Inter({ subsets: ["latin"], weight: ['100', '300', '400', '500', '600', '800'] });

export const metadata: Metadata = {
  title: "Lawstack Chats | Open Law Chat",
  description: "A chat application for law, are you an ABU Zaria student? You can access past questions, courses, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(`antialiased`, 'bg-gradient-to-tr from-black via-fuchsia-950 to-black min-h-screen relative', inter.className)}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
