"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 定义波纹的数据结构
interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    // 追踪鼠标移动
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // 监听鼠标点击，生成波纹
    const handleMouseDown = (e: MouseEvent) => {
      let rippleColor = "#3b82f6"; // 默认左键：蓝色 (Blue-500)

      // 根据 e.button 判断点击了哪个键 (完美复刻 ClickShow 参数)
      switch (e.button) {
        case 0:
          rippleColor = "#3b82f6"; // 左键：蓝色
          break;
        case 1:
          rippleColor = "#22c55e"; // 中键：绿色 (Green-500)
          break;
        case 2:
          rippleColor = "#f97316"; // 右键：橙色 (Orange-500)
          break;
        case 3:
          rippleColor = "#6b7280"; // 侧键(后退)：灰色 (Gray-500)
          break;
        case 4:
          rippleColor = "#a855f7"; // 侧键(前进)：紫色 (Purple-500)
          break;
      }

      const newRipple = {
        id: Date.now() + Math.random(), // 生成唯一 ID
        x: e.clientX,
        y: e.clientY,
        color: rippleColor,
      };

      // 将新波纹加入数组
      setRipples((prev) => [...prev, newRipple]);

      // 动画持续 0.6 秒后，自动将这个波纹从数组中清理掉，防止内存泄漏
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <>     
      {/* 2. 外围发光拖尾 (悬浮标颜色) */}
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 bg-orange-300/30 dark:bg-blue-500/30 rounded-full pointer-events-none z-[9998] blur-2xl"
        animate={{
          x: mousePosition.x - 64,
          y: mousePosition.y - 64,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      />

      {/* 🚀 3. ClickShow 动态点击波纹 */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            // 波纹的初始状态：小圆环，稍微透明
            initial={{ scale: 0.2, opacity: 0.8 }}
            // 波纹的扩散状态：放大 1.5 倍，完全变透明
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            // 动画曲线：模拟水波纹散开的顺滑感
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 w-12 h-12 rounded-full border-[3px] pointer-events-none z-[10000]"
            style={{
              x: ripple.x - 24, // 居中偏移 (12 * 4 = 48px / 2 = 24px)
              y: ripple.y - 24,
              borderColor: ripple.color, // 动态赋予对应按键的颜色
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}