import type { Metadata } from 'next';
import Link from 'next/link';
import TimeCalculatorClient from './components/TimeCalculatorClient';

export const metadata: Metadata = {
  title: "周数进度计算器 - 时间工具 | Actrue",
  description: "查看当前年份周数进度与时间分布，帮助您规划年度工作和生活。显示当前周数、剩余周数和时间百分比。",
  keywords: "周数进度, 时间规划, 年度计划, 周数计算, 时间管理, 进度跟踪, 工作规划",
  openGraph: {
    title: "周数进度计算器 - 时间工具 | Actrue",
    description: "查看当前年份周数进度与时间分布，帮助您规划年度工作和生活。显示当前周数、剩余周数和时间百分比。",
    type: "website",
    locale: "zh_CN",
    siteName: "Actrue",
  },
};

export default function TimeCalculatorPage() {
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
            周数进度计算器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            查看当前年份周数进度与时间分布
          </p>
        </div>

        <TimeCalculatorClient />
      </div>
    </div>
  );
}