"use client";

import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Sun, Moon, ChevronRight } from "lucide-react";
import DynamicBackground from "@/components/DynamicBackground";
import SocialBadges from "@/components/SocialBadges";
import MusicPlayer from "@/components/MusicPlayer";
import TimeWidget from "@/components/TimeWidget";
import WeatherWidget from "@/components/WeatherWidget";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import type { Signal } from "@/lib/signals";

interface HomeContentProps {
  stats: { total: number; short: number; long: number };
  latestSignals: Signal[];
}

function formatSignalDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function HomeContent({ stats, latestSignals }: HomeContentProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/profile');
    router.prefetch('/signals');
  }, [router]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="min-h-screen transition-colors duration-700 ease-in-out bg-[#e6eff8] dark:bg-[#030614] text-slate-800 dark:text-slate-200 overflow-hidden relative cursor-none font-sans pb-20">

      <DynamicBackground isDarkMode={isDarkMode} />

      <header className="max-w-[1700px] mx-auto p-4 md:px-8 pt-6 flex items-center justify-center relative z-50">
        <div className="hidden md:flex items-center gap-3 shrink-0 text-sm font-bold tracking-widest uppercase">
          <span className="flex items-center gap-1 text-blue-300 bg-blue-900/40 px-4 py-2 rounded-full backdrop-blur-md border border-blue-400/20 shadow-[0_0_10px_rgba(59,130,246,0.3)] cursor-none hover:scale-110 duration-300 whitespace-nowrap">
            主页 HOME
          </span>
          <span onClick={() => router.push('/signals')} className="opacity-70 hover:opacity-100 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-blue-500/10 hover:text-blue-400 dark:hover:text-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] whitespace-nowrap">
            动态 SIGNAL
          </span>
          <span onClick={() => router.push('/gallery')} className="opacity-70 hover:opacity-100 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-blue-500/10 hover:text-blue-400 dark:hover:text-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] whitespace-nowrap">
            影像 GALLERY
          </span>
          <span onClick={() => router.push('/profile')} className="opacity-70 hover:opacity-100 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-blue-500/10 hover:text-blue-400 dark:hover:text-blue-30OTHOVER:SHADOW-[O_O_12PX_RGBA(59,13O,246,O.25)] WHITESPACE-NOWRAP">
            档案 PROFILE
          </span>
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

      <main className="max-w-[1700px] mx-auto p-4 md:px-8 pt-4 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* ── 左列：档案 + 我的動態 ── */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <motion.div variants={itemVariants} className="bento-card bg-white/70 dark:bg-[#0a1024]/40 dark:border-blue-400/20 backdrop-blur-xl p-6 flex flex-col relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-pink-100/80 dark:bg-blue-500/30 rotate-2 backdrop-blur-sm shadow-sm transition-colors duration-500"></div>
              <div className="flex items-center gap-4 mb-6 mt-2">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border-2 border-white dark:border-blue-400/30 shadow-inner flex items-center justify-center overflow-hidden">
                  <img src={siteConfig.author.avatar} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-blue-50">{siteConfig.author.name}</h2>
                  <p className="text-[10px] opacity-50 tracking-wider text-blue-300">{siteConfig.author.handle}</p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-gray-200 dark:bg-blue-800/50 mb-4"></div>
              <SocialBadges />
            </motion.div>

            <motion.div variants={itemVariants} className="bento-card bg-white/70 dark:bg-gradient-to-br dark:from-[#131b3d] dark:via-[#0d1229] dark:to-[#0a0e1f] dark:border-blue-400/25 backdrop-blur-xl relative pl-10 pr-4 py-6 aspect-square flex flex-col justify-center dark:shadow-[inset_0_0_30px_rgba(59,130,246,0.06)]">
              <div className="hidden dark:block absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-evenly items-center">
                {[1,2,3,4,5,6,7].map(i => (<div key={i} className="w-4 h-2 bg-gray-200 dark:bg-blue-950 rounded-full border dark:border-blue-800 shadow-inner -ml-4"></div>))}
              </div>
              <div className="text-[10px] font-bold tracking-widest opacity-40 mb-4 flex justify-between uppercase text-blue-200">
                <span>Module Map</span><span>Signal</span>
              </div>
              <h3 className="text-sm font-bold opacity-80 mb-4 dark:text-blue-50">数据看板</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => router.push('/signals')} className="w-full flex items-center gap-3 bg-yellow-100 dark:bg-blue-600/30 dark:border dark:border-blue-400/20 p-2 rounded-lg font-bold text-sm text-yellow-800 dark:text-blue-100 shadow-[0_0_15px_rgba(37,99,235,0.1)] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(37,99,235,0.25)] transition-all duration-300 cursor-none text-left">
                    <span className="text-[10px] opacity-50">01</span> 总览
                    <span className="ml-auto flex items-center gap-1 text-[10px] bg-white/50 dark:bg-blue-900/50 px-2 rounded-full">{stats.total} <ChevronRight className="w-3 h-3" /></span>
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/signals?type=short')} className="w-full flex items-center gap-3 p-2 rounded-lg font-bold text-sm opacity-60 dark:text-blue-200 hover:opacity-100 hover:bg-white/60 dark:hover:bg-blue-900/30 transition-all duration-300 cursor-none text-left">
                    <span className="text-[10px]">02</span> 短动态
                    <span className="ml-auto flex items-center gap-1 text-[10px]">{stats.short} <ChevronRight className="w-3 h-3" /></span>
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/signals?type=long')} className="w-full flex items-center gap-3 p-2 rounded-lg font-bold text-sm opacity-60 dark:text-blue-200 hover:opacity-100 hover:bg-white/60 dark:hover:bg-blue-900/30 transition-all duration-300 cursor-none text-left">
                    <span className="text-[10px]">03</span> 长文章
                    <span className="ml-auto flex items-center gap-1 text-[10px]">{stats.long} <ChevronRight className="w-3 h-3" /></span>
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/signals')} className="w-full flex items-center gap-3 p-2 rounded-lg font-bold text-sm opacity-60 dark:text-blue-200 hover:opacity-100 hover:bg-white/60 dark:hover:bg-blue-900/30 transition-all duration-300 cursor-none text-left">
                    <span className="text-[10px]">04</span> 置顶区
                    <span className="ml-auto flex items-center gap-1 text-[10px]">0 <ChevronRight className="w-3 h-3" /></span>
                  </button>
                </li>
              </ul>
              <button onClick={() => router.push('/signals')} className="mt-4 w-full text-[10px] font-bold tracking-widest uppercase opacity-40 hover:opacity-100 hover:text-blue-400 transition-all cursor-none text-left">
                VIEW ALL SIGNALS →
              </button>
            </motion.div>
          </div>

          {/* ── 中列：hero 大卡 + 最近信號 ── */}
          <div className="md:col-span-3 flex flex-col gap-6">
            
            <motion.div variants={itemVariants} className="bento-card flex flex-col justify-end overflow-hidden relative min-h-[420px] h-full shadow-[0_0_40px_rgba(0,0,0,0.3)] dark:border-[#353f75] dark:shadow-[inset_0_0_30px_rgba(167,139,250,0.15)]">
               <img src="/YUI.png" alt="Day Background" className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-700 ease-in-out dark:opacity-0" />
               <img src="/Azusa.png" alt="Night Background" className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-700 ease-in-out opacity-0 dark:opacity-100" />

               <div className="p-10 relative z-20">
                  <h1 className="text-[6rem] md:text-[8rem] font-black tracking-tighter leading-none text-[#1b2554] dark:text-white drop-shadow-2xl" translate="no">
                    Welcome
                  </h1>
               </div>

               {/* 📝 底部诗意横幅：左对齐台词 + 高级毛玻璃材质 */}
               <div className="w-full py-4 px-10 bg-white/40 dark:bg-black/40 backdrop-blur-md border-t border-white/50 dark:border-white/10 relative z-20 transition-colors flex items-center justify-start">
                 <p className="text-sm font-serif font-bold text-slate-800 dark:text-gray-200 tracking-widest text-left drop-shadow-sm">
                   {isDarkMode 
                     ? "为了不被遗忘，为了不至褪色，期盼着能留下形体的事物并不是一切。" 
                     : "化作言语只是徒劳。我正与你一同等待着夏天。"}
                 </p>
               </div>
            </motion.div>

            {/* 最近信號：标题行 + 横线纸卡 */}
            <div className="flex flex-col">
              <div className="flex justify-between items-end px-4 pt-0 mb-2">
                 <div className="flex items-baseline gap-3">
                    <span className="text-[10px] font-bold opacity-40 tracking-widest uppercase dark:text-blue-300">01 / LIVE STREAM</span>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-blue-50">最近信號</h2>
                 </div>
                 <span className="text-xs italic font-serif opacity-40 hidden md:block dark:text-blue-300"></span>
              </div>

              <motion.div variants={itemVariants} className="bento-card bg-white/90 dark:bg-[#070b18] dark:border-blue-400/25 backdrop-blur-xl flex-1 relative overflow-hidden group w-full">
                 {/* 浅色模式：横线纸纹理 */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] dark:hidden"></div>
                 {/* dark 模式：深蓝渐变 + 星尘光晕 */}
                 <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-[#111939] via-[#0b1024] to-[#070b18]"></div>
                 <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_18%_0%,rgba(59,130,246,0.09),transparent_50%)]"></div>
                 <div className="hidden dark:block absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                 <div className="absolute top-0 left-0 right-0 h-2 bg-[#f4ebd0] dark:bg-gradient-to-r dark:from-[#2d3663] dark:to-[#1a2352] z-10"></div>
                 
                 <div className="flex h-full p-8 pt-10 relative z-10">
                   <div className="w-1/4 border-r border-red-300 dark:border-blue-800/50 pr-6 flex flex-col gap-6 text-[10px] font-bold tracking-widest opacity-60 dark:text-blue-300">
                      <div className="flex justify-between border-b border-gray-200 dark:border-blue-900/50 pb-1"><span>DATE</span> <span>_ _ / _ _</span></div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-blue-900/50 pb-1"><span>WEATHER</span></div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-blue-900/50 pb-1"><span>MOOD</span></div>
                   </div>

                   <div className="w-3/4 pl-8 relative flex flex-col justify-center">
                      {latestSignals.length === 0 ? (
                        <>
                          <div className="text-xs font-bold text-orange-400 dark:text-blue-400 mb-4 tracking-widest">CHANNEL IS QUIET</div>
                          <h3 className="text-2xl font-black mb-3 dark:text-blue-50">时间线还没有发出一条信号。</h3>
                          <p className="text-sm opacity-60 leading-relaxed font-serif dark:text-blue-200">
                            框架已經搭好。以後寫下的短動態和長文章，會按時間出現在這裏。
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-xs font-bold text-orange-500 dark:text-blue-400 mb-2 tracking-widest">LATEST SIGNALS</div>
                          <ul className="space-y-3 flex-1">
                            {latestSignals.map((s) => (
                              <li key={s.slug}>
                                <button onClick={() => s.type === "long" ? router.push(`/signals/${s.slug}`) : router.push('/signals')} className="w-full text-left flex items-start gap-2 group/row cursor-none">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-yellow-400 shrink-0 shadow-[0_0_6px_rgba(59,130,246,0.8)]"></span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-medium opacity-85 dark:text-blue-100 truncate group-hover/row:text-blue-500 dark:group-hover/row:text-blue-300 transition-colors">
                                      {s.type === "long" ? s.title : s.content.trim().split("\n")[0].slice(0, 40)}
                                    </span>
                                    <span className="block text-[10px] opacity-40 tracking-widest mt-0.5 dark:text-blue-300">
                                      {s.type === "long" ? "長文章" : "短動態"} · {formatSignalDate(s.date)}
                                    </span>
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                          <button onClick={() => router.push('/signals')} className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-blue-500 dark:text-blue-400 hover:gap-2 transition-all cursor-none">
                            VIEW ALL SIGNALS →
                          </button>
                        </>
                      )}
                   </div>
                 </div>
              </motion.div>
            </div>
          </div>

          {/* ── 右列：時間 + 天氣 + 音樂 ── */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <motion.div variants={itemVariants} className="bento-card bg-[#fdf5d3] dark:bg-[#0a1024]/40 dark:border-blue-400/20 backdrop-blur-xl p-6 flex flex-col justify-between overflow-hidden transition-colors duration-500 h-[180px]">
               <TimeWidget isDarkMode={isDarkMode} />
            </motion.div>

            <motion.div variants={itemVariants} className="bento-card bg-gradient-to-b from-sky-200/90 via-[#eaf3fd] to-white dark:from-[#0d1336] dark:via-[#0a1024] dark:to-[#0a1024] dark:border-blue-400/20 backdrop-blur-xl p-6 flex flex-col justify-between h-[200px]">
               <WeatherWidget isDarkMode={isDarkMode} />
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col">
              <MusicPlayer />
            </motion.div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}