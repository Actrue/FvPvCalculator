import type { Metadata } from 'next';
import Link from 'next/link';
import DrinkWaterClient from './DrinkWaterClient';

export const metadata: Metadata = {
  title: '每日饮水量计算器 - Actrue',
  description: '基于科学公式计算个人每日最佳饮水量的在线工具，考虑性别、年龄、体重、身高和活动强度等因素。',
  keywords: '饮水量计算器, 每日饮水量, 健康工具, 水分摄入, 健康计算',
  authors: [{ name: 'Actrue' }],
  themeColor: '#1e293b',
  openGraph: {
    title: '每日饮水量计算器 - Actrue',
    description: '基于科学公式计算个人每日最佳饮水量的在线工具，考虑性别、年龄、体重、身高和活动强度等因素。',
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function DrinkWaterPage() {
  return (
    <div className="min-h-screen bg-white">
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
      <DrinkWaterClient />
    </div>
  );
}