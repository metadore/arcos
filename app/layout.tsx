import type { Metadata } from "next";
import "./globals.css";
import Scene from "./components/canvas/Scene";
import AnywhereDoor from "./components/ui/AnywhereDoor";
import CustomCursor from "./components/ui/CustomCursor";
import IdleEasterEgg from "./components/ui/IdleEasterEgg";
import VideoBackground from "./components/ui/VideoBackground";
import TransitionOverlay from "./components/ui/TransitionOverlay";
import PocketGadgets from "./components/ui/PocketGadgets";
import { Noto_Sans_JP, Dela_Gothic_One } from "next/font/google";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-jp" });
const delaGothic = Dela_Gothic_One({ subsets: ["latin"], weight: "400", variable: "--font-display" });

export const metadata: Metadata = {
  title: "Arcos | artismchemcoder",
  description: "Doraemon-themed interactive personal portfolio for Arcos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSansJP.variable} ${delaGothic.variable} font-jp antialiased relative min-h-screen text-white overflow-x-hidden`}>
        {/* Route-aware video background (client component) */}
        <VideoBackground />
        <TransitionOverlay />

        <CustomCursor />
        <AnywhereDoor />
        <Scene />
        <PocketGadgets />
        <IdleEasterEgg />

        <main className="relative z-10 w-full h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
