'use client'
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

type FutureValueState = {
  pv: string;        // 现值
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

const ZZCalculatorClient = () => {
  const [state, setState] = useState<FutureValueState>({
    pv: '1000',
    rate: '10',
    years: '5',
    compounds: '1',
    result: '',
    chartData: null
  });

  const { pv, rate, years, compounds, result } = state;

  const calculateFutureValue = () => {
    const presentValue = parseFloat(pv);
    const r = parseFloat(rate) / 100;
    const n = parseInt(compounds, 10) || 1; // 默认复利次数为1
    const t = parseInt(years, 10) || 0;

    if (isNaN(presentValue) || isNaN(r) || isNaN(n) || isNaN(t)) return;

    const fv = presentValue * Math.pow(1 + r / n, n * t);
    
    // 生成图表数据
    const labels = Array.from({length: t + 1}, (_, i) => i);
    const data = labels.map(year => {
      return presentValue * Math.pow(1 + r / n, n * year);
    });
    
    const chartData = {
      labels,
      datasets: [
        {
          label: '终值增长曲线',
          data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }
      ]
    };
    
    setState(prev => ({ 
      ...prev, 
      result: fv.toFixed(2),
      chartData 
    }));
  };

  const handleInputChange = (field: keyof FutureValueState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <div className="flex flex-col space-y-4">
        {/* 现值输入 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">现值：</label>
          <input
            type="number"
            step="0.01"
            value={pv}
            onChange={handleInputChange('pv')}
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
          onClick={calculateFutureValue}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-4"
        >
          计算
        </button>
      </div>

      {/* 显示结果 */}
      {result && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <p className="text-2xl font-semibold text-green-600">
            终值：${result}
          </p>
          <p className="mt-2 text-gray-600">
            公式：FV = PV × (1 + r/n)^(nt)
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
                      text: '终值增长曲线图'
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

export default ZZCalculatorClient;