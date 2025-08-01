'use client';

import { useState } from 'react';
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

export default function SitemapFinderPage() {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SitemapResult[]>([]);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

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
    } catch (error) {
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
      
      // 检查是否有找到的网站地图
      const foundSitemaps = results.filter(r => r.found);
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
    } catch (error) {
      setError('查找过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };

