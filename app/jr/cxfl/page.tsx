import type { Metadata } from 'next';
import Link from 'next/link';
import CXFLCalculatorClient from './components/CXFLCalculatorClient';

export const metadata: Metadata = {
  title: "储蓄复利计算器 - 金融工具 | Actrue",
  description: "专业的储蓄复利计算器，支持定期定额投资的复利增长效果分析，帮助您对比有无复利情况下的投资回报。适用于储蓄规划、长期投资等场景。",
  keywords: "储蓄复利计算器, 储蓄复利, 定期投资, 复利增长, 金融计算, 投资回报, 财务规划",
  openGraph: {
    title: "储蓄复利计算器 - 金融工具 | Actrue",
    description: "专业的储蓄复利计算器，支持定期定额投资的复利增长效果分析，帮助您对比有无复利情况下的投资回报。适用于储蓄规划、长期投资等场景。",
    type: "website",
    locale: "zh_CN",
    siteName: "Actrue",
  },
};

export default function SavingsCompoundCalculatorPage() {
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
            储蓄复利计算器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            计算定期定额投资的复利增长效果，对比无复利情况
          </p>
        </div>

        <CXFLCalculatorClient />
      </div>
    </div>
  );
}