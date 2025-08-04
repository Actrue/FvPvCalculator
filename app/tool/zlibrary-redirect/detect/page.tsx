import { Metadata } from 'next';
import ZLibraryRedirectClient from './ZLibraryRedirectClient';

export const metadata: Metadata = {
  title: 'Z-Library 域名检测 - 智能重定向服务',
  description: '正在并行检测所有 Z-Library 域名的可用性，为您找到最快速、最稳定的访问地址。',
  keywords: 'Z-Library, 域名检测, 智能重定向, 可用域名, 检测进度',
  authors: [{ name: 'Actrue' }],
  themeColor: '#1e293b',
  openGraph: {
    title: 'Z-Library 域名检测 - 智能重定向服务',
    description: '正在并行检测所有 Z-Library 域名的可用性，为您找到最快速、最稳定的访问地址。',
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function ZLibraryRedirectDetectPage() {
  return <ZLibraryRedirectClient />;
}