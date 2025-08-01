"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type RateState = {
  presentValue: string;
  futureValue: string;
  years: string;
  compounds: string;
  result: string;
  chartData: {
    labels: number[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  } | null;
};

const RateCalculator = () => {
  const [state, setState] = useState<RateState>({
    presentValue: '10000',
    futureValue: '20000',
    years: '5',
    compounds: '1',
    result: '',
    chartData: null
  });

  const { presentValue, futureValue, years, compounds, result } = state;

  const calculateRate = () => {
    const pv = parseFloat(presentValue);
    const fv = parseFloat(futureValue);
    const t = parseInt(years, 10) || 0;
    const n = parseInt(compounds, 10) || 1;

    if (isNaN(pv) || isNaN(fv) || isNaN(t) || isNaN(n) || t <= 0 || n <= 0) return;

    const rate = n * (Math.pow(fv / pv, 1 / (n * t)) - 1) * 100;
    
    // 生成图表数据
    const labels = Array.from({length: t + 1}, (_, i) => i);
    const data = labels.map(year => {
      return pv * Math.pow(1 + rate / 100 / n, n * year);
    });
    
    const chartData = {
      labels,
      datasets: [
        {
          label: '价值增长曲线',
          data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }
      ]
    };
    
    setState(prev => ({ 
      ...prev, 
      result: rate.toFixed(2),
      chartData 
    }));
  };

  const handleInputChange = (field: keyof RateState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 返回首页链接 */}
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

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-6">
            利率计算器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            根据现值和终值计算所需利率
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-200">

      <div className="flex flex-col space-y-4">
        {/* 现值输入 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">现值：</label>
          <input
            type="number"
            step="0.01"
            value={presentValue}
            onChange={handleInputChange('presentValue')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 终值输入 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">终值：</label>
          <input
            type="number"
            step="0.01"
            value={futureValue}
            onChange={handleInputChange('futureValue')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 年数输入 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">年数：</label>
          <input
            type="number"
            value={years}
            onChange={handleInputChange('years')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 复利次数输入 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">复利次数/年：</label>
          <input
            type="number"
            value={compounds}
            onChange={handleInputChange('compounds')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 计算按钮 */}
        <button
          onClick={calculateRate}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-4"
        >
          计算
        </button>
      </div>

      {/* 显示结果 */}
      {result && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <p className="text-2xl font-semibold text-green-600">
            年利率：{result}%
          </p>
          <p className="mt-2 text-gray-600">
            公式：r = n × ( (FV/PV)^(1/(n×t)) - 1 ) × 100
          </p>
          
          {state.chartData && (
            <div className="mt-6">
              <Line 
                data={state.chartData} 
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: '价值增长曲线图'
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default RateCalculator;