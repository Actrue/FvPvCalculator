'use client'
import React, { useState } from 'react';
import { calculateDailyWaterIntake } from '../../function/drinkWarter';

// 活动系数选项
const activityOptions = [
  { value: 1.0, label: '久坐' },
  { value: 1.12, label: '轻度活动' },
  { value: 1.27, label: '中度活动' },
  { value: 1.45, label: '剧烈活动' }
];

type InputState = {
  gender: 'male' | 'female';
  age: string;
  weight: string;
  height: string;
  activityFactor: number;
  result: string;
  message: string;
};

const WaterIntakeCalculator = () => {
  const [state, setState] = useState<InputState>({
    gender: 'male',
    age: '25',
    weight: '70',
    height: '175',
    activityFactor: 1.0,
    result: '',
    message: ''
  });

  const { gender, age, weight, height, activityFactor, result, message } = state;

  const calculateWater = () => {
    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    const { message: msg, data } = calculateDailyWaterIntake(
      gender,
      ageNum,
      weightNum,
      heightNum,
      activityFactor
    );

    setState(prev => ({ 
      ...prev,
      result: data ? `${data}ml` : '',
      message: msg
    }));
  };

  const handleInputChange = (field: keyof Omit<InputState, 'result' | 'message' | 'activityFactor'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(prev => ({ ...prev, activityFactor: parseFloat(e.target.value) }));
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-8">每日饮水量计算器</h1>

      <div className="flex flex-col space-y-4">
        {/* 性别选择 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">性别：</label>
          <select
            value={gender}
            onChange={(e) => setState(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>

        {/* 年龄输入 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">年龄（岁）：</label>
          <input
            type="number"
            value={age}
            onChange={handleInputChange('age')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 体重输入 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">体重（kg）：</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={handleInputChange('weight')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 身高输入 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">身高（cm）：</label>
          <input
            type="number"
            value={height}
            onChange={handleInputChange('height')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 活动系数选择 */}
        <div className="flex items-center space-x-4">
          <label className="w-32">活动强度：</label>
          <select
            value={activityFactor}
            onChange={handleActivityChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {activityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 计算按钮 */}
        <button
          onClick={calculateWater}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-4"
        >
          计算饮水量
        </button>
      </div>

      {/* 显示结果 */}
      {message && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <p className={`text-2xl font-semibold ${state ? 'text-green-600' : 'text-red-600'}`}>
            {result ? `建议饮水量：${result}` : message}
          </p>
        </div>
      )}
    </div>
  );
};

export default WaterIntakeCalculator;