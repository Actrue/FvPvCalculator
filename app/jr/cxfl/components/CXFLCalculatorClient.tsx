'use client';

import React, { useState, useEffect } from 'react';
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

type SavingsState = {
  monthlyInvestment: string;
  annualRate: string;
  inflationRate: string;
  initialPrincipal: string;
  targetAmount: string;
  resultYears: string;
  resultTotal: string;
  resultNoCompound: string;
  ratio: string;
  chartData: {
    labels: number[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  } | null;
  yearsToShow: string;
};

const CXFLCalculatorClient = () => {
  const [state, setState] = useState<SavingsState>({
    monthlyInvestment: '1000',
    annualRate: '10',
    inflationRate: '3',
    initialPrincipal: '50000',
    targetAmount: '1000000',
    resultYears: '',
    resultTotal: '',
    resultNoCompound: '',
    ratio: '',
    chartData: null,
    yearsToShow: '40'
  });

  const {
    monthlyInvestment,
    annualRate,
    inflationRate,
    initialPrincipal,
    targetAmount,
    resultYears,
    resultTotal,
    resultNoCompound,
    ratio,
    // chartData,  // 移除未使用的变量
    // yearsToShow  // 移除未使用的变量
  } = state;

  const calculateCompoundGrowth = (principal: number, monthlyDeposit: number, annualRate: number, inflationRate: number, years: number) => {
    const monthlyRate = Math.pow(1 + annualRate / 100, 1/12) - 1;
    const monthlyInflationRate = Math.pow(1 + inflationRate / 100, 1/12) - 1;
    let nominalBalance = principal;
    let realBalance = principal;
    const nominalData = [];
    const realData = [];
    
    for (let year = 0; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        nominalBalance = nominalBalance * (1 + monthlyRate) + monthlyDeposit;
        realBalance = realBalance * (1 + monthlyRate - monthlyInflationRate) + monthlyDeposit;
      }
      nominalData.push({
        year,
        value: nominalBalance
      });
      realData.push({
        year,
        value: realBalance
      });
    }
    
    return { nominalData, realData };
  };

  const calculate = () => {
    const m = parseFloat(monthlyInvestment);
    const r = parseFloat(annualRate) / 100 + 1; // 转换为增长率系数（如16% → 1.16）
    const p = parseFloat(initialPrincipal);
    const target = parseFloat(targetAmount);
    let current = p;
    let noCompound = p;
    let years = 0;
    const monthly = m * 12; // 年定投总额

    // 设置最大循环次数防止死循环
    const maxIterations = 200;
    let iterationCount = 0;

    while (current < target && iterationCount < maxIterations) {
      current = current * r + monthly;
      noCompound += monthly;
      years++;
      iterationCount++;
    }

    if (iterationCount >= maxIterations) {
      setState({
        ...state,
        resultYears: '无法达成',
        resultTotal: '超出最大年数',
        ratio: 'N/A'
      });
    } else {
      setState({
        ...state,
        resultYears: years.toString(),
        resultTotal: current.toFixed(2),
        resultNoCompound: noCompound.toFixed(2),
        ratio: (current / noCompound).toFixed(2)
      });
    }
  };

  const handleInputChange = (field: keyof SavingsState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setState(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (monthlyInvestment && annualRate && initialPrincipal) {
      const { nominalData, realData } = calculateCompoundGrowth(
        parseFloat(initialPrincipal),
        parseFloat(monthlyInvestment),
        parseFloat(annualRate),
        parseFloat(inflationRate),
        parseInt(state.yearsToShow)  // 使用可配置的年份
      );
      
      const chartData = {
        labels: nominalData.map(item => item.year),
        datasets: [
          {
            label: '名义收益',
            data: nominalData.map(item => item.value),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
          {
            label: '实际收益(扣除通胀)',
            data: realData.map(item => item.value),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
      };
      
      setState(prev => ({ ...prev, chartData }));
    }
  }, [monthlyInvestment, annualRate, inflationRate, initialPrincipal, state.yearsToShow]);  // 添加依赖

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <div className="flex flex-col space-y-4">
        {/* 每月定投 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">每月定投：</label>
          <input
            type="number"
            step="1"
            value={monthlyInvestment}
            onChange={handleInputChange('monthlyInvestment')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 年增长率 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">年增长率(%)：</label>
          <input
            type="number"
            step="0.01"
            value={annualRate}
            onChange={handleInputChange('annualRate')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 通货膨胀率 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">通胀率(%)：</label>
          <input
            type="number"
            step="0.01"
            value={inflationRate}
            onChange={handleInputChange('inflationRate')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 初始本金 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">初始本金：</label>
          <input
            type="number"
            step="1"
            value={initialPrincipal}
            onChange={handleInputChange('initialPrincipal')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 目标金额 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">目标金额：</label>
          <input
            type="number"
            step="1"
            value={targetAmount}
            onChange={handleInputChange('targetAmount')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 显示年份 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">显示年份：</label>
          <input
            type="number"
            min="5"
            max="100"
            step="1"
            value={state.yearsToShow}
            onChange={handleInputChange('yearsToShow')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-4"
        >
          计算所需年数
        </button>
      </div>

      {/* 显示结果 */}
      {resultYears && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <div className="space-y-2">
            <p className="text-xl font-semibold text-green-600">
              需要 {resultYears} 年达成目标
            </p>
            <p className="text-gray-600">
              最终金额：￥{resultTotal}
            </p>
            <p className="text-gray-600">
              无复利总投入：￥{resultNoCompound}
            </p>
            <p className="text-gray-600">
              收益放大比率：{ratio}倍
            </p>
          </div>
        </div>
      )}
      
      {state.chartData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {state.yearsToShow}年复利收益变化  {/* 动态显示年份 */}
          </h2>
          <Line 
            data={state.chartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const value = context.raw;
                      const numValue = typeof value === 'string' ? parseFloat(value) : value as number;
                      if (numValue >= 100000000) {
                        return '金额: ￥' + (numValue / 100000000).toFixed(1) + '亿';
                      } else if (numValue >= 10000) {
                        return '金额: ￥' + (numValue / 10000).toFixed(1) + '万';
                      } else {
                        return '金额: ￥' + numValue.toLocaleString();
                      }
                    }
                  }
                }
              },
              scales: {
                y: {
                  ticks: {
                    callback: function(value) {
                      const numValue = typeof value === 'string' ? parseFloat(value) : value as number;
                      if (numValue >= 100000000) {
                        return '￥' + (numValue / 100000000).toFixed(1) + '亿';
                      } else if (numValue >= 10000) {
                        return '￥' + (numValue / 10000).toFixed(1) + '万';
                      } else {
                        return '￥' + numValue.toLocaleString();
                      }
                    }
                  }
                }
              }
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default CXFLCalculatorClient;