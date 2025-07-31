// app/tools/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Actrue Tools - 实用工具集合',
  description: '提供各种实用的在线工具，包括金融计算器、生活实用工具、效率提升工具等，让您的生活更便捷。',
  keywords: '工具, 计算器, 金融工具, 实用工具, 在线工具, 效率工具',
  openGraph: {
    title: 'Actrue Tools - 实用工具集合',
    description: '提供各种实用的在线工具，包括金融计算器、生活实用工具、效率提升工具等，让您的生活更便捷。',
    type: 'website',
  },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 返回首页按钮 */}
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

      {/* 页面标题 */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          Actrue Tools
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          实用工具集合，让您的生活更便捷
        </p>
      </div>

      {/* 工具分类 */}
      <div className="max-w-6xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        {/* 金融工具 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            金融计算工具
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 金融计算器主页 */}
            <Link
              href="/jr"
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                金融计算器集合
              </h3>
              <p className="text-gray-600 text-sm">
                现值、终值、复利、储蓄复利、利率计算器等专业金融工具
              </p>
            </Link>
          </div>
        </div>

        {/* 生活工具 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            生活实用工具
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 饮水量计算器 */}
            <Link
              href="/life/drinkwater"
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                饮水量计算器
              </h3>
              <p className="text-gray-600 text-sm">
                基于科学公式，计算您的个人每日最佳饮水量
              </p>
            </Link>
          </div>
        </div>

        {/* 效率工具 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            效率提升工具
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 时间工具 */}
            <Link
              href="/time"
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                时间工具
              </h3>
              <p className="text-gray-600 text-sm">
                查看当前年份周数进度与时间分布
              </p>
            </Link>

            {/* Base64订阅链接转换器 */}
            <Link
              href="/tool/base64-converter"
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <div className="text-white text-lg">🎬</div>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                订阅链接转换器
              </h3>
              <p className="text-gray-600 text-sm">
                将Base64编码的订阅链接转换为Clash格式节点URL
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

