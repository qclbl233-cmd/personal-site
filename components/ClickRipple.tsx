"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

// 模块级标记：整个页面生命周期内只注册一次 click 监听，
// 彻底避免 dev 热更新 / StrictMode 重挂载导致的重复监听（点一下出现两层）
let listenerAttached = false;

/**
 * 水滴涟漪鼠标点击特效 (ClickShow)：
 * 点击页面任意位置，从点击点扩散出一圈小水波纹后淡出
 */
export default function ClickRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (listenerAttached) return;
    listenerAttached = true;

    let counter = 0;
    const handler = (e: MouseEvent) => {
      const id = Date.now() + counter++;
      // 最多同时保留 4 圈，避免过度堆积
      setRipples((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 650);
    };
    window.addEventListener("click", handler);

    return () => {
      listenerAttached = false;
      window.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[990] overflow-hidden">
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full border-2 border-blue-400/50 dark:border-cyan-300/50"
            style={{ left: r.x - 24, top: r.y - 24, width: 48, height: 48 }}
            initial={{ scale: 0.3, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
