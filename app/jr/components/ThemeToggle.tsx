'use client';

export default function ThemeToggle() {
  // 只保留明亮模式，移除主题切换功能
  return (
    <button
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      {/* 只显示明亮模式的太阳图标 */}
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      </svg>
    </button>
  );
}