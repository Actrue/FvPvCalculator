"use client";

import { useEffect, useState } from "react";

const name = "Actrue";

/**
 * Actrue动画组件 - 页面加载时的启动动画（仅在每天第一次访问时显示）
 * @returns JSX.Element | null
 */
export default function Actrue动画组件() {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // 检查是否是当天第一次访问
    const checkFirstVisitToday = () => {
      if (typeof window !== "undefined") {
        const today = new Date().toISOString().split("T")[0]; // 获取当前日期 YYYY-MM-DD
        const lastVisit = localStorage.getItem("actrue_last_visit");
        
        // 如果没有记录或者记录的日期不是今天，则是当天第一次访问
        if (lastVisit !== today) {
          // 更新最后访问日期
          localStorage.setItem("actrue_last_visit", today);
          // 显示动画
          setShowAnimation(true);
        }
      }
    };

    checkFirstVisitToday();

    // 如果显示动画，则设置定时器在1.5秒后隐藏
    if (showAnimation) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 1500); // 动画持续1.5秒

      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  // 如果不显示动画，直接返回null
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