'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DomainCheckResponse {
  domain: string;
  available: boolean;
}

interface FindFirstAvailableResponse {
  domain: string | null;
}

const domains = [
  'https://z-lib.gd',
  'https://1lib.sk',
  'https://z-lib.fm',
  'https://z-lib.gl',
  'https://z-lib.fo',
  'https://z-library.sk',
  'https://zh.z-library.ec'
];

export default function ZLibraryRedirectClient() {
  const [domainStatuses, setDomainStatuses] = useState<{ domain: string; status: 'checking' | 'available' | 'unavailable' | 'error' }[]>(domains.map(domain => ({ domain, status: 'checking' })));
  const [firstAvailableDomain, setFirstAvailableDomain] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [redirected, setRedirected] = useState<boolean>(false);

  useEffect(() => {
    const checkDomains = async () => {
      for (let i = 0; i < domains.length; i++) {
        if (redirected) break;
        const domain = domains[i];
        try {
          const response = await fetch(`/api/zlibrary/check-domain?domain=${encodeURIComponent(domain)}`);
          const data: DomainCheckResponse = await response.json();
          const available = data.available;
          if (redirected) break;
          setDomainStatuses(prev => prev.map((item, index) => index === i ? { ...item, status: available ? 'available' : 'unavailable' } : item));
          if (available && !redirected) {
            setFirstAvailableDomain(domain);
            setRedirected(true);
            const timer = setInterval(() => {
              setCountdown(prev => {
                if (prev <= 1) {
                  clearInterval(timer);
                  window.location.href = domain;
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
            break;
          }
        } catch (error) {
          if (redirected) break;
          setDomainStatuses(prev => prev.map((item, index) => index === i ? { ...item, status: 'error' } : item));
        }
      }
      if (!redirected) {
        // 如果所有域名都检查完毕仍未找到可用域名，则显示错误信息
        // 这里可以添加错误处理逻辑
      }
    };

    checkDomains();
  }, [redirected]);

  const getStatusColor = (status: 'checking' | 'available' | 'unavailable' | 'error') => {
    switch (status) {
      case 'checking': return 'bg-gray-500';
      case 'available': return 'bg-green-500';
      case 'unavailable': return 'bg-red-500';
      case 'error': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: 'checking' | 'available' | 'unavailable' | 'error') => {
    switch (status) {
      case 'checking': return '检查中...';
      case 'available': return '可用 ✔';
      case 'unavailable': return '不可用 ✘';
      case 'error': return '检查失败';
      default: return '检查中...';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="inline-block mb-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition">
        ← 返回首页
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🔍 域名检测中</h1>
        <p className="text-lg">正在并行检测所有 Z-Library 域名的可用性...</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6">检测进度</h2>
        <div className="h-3 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-gray-800 transition-all duration-500 ease-in-out" 
            style={{ 
              width: `${((domainStatuses.filter(s => s.status !== 'checking').length) / domains.length) * 100}%` 
            }}
          ></div>
        </div>
        <div className="grid gap-4">
          {domainStatuses.map((item, index) => (
            <div key={index} className="flex items-center p-4 bg-white rounded-lg border border-gray-200 border-l-4 border-l-gray-800 transition hover:border-l-gray-800 hover:shadow-sm">
              <div className={`w-4 h-4 rounded-full mr-4 ${getStatusColor(item.status)} ${item.status === 'checking' ? 'animate-pulse' : ''}`}></div>
              <span className="font-mono font-semibold text-gray-800 flex-1">{item.domain}</span>
              <span className="font-medium text-gray-800">{getStatusText(item.status)}</span>
            </div>
          ))}
        </div>
      </div>

      {redirected && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-green-500 animate-slideIn">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">找到可用域名！</h3>
            <p className="font-mono bg-gray-100 p-3 rounded-lg mb-4 break-all">{firstAvailableDomain}</p>
            <div className="mb-4">
              <span id="countdown-text">{countdown}秒后自动跳转...</span>
            </div>
            <button 
              onClick={() => window.location.href = firstAvailableDomain!} 
              className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-black transition"
            >
              立即跳转
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.6; transform: scale(0.9); }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease;
        }
      `}</style>
    </div>
  );
}