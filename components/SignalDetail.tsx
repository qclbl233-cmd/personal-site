"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sun, Moon, ArrowLeft, CalendarDays, Radio } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { siteConfig } from "@/config/site";
import type { Signal } from "@/lib/signals";

export default function SignalDetail({ signal }: { signal: Signal }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const date = new Date(signal.date);
  const isLong = signal.type === "long";

  return (
    <div className="min-h-screen transition-colors duration-700 ease-in-out bg-[#e6eff8] dark:bg-[#030614] text-slate-800 dark:text-slate-200 relative cursor-none font-sans pb-24">
      {/* 🌟 顶部全局导航栏 */}
      <header className="max-w-[1000px] mx-auto p-4 md:px-8 pt-6 flex items-center justify-center relative z-50">
        <div className="hidden md:flex items-center gap-3 shrink-0 text-sm font-bold tracking-widest uppercase">
          <span onClick={() => router.push('/')} className="opacity-70 hover:opacity-100 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-blue-500/10 hover:text-blue-400 dark:hover:text-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] whitespace-nowrap">主頁 HOME</span>
          <span onClick={() => router.push('/signals')} className="flex items-center gap-1 text-blue-300 bg-blue-900/40 px-4 py-2 rounded-full backdrop-blur-md border border-blue-400/20 shadow-[0_0_10px_rgba(59,130,246,0.3)] cursor-none hover:scale-110 duration-300 whitespace-nowrap">
            动态 SIGNAL
          </span>
          <span onClick={() => router.push('/gallery')} className="opacity-70 hover:opacity-100 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-blue-500/10 hover:text-blue-400 dark:hover:text-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] whitespace-nowrap">影像 GALLERY</span>
          <span onClick={() => router.push('/profile')} className="opacity-70 hover:opacity-100 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-blue-500/10 hover:text-blue-400 dark:hover:text-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] whitespace-nowrap">檔案 PROFILE</span>
        </div>

        <div className="absolute right-4 md:right-8 flex items-center gap-4">
          <div className="text-[10px] font-bold tracking-wider hidden md:block opacity-40">LIVE • RSS</div>
          <button onClick={toggleDarkMode} className="w-12 h-6 rounded-full bg-white/60 dark:bg-blue-950/60 border border-white/40 dark:border-blue-400/30 shadow-inner flex items-center p-1 cursor-none relative backdrop-blur-md">
            <motion.div animate={{ x: isDarkMode ? 24 : 0 }} className="w-4 h-4 rounded-full bg-white dark:bg-blue-300 shadow-[0_0_8px_rgba(147,197,253,0.8)] flex items-center justify-center">
              {isDarkMode ? <Moon className="w-2 h-2 text-blue-900" /> : <Sun className="w-2 h-2 text-orange-400" />}
            </motion.div>
          </button>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto p-4 md:px-8 pt-6 relative z-10">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push('/signals')}
          className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase opacity-50 hover:opacity-100 hover:text-blue-400 transition-colors cursor-none mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> 返回动态
        </button>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          className="bento-card bg-white/85 dark:bg-[#0a1024]/40 dark:border-blue-400/20 backdrop-blur-xl overflow-hidden"
        >
          {/* 封面 */}
          {signal.cover && (
            <div className="relative w-full h-56 md:h-72 overflow-hidden">
              <img src={signal.cover} alt={signal.title ?? ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          <div className="p-6 md:p-10">
            {/* 元信息行 */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest ${
                isLong
                  ? "bg-blue-100 dark:bg-blue-600/30 text-blue-700 dark:text-blue-200"
                  : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-200"
              }`}>
                {isLong ? "长文章" : "短动态"}
              </span>
              <span className="text-[10px] opacity-40 tracking-widest flex items-center gap-1 dark:text-blue-200">
                <CalendarDays className="w-3 h-3" /> {date.getFullYear()}.{String(date.getMonth() + 1).padStart(2, "0")}.{String(date.getDate()).padStart(2, "0")} {String(date.getHours()).padStart(2, "0")}:{String(date.getMinutes()).padStart(2, "0")}
              </span>
              {signal.mood && <span className="text-sm">{signal.mood}</span>}
              {signal.weather && <span className="text-xs opacity-70 dark:text-blue-300">{signal.weather}</span>}
            </div>

            {/* 标题 */}
            <div className="flex items-center gap-2 text-[10px] font-bold opacity-50 tracking-widest uppercase mb-2 dark:text-blue-200">
              <Radio className="w-3.5 h-3.5" /> Signal / {signal.date.slice(0, 10)}
            </div>
            {signal.title && (
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#1b2554] dark:text-white mb-6">{signal.title}</h1>
            )}

            {/* Markdown 正文 */}
            <div
              className="signal-prose text-slate-700 dark:text-blue-100"
              dangerouslySetInnerHTML={{ __html: signal.contentHtml ?? "" }}
            />

            {/* 标签 */}
            {signal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-8 pt-4 border-t border-gray-200/70 dark:border-blue-900/40">
                {signal.tags.map((t) => (
                  <span key={t} className="text-[9px] font-bold tracking-wider opacity-50 dark:text-blue-300 px-2 py-0.5 rounded-full bg-gray-100/80 dark:bg-blue-950/50">#{t}</span>
                ))}
              </div>
            )}
          </div>
        </motion.article>
      </main>
    </div>
  );
}
