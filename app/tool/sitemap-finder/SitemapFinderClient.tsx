'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Toast from '../../components/Toast';

interface SitemapResult {
  url: string;
  status: number;
  found: boolean;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

// 查询历史记录的数据结构
interface SearchHistoryItem {
  url: string;
  timestamp: number; // 时间戳
  foundCount: number; // 找到的sitemap数量
}

export default function SitemapFinderClient() {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SitemapResult[]>([]);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [showExample, setShowExample] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // 从localStorage加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('sitemapFinderHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // 验证数据结构
        if (Array.isArray(parsedHistory)) {
          setSearchHistory(parsedHistory);
        }
      } catch (e) {
        console.error('Failed to parse search history', e);
      }
    }
  }, []);

  // 保存搜索历史到localStorage
  const saveSearchHistory = (history: SearchHistoryItem[]) => {
    try {
      localStorage.setItem('sitemapFinderHistory', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save search history', e);
    }
  };

  // 常见的网站地图路径
  const sitemapPaths = [
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/sitemap.txt'
  ];

  // 验证URL格式
  const isValidUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // 检查单个URL是否存在
  const checkUrlExists = async (url: string): Promise<SitemapResult> => {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        headers: {
          'User-Agent': 'Sitemap-Finder-Tool'
        }
      });
      
      // 如果HEAD请求不被支持，尝试GET请求
      if (response.status === 405) {
        const getResponse = await fetch(url, { 
          method: 'GET',
          headers: {
            'User-Agent': 'Sitemap-Finder-Tool'
          }
        });
        return {
          url,
          status: getResponse.status,
          found: getResponse.ok
        };
      }
      
      return {
        url,
        status: response.status,
        found: response.ok
      };
    } catch {
      return {
        url,
        status: 0,
        found: false
      };
    }
  };

  // 解析robots.txt中的Sitemap声明
  const parseRobotsTxt = async (robotsUrl: string): Promise<string[]> => {
    try {
      const response = await fetch(robotsUrl);
      if (!response.ok) return [];
      
      const content = await response.text();
      const sitemapUrls: string[] = [];
      
      // 查找所有Sitemap声明
      const sitemapRegex = /^Sitemap:\s*(.+)$/gim;
      let match;
      
      while ((match = sitemapRegex.exec(content)) !== null) {
        const url = match[1].trim();
        if (url) {
          sitemapUrls.push(url);
        }
      }
      
      return sitemapUrls;
    } catch {
      return [];
    }
  };

  // 查找网站地图
  const findSitemaps = async () => {
    if (!inputUrl.trim()) {
      setError('请输入网站URL');
      return;
    }

    // 验证URL格式
    if (!isValidUrl(inputUrl)) {
      // 尝试添加协议
      const withHttp = `http://${inputUrl}`;
      const withHttps = `https://${inputUrl}`;
      
      if (isValidUrl(withHttp)) {
        setInputUrl(withHttp);
      } else if (isValidUrl(withHttps)) {
        setInputUrl(withHttps);
      } else {
        setError('请输入有效的URL');
        return;
      }
    }

    setIsLoading(true);
    setError('');
    setResults([]);
    
    try {
      const normalizedUrl = inputUrl.endsWith('/') ? inputUrl.slice(0, -1) : inputUrl;
      const results: SitemapResult[] = [];
      
      // 检查常见的网站地图路径
      for (const path of sitemapPaths) {
        const fullUrl = `${normalizedUrl}${path}`;
        const result = await checkUrlExists(fullUrl);
        results.push(result);
      }
      
      // 检查robots.txt中的Sitemap声明
      const robotsUrl = `${normalizedUrl}/robots.txt`;
      const sitemapUrls = await parseRobotsTxt(robotsUrl);
      
      // 检查robots.txt中声明的网站地图
      for (const sitemapUrl of sitemapUrls) {
        // 避免重复检查
        if (!results.some(r => r.url === sitemapUrl)) {
          const result = await checkUrlExists(sitemapUrl);
          results.push(result);
        }
      }
      
      setResults(results);
      
      // 只显示找到的网站地图
      const foundSitemaps = results.filter(r => r.found);
      setResults(foundSitemaps);
      
      // 保存搜索历史
      const newHistoryItem: SearchHistoryItem = {
        url: normalizedUrl,
        timestamp: Date.now(),
        foundCount: foundSitemaps.length
      };
      
      // 更新历史记录（限制最多保存50条记录）
      const updatedHistory = [newHistoryItem, ...searchHistory].slice(0, 50);
      setSearchHistory(updatedHistory);
      saveSearchHistory(updatedHistory);
      
      if (foundSitemaps.length === 0) {
        setToast({
          show: true,
          message: '未找到网站地图',
          type: 'info'
        });
      } else {
        setToast({
          show: true,
          message: `找到 ${foundSitemaps.length} 个网站地图`,
          type: 'success'
        });
      }
    } catch (_) {
      setError('查找过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 复制URL到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({
        show: true,
        message: 'URL已复制到剪贴板',
        type: 'success'
      });
    } catch {
      setToast({
        show: true,
        message: '复制失败，请手动复制',
        type: 'error'
      });
    }
  };

  // 关闭Toast
  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  // 清空输入
  const handleClear = () => {
    setInputUrl('');
    setResults([]);
    setError('');
  };

  // 清除搜索历史
  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('sitemapFinderHistory');
      setToast({
        show: true,
        message: '搜索历史已清除',
        type: 'success'
      });
    } catch (e) {
      console.error('Failed to clear search history', e);
      setToast({
        show: true,
        message: '清除搜索历史失败',
        type: 'error'
      });
    }
  };

  // 格式化时间显示
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toast通知 */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      
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

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            网站地图查找工具
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            快速查找网站的网站地图(sitemap.xml)
          </p>
        </div>

        {/* 主要内容卡片 */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          {/* 输入区域 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              网站URL
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="请输入网站URL，例如：https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 操作按钮 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={findSitemaps}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isLoading ? '查找中...' : '查找网站地图'}
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              清空
            </button>
          </div>
          
          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* 结果展示区域 */}
          {results.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                查找结果
              </h3>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 ${
                      result.found 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          result.found ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.url}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          状态码: {result.status || '无法访问'}
                        </p>
                      </div>
                      <div className="flex items-center ml-4">
                        {result.found ? (
                          <>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                              找到
                            </span>
                            <button
                              onClick={() => copyToClipboard(result.url)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            未找到
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 搜索历史 */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mt-8">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              搜索历史
            </h3>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${showHistory ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showHistory && (
            <div className="mt-4">
              {searchHistory.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      onClick={clearSearchHistory}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      清除历史记录
                    </button>
                  </div>
                  {searchHistory.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 border-gray-200 bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.url}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(item.timestamp)} • 找到 {item.foundCount} 个网站地图
                          </p>
                        </div>
                        <button
                          onClick={() => setInputUrl(item.url)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          重新搜索
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">暂无搜索历史</p>
              )}
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mt-8">
          <button
            onClick={() => setShowExample(!showExample)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              使用说明
            </h3>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${showExample ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showExample && (
            <div className="mt-4 space-y-4 text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">功能说明：</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>输入网站URL，自动查找常见的网站地图文件</li>
                  <li>检查网站robots.txt文件中的Sitemap声明</li>
                  <li>支持HTTP HEAD和GET请求方式检测</li>
                  <li>结果显示HTTP状态码，便于判断文件是否存在</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">支持的网站地图格式：</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>XML格式 (sitemap.xml, sitemap_index.xml)</li>
                  <li>纯文本格式 (sitemap.txt)</li>
                  <li>robots.txt中声明的自定义网站地图</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">使用步骤：</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>在输入框中输入网站的根URL（例如：https://example.com）</li>
                  <li>点击"查找网站地图"按钮开始查找</li>
                  <li>工具会自动检查以下位置：
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>/sitemap.xml</li>
                      <li>/sitemap_index.xml</li>
                      <li>/sitemap.txt</li>
                      <li>robots.txt文件中的Sitemap声明</li>
                    </ul>
                  </li>
                  <li>查找结果会显示每个网站地图的访问状态</li>
                  <li>点击"复制"按钮可以复制找到的网站地图URL</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}