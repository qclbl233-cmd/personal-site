"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sun, Moon, Radio, ArrowLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { siteConfig } from "@/config/site";
import type { Signal } from "@/lib/signals";

export type Filter = "all" | "short" | "long";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "short", label: "短动态" },
  { key: "long", label: "长文章" },
];

function formatDay(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${m}.${d}`;
}

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

interface SignalsTimelineProps {
  signals: Signal[]; // 已按当前筛选过滤后的列表（服务端处理）
  allSignals: Signal[]; // 完整列表，用于统计数字
  initialFilter: Filter; // 当前筛选（由 URL ?type= 决定）
}

export default function SignalsTimeline({ signals, allSignals, initialFilter }: SignalsTimelineProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  // 点击筛选：只更新 URL，由服务端重新渲染出正确的列表（URL 是唯一事实来源，可分享可收藏）
  const changeFilter = (f: Filter) => {
    router.replace(f === "all" ? "/signals" : `/signals?type=${f}`, { scroll: false });
  };

  const filtered = signals; // 服务端已按筛选过滤

  const counts = useMemo(
    () => ({
      all: allSignals.length,
      short: allSignals.filter((s) => s.type === "short").length,
      long: allSignals.filter((s) => s.type === "long").length,
    }),
    [allSignals]
  );

  return (
    <div className="min-h-screen transition-colors duration-700 ease-in-out bg-[#e6eff8] dark:bg-[#030614] text-slate-800 dark:text-slate-200 relative cursor-none font-sans pb-24">
      {/* 🌟 顶部全局导航栏（与主页一致，SIGNAL 高亮） */}
      <header className="max-w-[1200px] mx-auto p-4 md:px-8 pt-6 flex items-center justify-center relative z-50">
        <div className="hidden md:flex items-center gap-3 shrink-0 text-sm font-bold tracking-widest uppercase">
          <span onClick={() => router.push('/')} className="opacity-70 hover:opacity-100 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-blue-500/10 hover:text-blue-400 dark:hover:text-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] whitespace-nowrap">主頁 HOME</span>
          <span className="flex items-center gap-1 text-blue-300 bg-blue-900/40 px-4 py-2 rounded-full backdrop-blur-md border border-blue-400/20 shadow-[0_0_10px_rgba(59,130,246,0.3)] cursor-none hover:scale-110 duration-300 whitespace-nowrap">
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

      <main className="max-w-[1200px] mx-auto p-4 md:px-8 pt-6 relative z-10">
        {/* 信号流标题区 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-[10px] font-bold opacity-50 tracking-widest uppercase mb-3 dark:text-blue-200">
            <Radio className="w-3.5 h-3.5" /> Signal Log / {String(counts.all).padStart(4, "0")}
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#1b2554] dark:text-white mb-2">个人动态</h1>
          <p className="text-sm opacity-60 font-serif italic dark:text-blue-200">短动态与长文章，按时间出现在这里。</p>
        </motion.div>

        {/* 筛选栏 */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => changeFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all duration-300 cursor-none hover:scale-105 backdrop-blur-md ${
                initialFilter === f.key
                  ? "bg-yellow-300/80 dark:bg-blue-600/40 dark:border dark:border-blue-400/30 text-yellow-900 dark:text-blue-100 shadow-[0_0_12px_rgba(37,99,235,0.15)]"
                  : "bg-white/60 dark:bg-[#0a1024]/40 dark:border dark:border-blue-400/20 text-slate-500 dark:text-blue-200/60 hover:bg-white/90 dark:hover:bg-blue-900/40"
              }`}
            >
              {f.label} <span className="opacity-50 ml-1">{counts[f.key]}</span>
            </button>
          ))}
        </motion.div>

        {/* 时间线主体 */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bento-card bg-white/70 dark:bg-[#0a1024]/40 dark:border-blue-400/20 backdrop-blur-xl p-10 text-center">
            <div className="text-xs font-bold text-orange-400 dark:text-blue-400 mb-3 tracking-widest">CHANNEL IS QUIET</div>
            <p className="text-sm opacity-60 font-serif dark:text-blue-200">這個頻道還沒有信號。等第一條動態出現。</p>
          </motion.div>
        ) : (
          <div>
            {filtered.map((signal, i) => (
              <SignalRow key={signal.slug} signal={signal} isLast={i === filtered.length - 1} />
            ))}
          </div>
        )}

        {/* 回到主页 */}
        <button
          onClick={() => router.push('/')}
          className="mt-12 flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase opacity-50 hover:opacity-100 hover:text-blue-400 transition-colors cursor-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> 回到主页
        </button>
      </main>
    </div>
  );
}

/* ── 单条时间线 ─────────────────────────────── */

function SignalRow({ signal, isLast }: { signal: Signal; isLast: boolean }) {
  const date = new Date(signal.date);
  const isLong = signal.type === "long";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
      className="flex gap-4 md:gap-6"
    >
      {/* 左轨：日期 + 信号圆点 + 连接线 */}
      <div className="w-12 md:w-16 shrink-0 flex flex-col items-center">
        <div className="text-[10px] font-black tracking-widest opacity-60 dark:text-blue-200 pt-1">{formatDay(date)}</div>
        <div className={`mt-2 w-3 h-3 rounded-full border-2 border-white/70 dark:border-blue-950 shadow-[0_0_10px_rgba(59,130,246,0.8)] ${isLong ? "bg-blue-400" : "bg-yellow-400 dark:bg-blue-400"}`} />
        {!isLast && <div className="flex-1 w-px my-1 bg-gray-300/70 dark:bg-blue-900/60" />}
      </div>

      {/* 内容卡 */}
      <div className="flex-1 pb-8 min-w-0">
        <article className="bento-card bg-white/80 dark:bg-[#0a1024]/40 dark:border-blue-400/20 backdrop-blur-xl p-5 md:p-6 group">
          {/* 徽章行 */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest ${
              isLong
                ? "bg-blue-100 dark:bg-blue-600/30 text-blue-700 dark:text-blue-200"
                : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-200"
            }`}>
              {isLong ? "长文章" : "短动态"}
            </span>
            <span className="text-[10px] opacity-40 tracking-widest flex items-center gap-1 dark:text-blue-200">
              <CalendarDays className="w-3 h-3" /> {date.getFullYear()}.{formatDay(date)} {formatTime(date)}
            </span>
            {signal.mood && <span className="text-sm">{signal.mood}</span>}
            {signal.weather && <span className="text-xs opacity-70 dark:text-blue-300">{signal.weather}</span>}
          </div>

          {isLong ? <LongCardBody signal={signal} /> : <ShortCardBody signal={signal} />}

          {/* 标签 */}
          {signal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-200/70 dark:border-blue-900/40">
              {signal.tags.map((t) => (
                <span key={t} className="text-[9px] font-bold tracking-wider opacity-50 dark:text-blue-300 px-2 py-0.5 rounded-full bg-gray-100/80 dark:bg-blue-950/50">#{t}</span>
              ))}
            </div>
          )}
        </article>
      </div>
    </motion.div>
  );
}

function LongCardBody({ signal }: { signal: Signal }) {
  const router = useRouter();
  return (
    <div className="flex gap-4">
      {signal.cover && (
        <img
          src={signal.cover}
          alt={signal.title ?? signal.slug}
          className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border border-white/50 dark:border-blue-400/20 shrink-0"
        />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-black text-slate-800 dark:text-blue-50 mb-1.5">{signal.title}</h3>
        {signal.summary && (
          <p className="text-sm opacity-60 leading-relaxed font-serif dark:text-blue-200 line-clamp-2">{signal.summary}</p>
        )}
        <button
          onClick={() => router.push(`/signals/${signal.slug}`)}
          className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-blue-500 dark:text-blue-400 hover:gap-2 transition-all cursor-none"
        >
          阅读全文 <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function ShortCardBody({ signal }: { signal: Signal }) {
  return (
    <div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-85 font-serif dark:text-blue-100">{signal.content.trim()}</p>
      {signal.images && signal.images.length > 0 && (
        <div className={`grid gap-1.5 mt-4 ${signal.images.length === 1 ? "grid-cols-1" : signal.images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {signal.images.map((src) => (
            <img key={src} src={src} alt="" className="w-full aspect-square object-cover rounded-lg border border-white/40 dark:border-blue-400/10" />
          ))}
        </div>
      )}
    </div>
  );
}
