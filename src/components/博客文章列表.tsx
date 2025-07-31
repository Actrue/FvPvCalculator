'use client';

import Link from 'next/link';
import { BlogPost } from '../../data/博客文章类型定义';
import { getCategoryById, getTagsByIds } from '../../data/分类标签配置';
import { formatDate } from '../utils/博客工具函数';

interface BlogPostListProps {
  posts: BlogPost[];
  showExcerpt?: boolean;
}

/**
 * 博客文章列表组件
 * 展示文章卡片列表
 */
export default function BlogPostList({ posts, showExcerpt = true }: BlogPostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-300 mb-2">暂无文章</h3>
        <p className="text-gray-500">还没有发布任何文章，敬请期待！</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => {
        const category = getCategoryById(post.category);
        const tags = getTagsByIds(post.tags);
        
        return (
          <article 
            key={post.id} 
            className="group bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:bg-white/10 hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {/* 文章封面 */}
            {post.coverImage && (
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
            )}
            
            <div className="p-6">
              {/* 分类和日期 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {category && (
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  )}
                  <span className="text-gray-400 text-sm">
                    {formatDate(post.publishDate)}
                  </span>
                </div>
                
                {post.readTime && (
                  <div className="flex items-center text-gray-400 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readTime}分钟
                  </div>
                )}
              </div>
              
              {/* 文章标题 */}
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                <Link href={`/blog/${post.id}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              
              {/* 文章摘要 */}
              {showExcerpt && post.excerpt && (
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              
              {/* 标签 */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag.id}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
                    >
                      #{tag.name}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-400">
                      +{tags.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              {/* 作者和阅读更多 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">{post.author}</span>
                </div>
                
                <Link 
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium group-hover:translate-x-1 transition-all duration-200"
                >
                  阅读更多
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}