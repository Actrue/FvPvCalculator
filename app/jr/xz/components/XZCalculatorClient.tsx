'use client';

import React, { useState } from 'react';
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

type PresentValueState = {
  fv: string;        // 终值
  rate: string;      // 年利率
  years: string;     // 年数
  compounds: string; // 复利次数
  result: string;    // 计算结果
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

const XZCalculatorClient = () => {
  const [state, setState] = useState<PresentValueState>({
    fv: '10000',
    rate: '10',
    years: '5',
    compounds: '1',
    result: '',
    chartData: null
  });

  const { fv, rate, years, compounds, result } = state;

  const calculatePresentValue = () => {
    const fValue = parseFloat(fv);
    const r = parseFloat(rate) / 100;
    const n = parseInt(compounds, 10) || 1; // 复利次数默认1
    const t = parseInt(years, 10) || 0;

    if (isNaN(fValue) || isNaN(r) || isNaN(n) || isNaN(t)) return;

    const pv = fValue / Math.pow(1 + r / n, n * t);
    
    // 生成图表数据
    const labels = Array.from({length: t + 1}, (_, i) => i);
    const data = labels.map(year => {
      return fValue / Math.pow(1 + r / n, n * year);
    });
    
    const chartData = {
      labels,
      datasets: [
        {
          label: '现值变化曲线',
          data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }
      ]
    };
    
    setState(prev => ({ 
      ...prev, 
      result: pv.toFixed(2),
      chartData 
    }));
  };

  const handleInputChange = (field: keyof PresentValueState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <div className="flex flex-col space-y-4">
        {/* 终值输入 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">终值：</label>
          <input
            type="number"
            step="0.01"
            value={fv}
            onChange={handleInputChange('fv')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 年利率输入 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">年利率(%)：</label>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={handleInputChange('rate')}
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
          onClick={calculatePresentValue}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-4"
        >
          计算
        </button>
      </div>

      {/* 显示结果 */}
      {result && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <p className="text-2xl font-semibold text-green-600">
            现值：${result}
          </p>
          <p className="mt-2 text-gray-600">
            公式：PV = FV/(1 + r/n)^(nt)
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
                      text: '现值变化曲线图'
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default XZCalculatorClient;