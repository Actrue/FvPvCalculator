import React from 'react';

const TestLoadingPage = async () => {
  // 模拟5秒的延迟
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-gray-800">
        测试页面 - 服务端组件
      </h1>
    </div>
  );
};

export default TestLoadingPage;