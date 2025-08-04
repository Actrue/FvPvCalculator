import type { Metadata } from 'next';
import SitemapFinderClient from './SitemapFinderClient';

export const metadata: Metadata = {
  title: '网站地图查找工具 - Actrue Tools',
  description: '快速查找网站的网站地图(sitemap.xml)，支持多种网站地图格式，帮助SEO优化和网站分析。',
  keywords: '网站地图, sitemap, SEO工具, 网站分析, 爬虫工具, 网站结构, 搜索引擎优化',
  openGraph: {
    title: '网站地图查找工具 - Actrue Tools',
    description: '快速查找网站的网站地图(sitemap.xml)，支持多种网站地图格式，帮助SEO优化和网站分析。',
    type: 'website',
  },
};

export default function SitemapFinderPage() {
  return <SitemapFinderClient />;
}