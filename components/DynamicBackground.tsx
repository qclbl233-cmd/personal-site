"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface Meteor {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  width: number;
  repeatDelay: number;
}

interface Leaf {
  id: number;
  left: number;
  duration: number;
  delay: number;
  rotation: number;
  leafType: string;
}

interface ConstellationLine {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export default function DynamicBackground({ isDarkMode }: { isDarkMode: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [constellations, setConstellations] = useState<ConstellationLine[]>([]);

  useEffect(() => {
    // 异步标记已挂载（避免渲染期 setState 警告）
    const raf = requestAnimationFrame(() => setMounted(true));

    // 🌌 1. 生成不规则的漫天繁星 (数量增加到 120 颗)
    const newStars: Star[] = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5, // 星星大小随机 0.5px - 2.5px
      duration: Math.random() * 5 + 3, // 闪烁周期随机
      delay: Math.random() * 5, // 初始延迟随机
      opacity: Math.random() * 0.6 + 0.2, // 亮度随机
    }));
    setStars(newStars);

    // 🌠 2. 生成随机流星雨 (5 颗流星，错开时间出现)
    const newMeteors: Meteor[] = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      // 保证流星从偏右上角的位置划出
      left: Math.random() * 100 + 50,
      top: Math.random() * 50 - 20,
      duration: Math.random() * 2 + 1.5, // 划过天空的速度
      delay: Math.random() * 10, // 错开划过的时间
      width: Math.random() * 100 + 100, // 流星的尾巴长度随机
      repeatDelay: Math.random() * 5 + 5, // 划过后隔 5-10 秒再出现
    }));
    setMeteors(newMeteors);

    // 🕸️ 3. 保留一点淡淡的星座连线，增加纵深感
    const nodes = Array.from({ length: 12 }).map(() => ({ x: Math.random() * 100, y: Math.random() * 100 }));
    const lines: ConstellationLine[] = [];
    for (let i = 0; i < nodes.length - 1; i += 2) {
      lines.push({ start: nodes[i], end: nodes[i + 1] });
    }
    setConstellations(lines);

    // 🍃 4. 白天的落叶保持不变
    const newLeaves: Leaf[] = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 10,
      rotation: Math.random() * 360,
      leafType: ["🍃", "🍂", "🍁", "🌸"][Math.floor(Math.random() * 4)],
    }));
    setLeaves(newLeaves);

    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {isDarkMode ? (
        <div className="absolute inset-0 transition-opacity duration-1000 bg-[#0a0d18]">

          {/* ❌ 删除了死板的整齐网格！ */}

          {/* 🌌 深蓝/靛蓝色极光星云底色 */}
          <motion.div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen" animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-indigo-900/20 rounded-full blur-[140px] mix-blend-screen" animate={{ x: [0, -40, 0], y: [0, -30, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} />

          {/* ✨ 闪烁的漫天不规则繁星 */}
          {stars.map((star) => (
            <motion.div
              key={`star-${star.id}`}
              className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)]"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
              }}
              animate={{
                opacity: [0.1, star.opacity, 0.1], // 根据自己的最高亮度呼吸
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* 🕸️ 淡淡的星座连线 (透明度降低，作为点缀) */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            {constellations.map((line, i) => (
              <g key={`constellation-${i}`}>
                <line x1={`${line.start.x}%`} y1={`${line.start.y}%`} x2={`${line.end.x}%`} y2={`${line.end.y}%`} stroke="#8b9cd4" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx={`${line.start.x}%`} cy={`${line.start.y}%`} r="2" fill="#a5b4fc" className="animate-pulse" />
              </g>
            ))}
          </svg>

          {/* 🌠 动态流星雨特效 */}
          {meteors.map((meteor) => (
            <motion.div
              key={`meteor-${meteor.id}`}
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-white transform -rotate-45"
              style={{
                top: `${meteor.top}%`,
                left: `${meteor.left}%`,
                width: `${meteor.width}px`, // 流星的尾巴长度随机
                boxShadow: "0 0 10px 1px rgba(255, 255, 255, 0.6)", // 发光特效
              }}
              animate={{
                x: [0, -1500], // 往左下角划过
                y: [0, 1500],
                opacity: [0, 1, 0], // 出现时亮起，消失时变暗
              }}
              transition={{
                duration: meteor.duration,
                repeat: Infinity,
                delay: meteor.delay,
                ease: "linear",
                repeatDelay: meteor.repeatDelay, // 划过后隔一段时间再出现
              }}
            />
          ))}
        </div>
      ) : (
        /* ================= 白天：温柔流光与落叶 ================= */
        <div className="absolute inset-0 transition-opacity duration-1000">
          <motion.div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-pink-300/30 rounded-full blur-[120px]" animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-yellow-300/30 rounded-full blur-[120px]" animate={{ x: [0, -50, 0], y: [0, 50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
          {leaves.map((leaf) => (
            <motion.div key={`leaf-${leaf.id}`} className="absolute text-xl opacity-60 drop-shadow-sm" style={{ left: `${leaf.left}%`, top: `-10%` }} animate={{ y: ["0vh", "110vh"], x: [0, 100, -50, 0], rotate: [leaf.rotation, leaf.rotation + 360] }} transition={{ y: { duration: leaf.duration, repeat: Infinity, ease: "linear", delay: leaf.delay }, x: { duration: leaf.duration / 1.5, repeat: Infinity, ease: "easeInOut", delay: leaf.delay }, rotate: { duration: leaf.duration / 2, repeat: Infinity, ease: "linear" } }}>
              {leaf.leafType}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
