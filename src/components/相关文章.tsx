'use client';

import Link from 'next/link';
import { BlogPost } from '../../data/博客文章类型定义';
import { getCategoryById } from '../../data/分类标签配置';
import { formatDate } from '../utils/博客工具函数';

interface RelatedPostsProps {
  posts: BlogPost[];
}

/**
 * 相关文章组件
 */
export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6 md:p-8">
      <div className="flex items-center mb-6">
        <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h2 className="text-2xl font-bold text-white">相关文章</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const category = getCategoryById(post.category);
          
          return (
            <article key={post.id} className="group">
              <Link href={`/blog/${post.id}`} className="block">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-600 hover:shadow-lg hover:shadow-blue-500/10 group-hover:transform group-hover:scale-105">
                  {/* 文章封面 */}
                  {post.coverImage ? (
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* 分类标签 */}
                      {category && (
                        <div className="absolute top-3 left-3">
                          <span 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${category.color}20`,
                              color: category.color,
                              border: `1px solid ${category.color}40`
                            }}
                          >
                            {category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-40 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-400 text-sm">{post.title}</p>
                      </div>
                      
                      {/* 分类标签 */}
                      {category && (
                        <div className="absolute top-3 left-3">
                          <span 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${category.color}20`,
                              color: category.color,
                              border: `1px solid ${category.color}40`
                            }}
                          >
                            {category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 文章信息 */}
                  <div className="p-4">
                    {/* 文章标题 */}
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                      {post.title}
                    </h3>
                    
                    {/* 文章摘要 */}
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    {/* 文章元信息 */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        {/* 发布日期 */}
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        
                        {/* 阅读时间 */}
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{post.readTime}分钟</span>
                        </div>
                      </div>
                      
                      {/* 阅读更多指示器 */}
                      <div className="flex items-center space-x-1 text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                        <span>阅读</span>
                        <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      
      {/* 查看更多文章 */}
      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>查看更多文章</span>
        </Link>
      </div>
    </section>
  );
}