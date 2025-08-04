import type { Metadata } from 'next';
import MindMapEditorClient from './MindMapEditorClient';

export const metadata: Metadata = {
  title: '脑图编辑器 - Actrue Tools',
  description: '在线创建和编辑思维导图，支持导出图片和文本格式，帮助您更好地组织思路和知识管理。',
  keywords: '脑图, 思维导图, 知识管理, 创意工具, 学习工具, 效率工具, 在线编辑器',
  openGraph: {
    title: '脑图编辑器 - Actrue Tools',
    description: '在线创建和编辑思维导图，支持导出图片和文本格式，帮助您更好地组织思路和知识管理。',
    type: 'website',
  },
};

export default function MindMapEditorPage() {
  return <MindMapEditorClient />;
}