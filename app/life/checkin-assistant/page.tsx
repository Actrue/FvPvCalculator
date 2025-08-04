import type { Metadata } from 'next';
import Link from 'next/link';
import CheckinAssistantClient from './CheckinAssistantClient';

export const metadata: Metadata = {
  title: '打卡助手 - Actrue',
  description: '习惯打卡工具，帮助您养成良好的日常习惯。支持创建多个打卡事件，设置每日、每周、每月目标，查看连续打卡天数和历史记录。',
  keywords: '打卡助手, 习惯养成, 打卡工具, 习惯追踪, 目标管理',
  authors: [{ name: 'Actrue' }],
  themeColor: '#1e293b',
  openGraph: {
    title: '打卡助手 - Actrue',
    description: '习惯打卡工具，帮助您养成良好的日常习惯。支持创建多个打卡事件，设置每日、每周、每月目标，查看连续打卡天数和历史记录。',
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function CheckinAssistantPage() {
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
      <CheckinAssistantClient />
    </div>
  );
}