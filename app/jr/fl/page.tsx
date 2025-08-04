import type { Metadata } from 'next';
import Link from 'next/link';
import FLCalculatorClient from './components/FLCalculatorClient';

export const metadata: Metadata = {
  title: "复利计算器 - 金融工具 | Actrue",
  description: "专业的复利计算器，支持不同复利次数计算，帮助您评估复利增长效果。适用于投资收益分析、财务规划等场景。",
  keywords: "复利计算器, 复利计算, 利息计算, 金融计算, 投资收益, 财务规划, 复利增长",
  openGraph: {
    title: "复利计算器 - 金融工具 | Actrue",
    description: "专业的复利计算器，支持不同复利次数计算，帮助您评估复利增长效果。适用于投资收益分析、财务规划等场景。",
    type: "website",
    locale: "zh_CN",
    siteName: "Actrue",
  },
};

export default function CompoundCalculatorPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 返回首页链接 */}
      <div className="p-4">
        <Link
          href="/"
          className="inline-flex items-center text-black hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-6">
            复利计算器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            计算复利增长效果，支持不同复利次数
          </p>
        </div>

        <FLCalculatorClient />
      </div>
    </div>
  );
}