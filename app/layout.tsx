import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalHeader from "../src/components/全局导航头部";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Actrue - 工具平台",
  description: "Actrue是一个集成了实用工具的现代化平台，提供金融计算器、生活实用工具等在线工具。",
  keywords: "工具, 计算器, 金融工具, 实用工具, 在线工具, 编程, 开发",
  authors: [{ name: "Actrue" }],
  themeColor: "#1e293b",
  openGraph: {
    title: "Actrue - 工具平台",
    description: "Actrue是一个集成了实用工具的现代化平台，提供金融计算器、生活实用工具等在线工具。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-white text-black antialiased`}>
        <GlobalHeader />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}