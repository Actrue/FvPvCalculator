import type { Metadata } from 'next';
import HomePageClient from './components/HomePageClient';

export const metadata: Metadata = {
  title: '金融计算器工具集合 - Actrue',
  description: '提供各种金融计算器工具，包括现值计算器、终值计算器、复利计算器、储蓄复利计算器和利率计算器，帮助您进行金融计算和规划。',
  keywords: '金融计算器, 现值计算器, 终值计算器, 复利计算器, 储蓄复利计算器, 利率计算器, 金融工具, 投资计算, 财务规划',
  authors: [{ name: 'Actrue' }],
  themeColor: '#1e293b',
  openGraph: {
    title: '金融计算器工具集合 - Actrue',
    description: '提供各种金融计算器工具，包括现值计算器、终值计算器、复利计算器、储蓄复利计算器和利率计算器，帮助您进行金融计算和规划。',
    type: 'website',
    locale: 'zh_CN',
    siteName: 'Actrue Tools',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}