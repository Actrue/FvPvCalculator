// pages/index.tsx
import Link from 'next/link'; // 使用 Next.js 原生的 Link 组件
import { FC } from 'react';
const HomePage: FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-blue-600">
        金融计算器工具集合
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 现值计算器卡片 */}
        <Link
          href="/xz"
          className="flex flex-col justify-between bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 h-full"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-500">现值计算器</h2>
            <p className="text-gray-600 mb-6">
              计算资金当前价值，支持复利现值计算
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">公式：PV = FV/(1+r)^n</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>

        {/* 终值计算器卡片 */}
        <Link
          href="/zz"
          className="flex flex-col justify-between bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 h-full"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-500">终值计算器</h2>
            <p className="text-gray-600 mb-6">
              预测资金未来价值，支持复利终值计算
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">公式：FV = PV×(1+r)^n</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>

        {/* 复利计算器卡片 */}
        <Link
          href="/fl"
          className="flex flex-col justify-between bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 h-full"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-500">复利计算器</h2>
            <p className="text-gray-600 mb-6">
              计算复利增长效果，支持不同复利次数
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">公式：A = P(1+r/n)^nt</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
        {/* 新增：储蓄复利计算器卡片 */}
        <Link
          href="/cxfl"
          className="flex flex-col justify-between bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 h-full"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-500">储蓄复利计算器</h2>
            <p className="text-gray-600 mb-6">
              计算定期定额投资的复利增长效果，对比无复利情况
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">公式：FV = P(1+r)^n + 定投*( (1+r)^n -1 )/r</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>

        {/* 新增：利率计算器卡片 */}
        <Link
          href="/ll"
          className="flex flex-col justify-between bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 h-full"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-500">利率计算器</h2>
            <p className="text-gray-600 mb-6">
              根据现值和终值计算所需利率
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">公式：r = n × ( (FV/PV)^(1/(n×t)) - 1 ) × 100</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>

        {/* 周数进度卡片 */}
        <Link
          href="/time"
          className="flex flex-col justify-between bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 h-full"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-500">周数进度</h2>
            <p className="text-gray-600 mb-6">
              查看当前年份周数进度与时间分布
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">每周进度可视化</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;