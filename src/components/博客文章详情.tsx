'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '../../data/博客文章类型定义';
import { getCategoryById, getTagById } from '../../data/分类标签配置';
import { renderMarkdown, formatDate, getReadingProgress } from '../utils/博客工具函数';

interface BlogPostDetailProps {
  post: BlogPost;
}

/**
 * 博客文章详情组件
 */
export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 获取分类和标签信息
  const category = getCategoryById(post.category);
  const tags = post.tags.map(tagId => getTagById(tagId)).filter(Boolean);
  
  // 监听滚动进度
  useEffect(() => {
    const handleScroll = () => {
      const progress = getReadingProgress();
      setReadingProgress(progress);
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 渲染 Markdown 内容
  const htmlContent = renderMarkdown(post.content);
  
  return (
    <article className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>
      
      {/* 文章头部 */}
      <header className="relative">
        {/* 封面图片 */}
        {post.coverImage && (
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
            <img 
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        )}
        
        {/* 文章信息 */}
        <div className={`p-6 md:p-8 ${post.coverImage ? 'relative -mt-20' : ''}`}>
          {/* 分类标签 */}
          {category && (
            <Link
              href={`/blog/category/${category.id}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: `${category.color}20`,
                color: category.color,
                border: `1px solid ${category.color}40`
              }}
            >
              {category.name}
            </Link>
          )}
          
          {/* 文章标题 */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          
          {/* 文章描述 */}
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            {post.description}
          </p>
          
          {/* 文章元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            {/* 作者 */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {post.author.charAt(0)}
                </span>
              </div>
              <span>{post.author}</span>
            </div>
            
            {/* 发布日期 */}
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            
            {/* 阅读时间 */}
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readTime}分钟阅读</span>
            </div>
            
            {/* 更新日期 */}
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>更新于 {formatDate(post.updatedAt)}</span>
              </div>
            )}
          </div>
          
          {/* 标签 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.id}`}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200 transform hover:scale-105"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
      
      {/* 文章内容 */}
      <div className="px-6 md:px-8 pb-8">
        <div 
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
            prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:border-gray-700 prose-h2:pb-2
            prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-em:text-gray-300 prose-em:italic
            prose-code:text-pink-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg prose-pre:p-4
            prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-gray-800/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:my-6
            prose-blockquote:text-gray-300 prose-blockquote:italic
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:mb-1 prose-li:leading-relaxed
            prose-table:border-collapse prose-table:border prose-table:border-gray-700
            prose-th:border prose-th:border-gray-700 prose-th:bg-gray-800 prose-th:p-2 prose-th:text-white prose-th:font-semibold
            prose-td:border prose-td:border-gray-700 prose-td:p-2 prose-td:text-gray-300
            prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto
            prose-hr:border-gray-700 prose-hr:my-8
          "
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
      
      {/* 文章底部 */}
      <footer className="px-6 md:px-8 pb-6 border-t border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6">
          {/* 分享按钮 */}
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-sm">分享文章:</span>
            
            {/* Twitter 分享 */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            
            {/* 复制链接 */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                // 这里可以添加提示信息
              }}
              className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors duration-200"
              title="复制链接"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>
          
          {/* 返回按钮 */}
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>返回博客</span>
          </Link>
        </div>
      </footer>
      
      {/* 回到顶部按钮 */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 z-40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </article>
  );
}