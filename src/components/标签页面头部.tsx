'use client';

// import Link from 'next/link';  // 移除未使用的导入

// 定义标签数据结构
interface Tag {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface TagHeaderProps {
  tag: Tag;
  postCount: number;
}

/**
 * 标签页面头部组件
 */
export default function TagHeader({ tag, postCount }: TagHeaderProps) {
  return (
    <header className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6 md:p-8">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white">标签: #{tag.name}</h1>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* 标签信息 */}
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            {/* 标签图标 */}
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                #{tag.name}
              </h1>
              
              {/* 文章数量 */}
              <div className="flex items-center space-x-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{postCount} 篇文章</span>
              </div>
            </div>
          </div>
          
          {/* 标签描述 */}
          {tag.description && (
            <p className="text-lg text-gray-300 leading-relaxed">
              {tag.description}
            </p>
          )}
        </div>
        
      </div>
      
      {/* 标签统计信息 */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{postCount}</div>
            <div className="text-sm text-gray-400">文章总数</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">-</div>
            <div className="text-sm text-gray-400">使用频率</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">-</div>
            <div className="text-sm text-gray-400">关注人数</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">-</div>
            <div className="text-sm text-gray-400">热度指数</div>
          </div>
        </div>
      </div>
      
      {/* 相关标签推荐 */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          相关标签
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {/* 这里可以添加相关标签的逻辑 */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-400">
            暂无相关标签
          </span>
        </div>
      </div>
    </header>
  );
}