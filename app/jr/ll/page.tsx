import type { Metadata } from 'next';
import Link from 'next/link';
import LLCalculatorClient from './components/LLCalculatorClient';

export const metadata: Metadata = {
  title: "利率计算器 - 金融工具 | Actrue",
  description: "专业的利率计算器，根据现值和终值计算所需利率，帮助您评估投资收益率。适用于贷款利率分析、投资回报评估等场景。",
  keywords: "利率计算器, 利率计算, 投资收益率, 金融计算, 贷款利率, 财务规划, 收益评估",
  openGraph: {
    title: "利率计算器 - 金融工具 | Actrue",
    description: "专业的利率计算器，根据现值和终值计算所需利率，帮助您评估投资收益率。适用于贷款利率分析、投资回报评估等场景。",
    type: "website",
    locale: "zh_CN",
    siteName: "Actrue",
  },
};

export default function RateCalculatorPage() {
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
            利率计算器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            根据现值和终值计算所需利率
          </p>
        </div>

        <LLCalculatorClient />
      </div>
    </div>
  );
}