import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MusicProvider } from "@/components/MusicProvider";
import { ThemeProvider } from "@/components/ThemeProvider"; // 👈 召喚主題引擎
import CustomCursor from "@/components/CustomCursor"; // 👈 全站共用自訂游標（常駐不重掛）
import ClickRipple from "@/components/ClickRipple"; // 👈 水滴漣漪點擊特效

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sunshine's Space",
  description: "Personal Frequency / 03.18",
  alternates: {
    types: {
      "application/rss+xml": "/api/rss",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomCursor />
        <ClickRipple />
        {/* 👇 把主題引擎套在最外面，包住音樂引擎和整個網站！ */}
        <ThemeProvider>
          <MusicProvider>
            {children}
          </MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}