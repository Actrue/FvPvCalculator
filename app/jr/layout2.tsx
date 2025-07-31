// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; // 全局样式已移至 CSS 文件
import Link from "next/link";
import type { Metadata } from "next";


// 字体配置
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// 全局元数据
export const metadata: Metadata = {
  title: "金融计算器工具",
  description: "专业的复利、现值、终值计算工具",
  keywords: ["金融计算", "复利计算", "现值终值"],
  themeColor: "#2563EB",
  openGraph: {
    title: "金融计算器工具",
    description: "专业的复利、现值、终值计算工具",
    images: "https://your-site.com/og-image.png",
    url: "https://jrjsq.sereniblue.com",
    siteName: "金融计算器",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        <link rel="icon" href="/icons8-a-96.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} 
          antialiased bg-gray-50 min-h-screen 
          text-gray-900 transition-colors duration-300`}
      >
        {/* 顶部导航栏 */}
        <header className="fixed top-0 left-0 w-full z-50">
          <nav className="bg-white shadow-md px-4 py-3">
            <div className="container mx-auto flex items-center justify-between">
              <a href="/jr" className="text-2xl font-bold text-blue-600">
                金融计算器
              </a>
              <div className="hidden md:flex space-x-6 items-center">
                <Link
                  href="/jr/xz"
                  className="text-gray-600 hover:text-blue-500 transition"
                >
                  现值计算
                </Link>
                <Link
                  href="/jr/zz"
                  className="text-gray-600 hover:text-blue-500 transition"
                >
                  终值计算
                </Link>
                <Link
                  href="/jr/fl"
                  className="text-gray-600 hover:text-blue-500 transition"
                >
                  复利计算
                </Link>
                <Link
                  href="/jr/cxfl"
                  className="text-gray-600 hover:text-blue-500 transition"
                >
                  储蓄复利
                </Link>
                <Link
                  href="/jr/time"
                  className="text-gray-600 hover:text-blue-500 transition"
                >
                  周数进度
                </Link>
                <Link
                  href="/jr/ll"
                  className="text-gray-600 hover:text-blue-500 transition"
                >
                  利率计算
                </Link>
                
              </div>
              {/* 移动端菜单按钮 */}
              <button className="md:hidden text-gray-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
        </header>

        {/* 主要内容区域 */}
        <main className="pt-16 pb-24 px-4 md:px-8">
          {children}
        </main>

        {/* 底部页脚 */}
        <footer className="bg-gray-50 mt-8 p-4 text-center text-gray-500 text-sm">
          <p>© 2025 金融计算器工具 | 
            <a href="#" className="text-blue-600 hover:underline">
              隐私政策
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}