import ZLibraryRedirectHome from './home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Z-Library 智能重定向服务 - 自动检测可用域名',
  description: '自动检测可用的 Z-Library 域名，为您提供最快速、最稳定的访问体验。支持实时域名检测和智能缓存机制。',
  keywords: 'Z-Library, 重定向, 域名检测, 智能重定向, 可用域名',
  authors: [{ name: 'Actrue' }],
  themeColor: '#1e293b',
  openGraph: {
    title: 'Z-Library 智能重定向服务 - 自动检测可用域名',
    description: '自动检测可用的 Z-Library 域名，为您提供最快速、最稳定的访问体验。支持实时域名检测和智能缓存机制。',
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function ZLibraryRedirectPage() {
  return <ZLibraryRedirectHome />;
}