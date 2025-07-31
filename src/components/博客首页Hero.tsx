'use client';

import { blogConfig } from '../../data/博客配置';

interface BlogHeroProps {
  stats: {
    totalPosts: number;
    totalCategories: number;
    totalTags: number;
    totalReadTime: number;
    averageReadTime: number;
  };
}

/**
 * 博客首页Hero区域组件
 * 展示博客标题、描述和统计信息
 */
export default function BlogHero({ stats }: BlogHeroProps) {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* 内容 */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          {/* 主标题 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
            {blogConfig.siteName}
          </h1>
          
          {/* 副标题 */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {blogConfig.siteDescription}
          </p>
          
          {/* 作者信息 */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4 bg-gray-50 rounded-full px-6 py-3 border border-gray-200">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {blogConfig.author.charAt(0)}
                </span>
              </div>
              <div className="text-left">
                <p className="text-black font-medium">{blogConfig.author}</p>
                <p className="text-gray-600 text-sm">技术博主 & 开发者</p>
              </div>
            </div>
          </div>
          
          {/* 统计信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <div className="text-3xl font-bold text-black mb-2">
                {stats.totalPosts}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                篇文章
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <div className="text-3xl font-bold text-black mb-2">
                {stats.totalCategories}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                个分类
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <div className="text-3xl font-bold text-black mb-2">
                {stats.totalTags}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                个标签
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <div className="text-3xl font-bold text-black mb-2">
                {Math.round(stats.totalReadTime / 60)}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                小时内容
              </div>
            </div>
          </div>
          
          {/* CTA按钮 */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200">
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              开始阅读
            </button>
            
            <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-gray-300 text-black font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200">
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              搜索文章
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}