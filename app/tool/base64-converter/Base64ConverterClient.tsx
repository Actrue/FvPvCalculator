'use client';

import { useState } from 'react';
import Link from 'next/link';
import Toast from '../../components/Toast';

interface ProxyNode {
  name: string;
  url: string;
  type: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

// API响应数据结构
interface FetchSubscriptionResponse {
  success?: boolean;
  base64Content?: string;
  originalLength?: number;
  error?: string;
}

export default function Base64ConverterClient() {
  const [inputText, setInputText] = useState('');
  const [nodes, setNodes] = useState<ProxyNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');  // 恢复使用的变量
  const [showExample, setShowExample] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Base64解码函数
  const decodeBase64 = (str: string): string => {
    try {
      return atob(str);
    } catch (_) {  // 重命名未使用的变量
      throw new Error('无效的Base64编码');
    }
  };

  // 解析节点名称
  const parseNodeName = (url: string, index: number): string => {
    try {
      if (url.startsWith('vmess://')) {
        const decoded = JSON.parse(atob(url.substring(8)));
        return decoded.ps || `VMess节点 ${index + 1}`;
      } else if (url.startsWith('vless://') || url.startsWith('trojan://')) {
        const urlObj = new URL(url);
        const fragment = decodeURIComponent(urlObj.hash.substring(1));
        return fragment || `${url.startsWith('vless://') ? 'VLess' : 'Trojan'}节点 ${index + 1}`;
      } else if (url.startsWith('ss://')) {
        const urlObj = new URL(url);
        const fragment = decodeURIComponent(urlObj.hash.substring(1));
        return fragment || `Shadowsocks节点 ${index + 1}`;
      } else if (url.startsWith('ssr://')) {
        // SSR格式比较复杂，这里简化处理
        return `ShadowsocksR节点 ${index + 1}`;
      }
    } catch {
       // 解析失败时使用默认名称
     }
    return `节点 ${index + 1}`;
  };

  // 解析订阅内容
  const parseSubscription = (content: string): ProxyNode[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const parsedNodes: ProxyNode[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        // 检测不同的协议类型
        let type = 'unknown';
        if (trimmedLine.startsWith('vmess://')) {
          type = 'vmess';
        } else if (trimmedLine.startsWith('vless://')) {
          type = 'vless';
        } else if (trimmedLine.startsWith('trojan://')) {
          type = 'trojan';
        } else if (trimmedLine.startsWith('ss://')) {
          type = 'shadowsocks';
        } else if (trimmedLine.startsWith('ssr://')) {
          type = 'shadowsocksr';
        } else if (trimmedLine.startsWith('hysteria://') || trimmedLine.startsWith('hysteria2://')) {
          type = 'hysteria';
        } else if (trimmedLine.startsWith('tuic://')) {
          type = 'tuic';
        } else {
          // 跳过不支持的协议
          return;
        }

        const nodeName = parseNodeName(trimmedLine, index);
        
        parsedNodes.push({
          name: nodeName,
          url: trimmedLine,
          type: type
        });
      }
    });

    return parsedNodes;
  };

  // 处理URL转换（从URL获取base64内容然后转换）
  const handleUrlConvert = async () => {
    if (!inputText.trim()) {
      setError('请输入订阅链接');
      return;
    }

    const content = inputText.trim();
    if (!content.startsWith('http://') && !content.startsWith('https://')) {
      setError('请输入有效的HTTP/HTTPS订阅链接');
      return;
    }

    setIsLoading(true);
    setError('');
    setNodes([]);

    try {
      // 调用后端API获取URL内容
      const response = await fetch('/api/fetch-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: content }),
      });

      const result = await response.json() as FetchSubscriptionResponse;
      
      if (!response.ok) {
        throw new Error(result.error || '获取订阅内容失败');
      }

      if (!result.success) {
        throw new Error(result.error || '获取订阅内容失败');
      }

      // 使用API返回的base64内容
      const base64Content = result.base64Content || '';
      
      // 尝试Base64解码
      let decodedContent;
      try {
        decodedContent = decodeBase64(base64Content);
      } catch {
        // 如果解码失败，假设内容已经是解码后的
        decodedContent = base64Content;
        console.log('内容可能已经是解码后的格式');
      }

      // 解析节点
      const parsedNodes = parseSubscription(decodedContent);
      
      if (parsedNodes.length === 0) {
        throw new Error('未找到有效的代理节点');
      }

      setNodes(parsedNodes);
      setToast({ show: true, message: `成功从URL获取并转换了 ${parsedNodes.length} 个节点`, type: 'success' });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'URL转换失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理Base64直接转换
  const handleBase64Convert = async () => {
    if (!inputText.trim()) {
      setError('请输入Base64编码内容');
      return;
    }

    const content = inputText.trim();
    if (content.startsWith('http://') || content.startsWith('https://')) {
      setError('检测到URL链接，请使用"从URL转换"功能');
      return;
    }

    setIsLoading(true);
    setError('');
    setNodes([]);

    try {
      // 尝试Base64解码
      let decodedContent;
      try {
        decodedContent = decodeBase64(content);
      } catch {
        // 如果解码失败，假设内容已经是解码后的
        decodedContent = content;
        console.log('内容可能已经是解码后的格式，直接解析');
      }

      // 解析节点
      const parsedNodes = parseSubscription(decodedContent);
      
      if (parsedNodes.length === 0) {
        throw new Error('未找到有效的代理节点');
      }

      setNodes(parsedNodes);
      setToast({ show: true, message: `成功转换了 ${parsedNodes.length} 个节点`, type: 'success' });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Base64转换失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ show: true, message: '节点URL已复制到剪贴板', type: 'success' });
    } catch (error) {
      console.error('复制失败:', error);
      setToast({ show: true, message: '复制失败，请手动复制', type: 'error' });
    }
  };

  // 复制所有节点
  const copyAllNodes = async () => {
    if (nodes.length === 0) return;
    
    const allUrls = nodes.map(node => node.url).join('\n');
    try {
      await navigator.clipboard.writeText(allUrls);
      setToast({ show: true, message: `已复制 ${nodes.length} 个节点URL到剪贴板`, type: 'success' });
    } catch (error) {
      console.error('复制失败:', error);
      setToast({ show: true, message: '复制失败，请手动复制', type: 'error' });
    }
  };

  // 关闭Toast
  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  // 清空输入
  const handleClear = () => {
    setInputText('');
    setNodes([]);
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
            Base64订阅链接转换器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            将Base64编码的订阅链接转换为Clash等代理工具可识别的节点URL格式
          </p>
        </div>

        {/* 主要内容卡片 */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          {/* 输入区域 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              订阅链接或Base64编码内容
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="请粘贴订阅链接（如：https://example.com/subscribe）或Base64编码内容..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 操作按钮 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleUrlConvert}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {isLoading ? '转换中...' : '从URL转换'}
            </button>
            <button
              onClick={handleBase64Convert}
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {isLoading ? '转换中...' : 'Base64转换'}
            </button>
          </div>
          
          {/* 辅助按钮 */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setInputText('dmVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNVlXTjVMaXQ1WnU5SWlJc0ltRmtaQ0k2SW5SbGMzUXVZMjl0SWl3aWNHOXlkQ0k2T0RBc0ltbGtJam9pTVRJek5EVTJOemdpTENKaGFXUWlPakFzSW01bGRDSTZJblJqY0NJc0luUjVjR1VpT2lKdWIyNWxJaXdpYUc5emRDSTZJblJsYzNRdVkyOXRJaXdpY0dGMGFDSTZJaTlpWVhJaUxDSjBiSE1pT2lKMGJITWlmUT09')}
              className="px-6 py-3 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              示例
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
          {nodes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  转换结果 ({nodes.length} 个节点)
                </h3>
                <button
                  onClick={copyAllNodes}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  复制全部
                </button>
              </div>
              <div className="space-y-3">
                {nodes.map((node, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{node.name}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {node.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-gray-50 p-2 rounded text-sm font-mono break-all">
                        {node.url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(node.url)}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        复制
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 示例和说明 */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <button
            onClick={() => setShowExample(!showExample)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900">使用说明和示例</h3>
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
                <h4 className="font-medium text-gray-900 mb-2">两种转换模式：</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>从URL转换</strong>：输入订阅链接（如：https://example.com/subscribe），自动获取并解析Base64内容</li>
                  <li><strong>Base64转换</strong>：直接输入Base64编码字符串，立即解析转换</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">支持的协议类型：</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>VMess (vmess://) - 自动解析节点名称</li>
                  <li>VLess (vless://) - 自动解析节点名称</li>
                  <li>Trojan (trojan://) - 自动解析节点名称</li>
                  <li>Shadowsocks (ss://) - 自动解析节点名称</li>
                  <li>ShadowsocksR (ssr://)</li>
                  <li>Hysteria (hysteria://, hysteria2://)</li>
                  <li>TUIC (tuic://)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">使用步骤：</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>将订阅链接或Base64编码内容粘贴到输入框</li>
                  <li>根据输入内容选择对应的转换按钮：
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li><span className="text-blue-600 font-medium">从URL转换</span>：适用于HTTP/HTTPS订阅链接</li>
                      <li><span className="text-green-600 font-medium">Base64转换</span>：适用于Base64编码字符串</li>
                    </ul>
                  </li>
                  <li>查看转换结果，点击"复制"按钮复制节点URL</li>
                  <li>将复制的URL导入到Clash等代理工具中使用</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}