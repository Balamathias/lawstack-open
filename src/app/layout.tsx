import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/query-provider";
import BackgroundFX from "@/components/background-fx";

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
    <html lang="en" className="h-full">
      <body
        className={cn(
          `h-full min-h-screen overflow-x-hidden antialiased bg-transparent selection:bg-purple-500/30 selection:text-white`,
          inter.className
        )}
      >
        {/* Granular Background System */}
        <div className="app-bg-root" />
        <div className="app-bg-anim" />
        <div className="app-bg-noise" />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.6),transparent_70%)]" />
        {/* Subtle vignette & edge glow */}
        <div className="pointer-events-none fixed inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.06),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.05),transparent_60%)]" />
        <QueryProvider>
          <main className="relative z-10">
            <BackgroundFX />
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
