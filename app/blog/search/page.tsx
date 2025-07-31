import { Metadata } from 'next';
import { blogConfig } from '../../../data/博客配置';
import SearchPage from '../../../src/components/搜索页面';

/**
 * 生成搜索页面元数据
 */
export const metadata: Metadata = {
  title: `搜索文章 | ${blogConfig.title}`,
  description: '搜索博客文章，快速找到您感兴趣的内容。支持标题、内容、标签等多维度搜索。',
  keywords: ['搜索', '博客', '文章', '查找', '技术分享'].join(', '),
  openGraph: {
    title: `搜索文章 | ${blogConfig.title}`,
    description: '搜索博客文章，快速找到您感兴趣的内容。支持标题、内容、标签等多维度搜索。',
    type: 'website',
    siteName: blogConfig.title,
    locale: 'zh_CN'
  },
  twitter: {
    card: 'summary',
    title: `搜索文章 | ${blogConfig.title}`,
    description: '搜索博客文章，快速找到您感兴趣的内容。支持标题、内容、标签等多维度搜索。',
    creator: blogConfig.twitter
  },
  alternates: {
    canonical: `${blogConfig.url}/blog/search`
  }
};

/**
 * 博客搜索页面
 */
export default function BlogSearchPage() {
  return <SearchPage />;
}