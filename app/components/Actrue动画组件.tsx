"use client";

import { useEffect, useState } from "react";

const name = "Actrue";

/**
 * Actrue动画组件 - 页面加载时的启动动画
 * @returns JSX.Element | null
 */
export default function Actrue动画组件() {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000); // 动画持续3秒

    return () => clearTimeout(timer);
  }, []);

  if (!showAnimation) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-black font-bold italic text-9xl w-1/3 animate-fly">
        {name}
      </div>
    </div>
  );
}