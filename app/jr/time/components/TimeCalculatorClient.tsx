"use client";

import React, { useState, useEffect } from 'react';

const TimeCalculatorClient = () => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [yearProgress, setYearProgress] = useState<number>(0);

  const getCurrentWeek = (year: number): number => {
    const now = new Date();
    const yearStart = new Date(year, 0, 1);
    const diff = now.getTime() - yearStart.getTime();
    const week = Math.ceil((diff / 86400000 + yearStart.getDay() + 1) / 7);
    return week;
  };

  const getYearProgress = (year: number): number => {
    const now = new Date();
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    const totalDays = (yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24);
    const passedDays = (now.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24);
    return Math.round((passedDays / totalDays) * 100);
  };

  useEffect(() => {
    const week = getCurrentWeek(currentYear);
    const progress = getYearProgress(currentYear);
    setCurrentWeek(week);
    setYearProgress(progress);
  }, [currentYear]);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value, 10);
    if (!isNaN(year)) {
      setCurrentYear(year);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <div className="flex flex-col space-y-6">
        {/* 年份输入 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">年份：</label>
          <input
            type="number"
            value={currentYear}
            onChange={handleYearChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 显示当前周数 */}
        <div className="mt-4 p-6 bg-gray-100 rounded-lg">
          <p className="text-2xl font-semibold text-green-600">
            当前是 {currentYear} 年第 {currentWeek} 周
          </p>
        </div>

        {/* 周数进度可视化 */}
        <div className="mt-6">
          <div className="grid grid-cols-13 gap-2 mb-4">
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
        </div>

        {/* 年度进度百分比 */}
        <div className="mt-6 p-6 bg-gray-100 rounded-lg">
          <p className="text-2xl font-semibold text-blue-600">
            {currentYear} 年已过: {yearProgress}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeCalculatorClient;