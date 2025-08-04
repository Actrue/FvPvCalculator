'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
}

interface SavedMindMap {
  id: string;
  name: string;
  nodes: MindMapNode[];
  createdAt: string;
  updatedAt: string;
}

export default function MindMapEditorClient() {
  const [nodes, setNodes] = useState<MindMapNode[]>([
    { id: '1', text: '中心主题', children: [] }
  ]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [savedMindMaps, setSavedMindMaps] = useState<SavedMindMap[]>([]);
  const mindMapRef = useRef<HTMLDivElement>(null);

  // 添加节点
  const addNode = (parentId: string | null = null) => {
    const newNode: MindMapNode = {
      id: Date.now().toString(),
      text: '新节点',
      children: []
    };

    if (parentId === null) {
      // 添加根节点
      setNodes([...nodes, newNode]);
    } else {
      // 添加子节点
      const addNodeToTree = (nodes: MindMapNode[]): MindMapNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...node.children, newNode]
            };
          }
          return {
            ...node,
            children: addNodeToTree(node.children)
          };
        });
      };
      setNodes(addNodeToTree(nodes));
    }
  };

  // 删除节点
  const deleteNode = (nodeId: string) => {
    const deleteNodeFromTree = (nodes: MindMapNode[]): MindMapNode[] => {
      return nodes
        .filter(node => node.id !== nodeId)
        .map(node => ({
          ...node,
          children: deleteNodeFromTree(node.children)
        }));
    };
    setNodes(deleteNodeFromTree(nodes));
  };

  // 更新节点文本
  const updateNodeText = (nodeId: string, text: string) => {
    const updateNodeInTree = (nodes: MindMapNode[]): MindMapNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, text };
        }
        return {
          ...node,
          children: updateNodeInTree(node.children)
        };
      });
    };
    setNodes(updateNodeInTree(nodes));
  };

  // 保存脑图
  const saveMindMap = () => {
    if (nodes.length === 0) {
      alert('无法保存空的脑图');
      return;
    }

    // 使用第一个节点的文本作为脑图名称
    const mindMapName = nodes[0].text || '未命名脑图';
    
    // 生成唯一ID
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // 创建时间
    const now = new Date().toISOString();
    
    // 创建保存的脑图对象
    const savedMindMap: SavedMindMap = {
      id,
      name: mindMapName,
      nodes: [...nodes],
      createdAt: now,
      updatedAt: now
    };
    
    try {
      // 从localStorage获取已保存的脑图列表
      const savedMindMapsString = localStorage.getItem('mindMapEditorSavedMaps');
      const savedMindMaps: SavedMindMap[] = savedMindMapsString ? JSON.parse(savedMindMapsString) : [];
      
      // 检查是否已存在同名脑图
      const existingIndex = savedMindMaps.findIndex(map => map.name === mindMapName);
      if (existingIndex !== -1) {
        // 如果存在同名脑图，询问用户是否覆盖
        if (confirm(`已存在名为 "${mindMapName}" 的脑图，是否覆盖？`)) {
          savedMindMaps[existingIndex] = savedMindMap;
        } else {
          return;
        }
      } else {
        // 添加新的脑图到列表开头
        savedMindMaps.unshift(savedMindMap);
      }
      
      // 保存到localStorage
      localStorage.setItem('mindMapEditorSavedMaps', JSON.stringify(savedMindMaps));
      alert(`脑图 "${mindMapName}" 保存成功`);
    } catch (error) {
      console.error('保存脑图失败:', error);
      alert('保存脑图失败，请重试');
    }
  };

  // 加载已保存的脑图列表
  const loadSavedMindMaps = () => {
    try {
      const savedMindMapsString = localStorage.getItem('mindMapEditorSavedMaps');
      const savedMindMaps: SavedMindMap[] = savedMindMapsString ? JSON.parse(savedMindMapsString) : [];
      setSavedMindMaps(savedMindMaps);
    } catch (error) {
      console.error('加载已保存脑图列表失败:', error);
      setSavedMindMaps([]);
    }
  };

  // 加载指定的脑图
  const loadMindMap = (savedMap: SavedMindMap) => {
    setNodes(savedMap.nodes);
    setIsLoadModalOpen(false);
    alert(`脑图 "${savedMap.name}" 加载成功`);
  };

  // 删除已保存的脑图
  const deleteSavedMindMap = (id: string, name: string) => {
    if (confirm(`确定要删除脑图 "${name}" 吗？`)) {
      try {
        const savedMindMapsString = localStorage.getItem('mindMapEditorSavedMaps');
        const savedMindMaps: SavedMindMap[] = savedMindMapsString ? JSON.parse(savedMindMapsString) : [];
        const updatedMindMaps = savedMindMaps.filter(map => map.id !== id);
        localStorage.setItem('mindMapEditorSavedMaps', JSON.stringify(updatedMindMaps));
        setSavedMindMaps(updatedMindMaps);
        alert(`脑图 "${name}" 删除成功`);
      } catch (error) {
        console.error('删除脑图失败:', error);
        alert('删除脑图失败，请重试');
      }
    }
  };

  // 导出为文本格式
  const exportAsText = () => {
    const generateText = (nodes: MindMapNode[], level = 0): string => {
      return nodes.map(node => {
        const indent = '  '.repeat(level);
        const text = `${indent}- ${node.text}`;
        const childrenText = node.children.length > 0
          ? '\n' + generateText(node.children, level + 1)
          : '';
        return text + childrenText;
      }).join('\n');
    };

    const textContent = generateText(nodes);
    navigator.clipboard.writeText(textContent)
      .then(() => {
        alert('脑图文本已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
        // 创建一个临时文本区域来复制文本
        const textArea = document.createElement('textarea');
        textArea.value = textContent;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert('脑图文本已复制到剪贴板');
        } catch (copyError) {
          console.error('复制失败:', copyError);
          alert('复制失败，请手动复制以下内容：\n\n' + textContent);
        }
        document.body.removeChild(textArea);
      });
  };

  // 解析文本格式的脑图数据
  const parseTextFormat = (text: string): MindMapNode[] => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const rootNodeStack: MindMapNode[] = [];
    const resultNodes: MindMapNode[] = [];
    
    lines.forEach(line => {
      // 计算缩进级别 (每两个空格为一级)
      const leadingSpaces = line.search(/\S/);
      const level = leadingSpaces / 2;
      
      // 提取节点文本 (去掉前导空格和 "- "前缀)
      const nodeText = line.trim().startsWith('- ') ? line.trim().substring(2) : line.trim();
      
      // 创建新节点
      const newNode: MindMapNode = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: nodeText,
        children: []
      };
      
      if (level === 0) {
        // 根节点
        resultNodes.push(newNode);
        rootNodeStack.length = 0; // 清空栈
        rootNodeStack.push(newNode);
      } else {
        // 子节点
        // 调整栈的大小以匹配当前级别
        rootNodeStack.length = level;
        // 获取父节点
        const parent = rootNodeStack[level - 1];
        if (parent) {
          parent.children.push(newNode);
        }
        // 将当前节点压入栈
        rootNodeStack.push(newNode);
      }
    });
    
    return resultNodes;
  };

  // 渲染节点
  const renderNode = (node: MindMapNode, level = 0) => {
    return (
      <div key={node.id} className="ml-6 mt-3 relative">
        {/* 连接线 */}
        {level > 0 && (
          <div className="absolute top-4 -left-6 w-6 h-0.5 bg-gray-300"></div>
        )}
        <div className="flex items-start group">
          <input
            type="text"
            value={node.text}
            onChange={(e) => updateNodeText(node.id, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          />
          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => addNode(node.id)}
              className="ml-2 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-blue-600 transition-colors shadow-sm"
              title="添加子节点"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              onClick={() => deleteNode(node.id)}
              className="ml-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-sm"
              title="删除节点"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        {node.children.length > 0 && (
          <div className="border-l-2 border-gray-300 pl-2 ml-2 py-1">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
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

        {/* 页面标题 */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            脑图编辑器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            创建和编辑您的思维导图，支持导出文本格式
          </p>
        </div>

        {/* 工具栏 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-gray-200 mb-6 flex flex-wrap gap-3 shadow-sm">
          <button
            onClick={() => addNode()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            添加根节点
          </button>
          <button
            onClick={saveMindMap}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            保存脑图
          </button>
          <button
            onClick={() => {
              loadSavedMindMaps();
              setIsLoadModalOpen(true);
            }}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all font-medium flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            加载脑图
          </button>
          <button
            onClick={exportAsText}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-medium flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            复制文本格式
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all font-medium flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            导入文本格式
          </button>
        </div>

        {/* 脑图编辑区域 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div ref={mindMapRef} className="min-h-[500px] p-4 bg-gray-50 rounded-lg">
            {nodes.map(node => renderNode(node))}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 mt-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            使用说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                操作说明
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center text-center leading-none mr-2 mt-0 flex-shrink-0">1</span>
                  <span>点击节点文本框可编辑内容</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center text-center leading-none mr-2 mt-0 flex-shrink-0">2</span>
                  <span>鼠标悬停在节点上显示操作按钮</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center text-center leading-none mr-2 mt-0 flex-shrink-0">3</span>
                  <span>点击 "+" 按钮添加子节点</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center text-center leading-none mr-2 mt-0 flex-shrink-0">4</span>
                  <span>点击 "&times;" 按钮删除节点（包括根节点）</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center text-center leading-none mr-2 mt-0 flex-shrink-0">5</span>
                  <span>点击 "添加根节点" 按钮添加新的根节点</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  文本格式示例
                </h4>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  <pre className="text-sm text-gray-700">
{`- 大模型训练的基础
  - 数据清洗
  - 基座模型选择`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 导入模态框 */}
        {isImportModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">导入脑图文本</h3>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="请粘贴脑图文本，格式如下：
- 中心主题
  - 新节点
    - 新节点"
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportText('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    try {
                      const parsedNodes = parseTextFormat(importText);
                      setNodes(parsedNodes);
                      setIsImportModalOpen(false);
                      setImportText('');
                      alert('脑图导入成功');
                    } catch (error) {
                      console.error('导入失败:', error);
                      alert('导入失败，请检查文本格式是否正确');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  确认导入
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 加载脑图模态框 */}
        {isLoadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">加载脑图</h3>
              </div>
              <div className="flex-1 overflow-auto p-6">
                {savedMindMaps.length > 0 ? (
                  <div className="space-y-4">
                    {savedMindMaps.map((map) => (
                      <div key={map.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                        <div>
                          <h4 className="font-medium text-gray-900">{map.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            创建时间: {new Date(map.createdAt).toLocaleString('zh-CN')}
                          </p>
                          <p className="text-sm text-gray-500">
                            最后更新: {new Date(map.updatedAt).toLocaleString('zh-CN')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => loadMindMap(map)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          >
                            加载
                          </button>
                          <button
                            onClick={() => deleteSavedMindMap(map.id, map.name)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>暂无保存的脑图</p>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setIsLoadModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}