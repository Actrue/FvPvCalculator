import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero区域 */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-black mb-6">
              Actrue
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              专业的工具集合平台
            </p>
            <p className="text-lg text-gray-500 mb-12">
              提升您的工作效率
            </p>
          </div>
        </div>
      </div>

      {/* 主要模块区域 */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          <Link
            href="/tools"
            className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">
                Actrue Tool
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                专业的工具集合平台，包含金融计算器、生活工具、时间管理等多种实用工具
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-sm">金融计算</span>
                <span className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-sm">生活工具</span>
                <span className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-sm">效率工具</span>
              </div>
              <div className="flex items-center text-black font-medium">
                探索工具
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 特色功能介绍 */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-black mb-12">为什么选择 Actrue？</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">专业可靠</h3>
              <p className="text-gray-600">基于权威公式和最佳实践，确保工具的准确性和实用性</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">简洁高效</h3>
              <p className="text-gray-600">现代化的界面设计，专注于用户体验和操作效率</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">开源分享</h3>
              <p className="text-gray-600">开放源码，分享知识，与开发者社区共同成长</p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="text-center text-gray-500 py-8">
        <p>© 2024 Actrue. 专业工具平台</p>
      </div>
    </div>
  );
}