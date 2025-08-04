'use client';

import { useState } from 'react';
import Link from 'next/link';
import Toast from '../../components/Toast';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function UrlNormalizerClient() {
  const [inputUrl, setInputUrl] = useState('');
  const [normalizedUrl, setNormalizedUrl] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // 关闭Toast
  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  // 规范化URL
  const normalizeUrl = () => {
    if (!inputUrl.trim()) {
      setError('请输入URL');
      return;
    }

    try {
      // 自动添加协议前缀
      let urlToProcess = inputUrl.trim();
      if (!urlToProcess.startsWith('http://') && !urlToProcess.startsWith('https://')) {
        urlToProcess = 'https://' + urlToProcess;
      }

      // 使用URL API进行规范化
      const url = new URL(urlToProcess);
      setNormalizedUrl(url.href);
      setError('');
    } catch (err) {
      setError('无效的URL格式');
      setNormalizedUrl('');
    }
  };

  // 复制到剪贴板
  const copyToClipboard = async () => {
    if (!normalizedUrl) {
      setToast({ show: true, message: '没有可复制的内容', type: 'error' });
      return;
    }

    try {
      await navigator.clipboard.writeText(normalizedUrl);
      setToast({ show: true, message: 'URL已复制到剪贴板', type: 'success' });
    } catch (err) {
      setToast({ show: true, message: '复制失败，请手动复制', type: 'error' });
    }
  };

  // 清空输入
  const handleClear = () => {
    setInputUrl('');
    setNormalizedUrl('');
    setError('');
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

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* 返回首页链接 */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
        </div>

        {/* 标题区域 */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            URL规范化工具
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            将URL转换为标准格式，自动处理协议和Punycode编码
          </p>
        </div>

        {/* 主要内容卡片 */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          {/* 输入区域 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              输入URL
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="请输入URL，例如：https://例子.com 或 例子.com"
              className="w-full p-2 border rounded mb-2"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={normalizeUrl}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              规范化URL
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
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
          {normalizedUrl && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  规范化结果
                </h3>
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  复制结果
                </button>
              </div>
              <div className="mt-4 p-3 bg-gray-100 rounded break-all">
                <code className="font-mono text-sm">{normalizedUrl}</code>
              </div>
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mt-8">
          <h2 className="text-2xl font-bold text-black mb-4">使用说明</h2>
          <div className="prose max-w-none text-gray-600">
            <h3 className="text-lg font-semibold text-gray-900">功能特点</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>自动添加协议前缀（默认为https://）</li>
              <li>使用浏览器原生URL API进行规范化</li>
              <li>自动处理包含中文字符的域名（转换为Punycode格式）</li>
              <li>实时验证URL有效性</li>
              <li>一键复制规范化后的URL</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-4">使用示例</h3>
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <p className="font-medium">输入：</p>
              <code className="block bg-white p-2 rounded mt-1">例子.com/测试</code>
              <p className="font-medium mt-3">输出：</p>
              <code className="block bg-white p-2 rounded mt-1">https://xn--fsq.com/%E6%B5%8B%E8%AF%95</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}