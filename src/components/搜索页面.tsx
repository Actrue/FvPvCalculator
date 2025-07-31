'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchPosts, getAllPosts, getPostStats } from '../../data/posts';
import { getAllCategories, getAllTags } from '../../data/分类标签配置';
import { BlogPost } from '../../data/博客文章类型定义';
import BlogPostList from './博客文章列表';
import BlogSidebar from './博客侧边栏';
import { highlightSearchTerm } from '../utils/博客工具函数';

/**
 * 搜索页面组件
 */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'readTime'>('relevance');
  
  // 获取数据
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();
  const stats = getPostStats();
  
  // 从 URL 参数获取初始搜索词
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedTag(tag);
    
    if (query) {
      performSearch(query, category, tag);
    }
  }, [searchParams]);
  
  // 从本地存储加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem('blog-search-history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);
  
  // 执行搜索
  const performSearch = async (query: string, category?: string, tag?: string) => {
    if (!query.trim() && !category && !tag) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      let results = query.trim() ? searchPosts(query) : allPosts;
      
      // 按分类过滤
      if (category) {
        results = results.filter(post => post.category === category);
      }
      
      // 按标签过滤
      if (tag) {
        results = results.filter(post => post.tags.includes(tag));
      }
      
      // 排序
      results = sortResults(results, sortBy);
      
      setSearchResults(results);
      
      // 保存搜索历史
      if (query.trim()) {
        saveSearchHistory(query);
      }
    } catch (error) {
      console.error('搜索出错:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // 排序结果
  const sortResults = (results: BlogPost[], sortType: string) => {
    switch (sortType) {
      case 'date':
        return [...results].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      case 'readTime':
        return [...results].sort((a, b) => a.readTime - b.readTime);
      case 'relevance':
      default:
        return results; // 搜索结果已经按相关性排序
    }
  };
  
  // 保存搜索历史
  const saveSearchHistory = (query: string) => {
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('blog-search-history', JSON.stringify(newHistory));
  };
  
  // 处理搜索提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL();
    performSearch(searchQuery, selectedCategory, selectedTag);
  };
  
  // 更新 URL
  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTag) params.set('tag', selectedTag);
    
    const queryString = params.toString();
    const newURL = queryString ? `/blog/search?${queryString}` : '/blog/search';
    router.push(newURL);
  };
  
  // 清除搜索
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    setSearchResults([]);
    router.push('/blog/search');
  };
  
  // 删除搜索历史项
  const removeFromHistory = (query: string) => {
    const newHistory = searchHistory.filter(h => h !== query);
    setSearchHistory(newHistory);
    localStorage.setItem('blog-search-history', JSON.stringify(newHistory));
  };
  
  // 计算搜索统计
  const searchStats = useMemo(() => {
    const hasQuery = searchQuery.trim();
    const hasFilters = selectedCategory || selectedTag;
    const resultCount = searchResults.length;
    
    return {
      hasQuery,
      hasFilters,
      resultCount,
      totalPosts: allPosts.length
    };
  }, [searchQuery, selectedCategory, selectedTag, searchResults.length, allPosts.length]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* 搜索头部 */}
        <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6 md:p-8 mb-8">
          {/* 面包屑导航 */}
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
            <Link href="/blog" className="hover:text-white transition-colors duration-200">
              博客首页
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">搜索文章</span>
          </nav>
          
          {/* 页面标题 */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">搜索文章</h1>
              <p className="text-gray-400 mt-1">在 {allPosts.length} 篇文章中查找您感兴趣的内容</p>
            </div>
          </div>
          
          {/* 搜索表单 */}
          <form onSubmit={handleSearch} className="space-y-4">
            {/* 主搜索框 */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索文章标题、内容、标签..."
                className="w-full px-4 py-3 pl-12 pr-12 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* 过滤器 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 分类过滤 */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              {/* 标签过滤 */}
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有标签</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    #{tag.name}
                  </option>
                ))}
              </select>
              
              {/* 排序方式 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">按相关性</option>
                <option value="date">按发布时间</option>
                <option value="readTime">按阅读时间</option>
              </select>
            </div>
            
            {/* 搜索按钮 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSearching}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>搜索中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>搜索</span>
                  </>
                )}
              </button>
              
              {(searchStats.hasQuery || searchStats.hasFilters) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  清除
                </button>
              )}
            </div>
          </form>
          
          {/* 搜索历史 */}
          {searchHistory.length > 0 && !searchStats.hasQuery && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">搜索历史</h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((query, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-gray-700 rounded-full px-3 py-1">
                    <button
                      onClick={() => {
                        setSearchQuery(query);
                        performSearch(query, selectedCategory, selectedTag);
                      }}
                      className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {query}
                    </button>
                    <button
                      onClick={() => removeFromHistory(query)}
                      className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 搜索结果 */}
          <div className="lg:col-span-3">
            {/* 搜索统计 */}
            {(searchStats.hasQuery || searchStats.hasFilters) && (
              <div className="mb-6">
                <p className="text-gray-400">
                  {searchStats.resultCount > 0 ? (
                    <>找到 <span className="text-white font-semibold">{searchStats.resultCount}</span> 篇相关文章</>
                  ) : (
                    '未找到相关文章'
                  )}
                  {searchStats.hasQuery && (
                    <> 关键词: <span className="text-blue-400 font-medium">"{searchQuery}"</span></>
                  )}
                </p>
              </div>
            )}
            
            {/* 搜索结果列表 */}
            {searchResults.length > 0 ? (
              <BlogPostList posts={searchResults} searchQuery={searchQuery} />
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
                {searchStats.hasQuery || searchStats.hasFilters ? (
                  <>
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">未找到相关文章</h3>
                    <p className="text-gray-400 mb-6">
                      尝试使用不同的关键词或调整筛选条件
                    </p>
                    <button
                      onClick={clearSearch}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>重新搜索</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">开始搜索</h3>
                    <p className="text-gray-400">
                      输入关键词来搜索文章，或使用上方的筛选器浏览特定分类和标签的文章
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <BlogSidebar 
              categories={categories}
              tags={tags}
              stats={stats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}