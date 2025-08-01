'use client';

// import Link from 'next/link';  // 移除未使用的导入

// 定义分类数据结构
interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface CategoryHeaderProps {
  category: Category;
  postCount: number;
}

/**
 * 分类页面头部组件
 */
export default function CategoryHeader({ category, postCount }: CategoryHeaderProps) {
  return (
    <header className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6 md:p-8">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white">分类: {category.name}</h1>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* 分类信息 */}
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            {/* 分类颜色指示器 */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20`, border: `2px solid ${category.color}` }}
            >
              <svg 
                className="w-6 h-6" 
                style={{ color: category.color }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {category.name}
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
          
          {/* 分类描述 */}
          {category.description && (
            <p className="text-lg text-gray-300 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
        
      </div>
      
      {/* 分类统计信息 */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{postCount}</div>
            <div className="text-sm text-gray-400">文章总数</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">-</div>
            <div className="text-sm text-gray-400">总阅读量</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">-</div>
            <div className="text-sm text-gray-400">平均评分</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">-</div>
            <div className="text-sm text-gray-400">订阅人数</div>
          </div>
        </div>
      </div>
    </header>
  );
}