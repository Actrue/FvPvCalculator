// pages/index.tsx
import Link from 'next/link'; // 使用 Next.js 原生的 Link 组件
import { FC } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '金融计算器工具集合 - Actrue',
  description: '提供各种金融计算器工具，包括现值计算器、终值计算器、复利计算器、储蓄复利计算器和利率计算器，帮助您进行金融计算和规划。',
  keywords: '金融计算器, 现值计算器, 终值计算器, 复利计算器, 储蓄复利计算器, 利率计算器',
  authors: [{ name: 'Actrue' }],
  themeColor: '#1e293b',
  openGraph: {
    title: '金融计算器工具集合 - Actrue',
    description: '提供各种金融计算器工具，包括现值计算器、终值计算器、复利计算器、储蓄复利计算器和利率计算器，帮助您进行金融计算和规划。',
    type: 'website',
    locale: 'zh_CN',
  },
};

const HomePage: FC = () => {
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

      {/* 头部区域 */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-6">
            金融计算器工具集合
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 现值计算器卡片 */}
        <Link
          href="/jr/xz"
          className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
        >
          <div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">现值计算器</h2>
            <p className="text-gray-600 text-sm mb-4">
              计算资金当前价值，支持复利现值计算
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">金融</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">计算</span>
            </div>
          </div>
          <div className="flex items-center text-black font-medium mt-4">
            立即使用
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* 终值计算器卡片 */}
        <Link
          href="/jr/zz"
          className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
        >
          <div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">终值计算器</h2>
            <p className="text-gray-600 text-sm mb-4">
              预测资金未来价值，支持复利终值计算
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">金融</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">计算</span>
            </div>
          </div>
          <div className="flex items-center text-black font-medium mt-4">
            立即使用
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* 复利计算器卡片 */}
        <Link
          href="/jr/fl"
          className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
        >
          <div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm8-12V5a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2v2M9 5a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m-4-4h4m0 0v4m0-4l-4 4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">复利计算器</h2>
            <p className="text-gray-600 text-sm mb-4">
              计算复利增长效果，支持不同复利次数
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">金融</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">计算</span>
            </div>
          </div>
          <div className="flex items-center text-black font-medium mt-4">
            立即使用
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        {/* 新增：储蓄复利计算器卡片 */}
        <Link
          href="/jr/cxfl"
          className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
        >
          <div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">储蓄复利计算器</h2>
            <p className="text-gray-600 text-sm mb-4">
              计算定期定额投资的复利增长效果，对比无复利情况
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">金融</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">计算</span>
            </div>
          </div>
          <div className="flex items-center text-black font-medium mt-4">
            立即使用
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* 新增：利率计算器卡片 */}
        <Link
          href="/jr/ll"
          className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
        >
          <div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm8-12V5a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2v2M9 5a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m-4-4h4m0 0v4m0-4l-4 4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">利率计算器</h2>
            <p className="text-gray-600 text-sm mb-4">
              根据现值和终值计算所需利率
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">金融</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">计算</span>
            </div>
          </div>
          <div className="flex items-center text-black font-medium mt-4">
            立即使用
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* 周数进度卡片 */}
        <Link
          href="/jr/time"
          className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
        >
          <div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">周数进度</h2>
            <p className="text-gray-600 text-sm mb-4">
              查看当前年份周数进度与时间分布
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">时间</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">进度</span>
            </div>
          </div>
          <div className="flex items-center text-black font-medium mt-4">
            立即使用
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
        </div>
      </div>
    
  );
};

export default HomePage;