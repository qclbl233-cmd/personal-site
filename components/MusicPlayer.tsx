"use client";

import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import type { CSSProperties } from "react";
import { useMusic } from "@/components/MusicProvider"; // 👈 召唤全局引擎

/**
 * 音乐卡片：复古 CD 机样式
 *  - dark 模式：黑色金属机身
 *  - 浅色模式：米白机身（老式白色家电风）
 * 卡片本身是正方形（aspect-square）
 */
export default function MusicPlayer() {
  // 从全局引擎获取所有数据和开关！
  const { currentSong, isPlaying, volume, togglePlay, skipSong, setVolume, toggleMute } = useMusic();

  const btnBase =
    "flex items-center justify-center cursor-none transition-all duration-200 hover:scale-110 active:scale-95";

  return (
    <div className="bento-card aspect-square bg-gradient-to-b from-[#fdfbf7] via-[#efeae2] to-[#d9d4ca] dark:from-[#31313c] dark:via-[#23232c] dark:to-[#121217] p-5 flex flex-col items-center justify-between relative overflow-hidden group transition-colors duration-500 border-white/70 dark:border-blue-400/20">
      {/* 机身螺丝装饰 */}
      <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-black/20 shadow-inner dark:bg-white/15" />
      <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-black/20 shadow-inner dark:bg-white/15" />
      {/* 机身顶部高光 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-black/10 dark:bg-white/20" />

      {/* 顶部：NOW PLAYING + 品牌 */}
      <div className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest text-slate-500 dark:text-emerald-300/80">
        <span className="flex items-center gap-1.5">
          {isPlaying && <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></span>}
          NOW PLAYING
        </span>
        <span className="text-slate-400 dark:text-white/40">KUGOU</span>
      </div>

      {/* LCD 显示屏（浅色：复古灰绿屏 + 深绿字；dark：黑底绿字） */}
      <div className="w-full bg-[#d9e5bf] dark:bg-black/85 border border-black/10 dark:border-white/10 rounded-md px-3 py-2 font-mono text-[10px] text-[#3f5226] dark:text-emerald-300/95 shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] overflow-hidden relative">
        <div className="whitespace-nowrap overflow-hidden">
          {isPlaying ? (
            <span className="inline-block animate-[marquee_8s_linear_infinite]">
              {currentSong.title} — {currentSong.artist}
            </span>
          ) : (
            <span>{currentSong.title}</span>
          )}
        </div>
        {/* LCD 呼吸光 */}
        <div className="absolute inset-0 bg-[#8aa25a]/10 dark:bg-emerald-400/5 pointer-events-none" />
      </div>

      {/* CD 光盘（银色 + 封面 + 中心孔 + 反光） */}
      <div className="relative my-1">
        {/* 托盘凹槽阴影 */}
        <div className="absolute -inset-2.5 rounded-full bg-black/25 blur-md dark:bg-black/50" />
        <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full ${isPlaying ? "animate-[spin_5s_linear_infinite]" : ""}`}>
          {/* 光盘银面（同心渐变） */}
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#f3f4f6,#9ca3af,#e5e7eb,#b0b7c3,#f3f4f6,#a3aab5,#e5e7eb,#c7cdd6,#f3f4f6)] shadow-[0_6px_16px_rgba(0,0,0,0.25)] dark:shadow-[0_6px_16px_rgba(0,0,0,0.55)]" />
          {/* 封面圆 */}
          <div
            className="absolute inset-[10px] rounded-full overflow-hidden border border-white/40"
            style={{ backgroundImage: `url(${currentSong.cover})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
          {/* 中心孔 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1a1a20] border-2 border-gray-400/60 shadow-inner" />
          {/* 高光反光 */}
          <div className="absolute inset-0 rounded-full pointer-events-none bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.55),transparent_45%)]" />
        </div>
      </div>

      {/* 控制按钮（凸起圆钮：浅色机身配浅灰钮，dark 配深灰钮） */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => skipSong("prev")}
          className={`${btnBase} w-9 h-9 rounded-full bg-gradient-to-b from-[#eae6df] to-[#cbc6bb] border border-white/80 shadow-[0_3px_6px_rgba(0,0,0,0.18)] text-slate-600 hover:text-slate-900 dark:from-[#3c3c46] dark:to-[#20202a] dark:border-white/10 dark:shadow-[0_3px_6px_rgba(0,0,0,0.5)] dark:text-white/75 dark:hover:text-white`}
        >
          <SkipBack className="w-4 h-4 fill-current" />
        </button>
        <button
          onClick={togglePlay}
          className={`${btnBase} w-12 h-12 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 border border-white/30 dark:border-white/20 shadow-[0_4px_10px_rgba(0,0,0,0.35)] text-white`}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>
        <button
          onClick={() => skipSong("next")}
          className={`${btnBase} w-9 h-9 rounded-full bg-gradient-to-b from-[#eae6df] to-[#cbc6bb] border border-white/80 shadow-[0_3px_6px_rgba(0,0,0,0.18)] text-slate-600 hover:text-slate-900 dark:from-[#3c3c46] dark:to-[#20202a] dark:border-white/10 dark:shadow-[0_3px_6px_rgba(0,0,0,0.5)] dark:text-white/75 dark:hover:text-white`}
        >
          <SkipForward className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* 音量滑条 */}
      <div className="flex items-center gap-2 w-full px-1">
        <button onClick={toggleMute} className="text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white transition-colors cursor-none shrink-0">
          {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider flex-1 cursor-none outline-none"
          style={{ "--fill": `${volume * 100}%` } as CSSProperties}
        />
        <span className="text-[9px] font-mono text-slate-400 dark:text-white/40 w-8 text-right">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}
