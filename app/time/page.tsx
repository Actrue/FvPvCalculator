import Link from 'next/link';
import { FC } from 'react';

const getCurrentWeek = (): [number, number] => {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - yearStart.getTime();
  const week = Math.ceil((diff / 86400000 + yearStart.getDay() + 1) / 7);
  return [now.getFullYear(), week];
};

const TimePage: FC = () => {
  const [year, currentWeek] = getCurrentWeek();

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        {year}年第{currentWeek}周
      </h1>

      <div className="grid grid-cols-13 gap-2 mb-8">
        {Array.from({ length: 52 }, (_, i) => (
          <div
            key={i}
            className={`h-8 rounded-md flex items-center justify-center text-xs font-medium ${
              i < currentWeek ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <div className="text-center mb-6">
        <div className="text-lg font-medium mb-2">
          今年已过: {Math.round((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 365) * 100)}%
        </div>
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700 transition duration-200"
        >
          ← 返回计算器列表
        </Link>
      </div>
    </div>
  );
};

export default TimePage;