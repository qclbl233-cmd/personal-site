"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Sun, Moon, MapPin, BookOpen, Sparkles, User, Sword, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import SocialBadges from "@/components/SocialBadges";

const RESUME = {
  location: "China",
  about: "（個人簡介內容待補充... 可以寫下你的世界觀、座右銘或是正在做的事情。）",
  education: {
    school: "（學校名稱待補充）",
    period: "---- — ----",
    major: "（專業名稱待補充）",
    desc: "（在此處填寫你的校園經歷、獲得的榮譽或參與的項目...）"
  },
  interests: "（興趣愛好待補充... 比如喜歡的遊戲、動漫、音樂風格等）",
  attributes: [
    { label: "勇氣 Courage", value: 85, color: "bg-blue-400" },
    { label: "魅力 Charm", value: 70, color: "bg-pink-400" },
    { label: "學力 Academics", value: 90, color: "bg-yellow-400" }
  ],
  equipment: ["Next.js", "React", "VS Code", "Tailwind CSS", "Framer Motion"],
};

export default function ProfilePage() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [showTransition, setShowTransition] = useState(true);
  const loopVideoRef = useRef<HTMLVideoElement>(null);

  const handleTransitionEnd = () => {
    setShowTransition(false); 
    if (loopVideoRef.current) {
      loopVideoRef.current.play(); 
    }
  };

  return (
    <div className="min-h-screen bg-[#0055ff] overflow-x-hidden relative cursor-none font-sans">

      <video
        ref={loopVideoRef}
        src="/loop.mp4"
        loop
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {showTransition && (
        <video
          src="/transition.mp4"
          autoPlay
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-10 pointer-events-none"
          onEnded={handleTransitionEnd}
        />
      )}

      {/* 🌟 頂部全局導航欄 */}
      <header className="max-w-[1700px] mx-auto p-4 md:px-8 pt-6 flex items-center justify-center relative z-50 text-white drop-shadow-md">
        
        <div className="hidden md:flex items-center gap-3 shrink-0 text-sm font-bold tracking-widest uppercase drop-shadow-lg">
          <span onClick={() => router.push('/')} className="text-white/90 hover:text-blue-200 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(147,197,253,0.25)] drop-shadow-md whitespace-nowrap">主頁 HOME</span>
          <span onClick={() => router.push('/signals')} className="text-white/90 hover:text-blue-200 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(147,197,253,0.25)] drop-shadow-md whitespace-nowrap">動態 SIGNAL</span>
          <span onClick={() => router.push('/gallery')} className="text-white/90 hover:text-blue-200 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(147,197,253,0.25)] drop-shadow-md whitespace-nowrap">影像 GALLERY</span>
          <span className="flex items-center gap-1 text-blue-100 bg-blue-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-blue-400/30 cursor-none shadow-[0_0_15px_rgba(59,130,246,0.6)] hover:scale-110 duration-300 whitespace-nowrap">檔案 PROFILE</span>
        </div>

        <div className="absolute right-4 md:right-8 flex items-center gap-4 shrink-0">
          <div className="text-[10px] font-bold tracking-wider hidden md:block opacity-60 drop-shadow-md">LIVE • RSS</div>
          <button onClick={toggleDarkMode} className="w-12 h-6 rounded-full bg-white/20 dark:bg-blue-950/60 border border-white/40 dark:border-blue-400/30 shadow-inner flex items-center p-1 cursor-none relative backdrop-blur-md">
            <motion.div animate={{ x: isDarkMode ? 24 : 0 }} className="w-4 h-4 rounded-full bg-white dark:bg-blue-300 shadow-[0_0_8px_rgba(147,197,253,0.8)] flex items-center justify-center">
              {isDarkMode ? <Moon className="w-2 h-2 text-blue-900" /> : <Sun className="w-2 h-2 text-orange-400" />}
            </motion.div>
          </button>
        </div>
      </header>

      <main className="relative z-20 flex justify-center px-4 pt-10 pb-24 min-h-[85vh]">
        <motion.div
          initial={{ opacity: 0, y: -700, rotate: -3, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          // 💡 这里的 delay: 0.6 是精髓！它会让卡片等结城理掉进水里后，刚好砸下来！(如果不准你可以微调这个 0.6)
          transition={{ delay: 0.6, type: "spring", damping: 15, stiffness: 50 }}
          className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col"
        >
          {/* ── 头部：身份识别区 ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/20 pb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/20 border-2 border-white/40 overflow-hidden shadow-lg shrink-0">
                <img src={siteConfig.author.avatar} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-widest drop-shadow-md">{siteConfig.author.name}</h1>
                <p className="text-white/70 text-sm tracking-widest mt-1 uppercase">{siteConfig.author.handle} · Personal Space</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-[10px] text-white/80 tracking-widest uppercase font-bold">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {RESUME.location}</span>
                </div>
              </div>
            </div>
            <div className="shrink-0 pb-2">
              <SocialBadges size="lg" />
            </div>
          </div>

          {/* ── 核心内容区：双列网格 ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8 flex-1">
            
            {/* 左侧主要内容 */}
            <div className="md:col-span-2 flex flex-col gap-8">
              <section>
                <h2 className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-blue-200 mb-4 drop-shadow-sm">
                  <span className="w-1 h-3.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span> <User className="w-3.5 h-3.5" /> About
                </h2>
                <p className="text-sm leading-relaxed text-white/80 tracking-wide bg-black/10 p-5 rounded-xl border border-white/10">
                  {RESUME.about}
                </p>
              </section>

              <section>
                <h2 className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-blue-200 mb-4 drop-shadow-sm">
                  <span className="w-1 h-3.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span> <BookOpen className="w-3.5 h-3.5" /> Education
                </h2>
                <div className="border-l-2 border-white/20 pl-5 ml-1.5">
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 mb-1">
                      <span className="text-base font-bold text-white tracking-widest">{RESUME.education.school}</span>
                      <span className="text-[10px] font-mono text-white/50">{RESUME.education.period}</span>
                    </div>
                    <p className="text-sm text-blue-200 font-bold tracking-wide">{RESUME.education.major}</p>
                    <p className="text-xs text-white/60 mt-3 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                      {RESUME.education.desc}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* 右侧边栏 */}
            <div className="md:col-span-1 flex flex-col gap-8">
              <section>
                <h2 className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-blue-200 mb-4 drop-shadow-sm">
                  <span className="w-1 h-3.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span> <Sword className="w-3.5 h-3.5" /> Attributes
                </h2>
                <div className="flex flex-col gap-4 bg-black/10 p-5 rounded-xl border border-white/10">
                  {RESUME.attributes.map((attr) => (
                    <div key={attr.label}>
                      <div className="flex justify-between text-[9px] font-bold text-white/70 mb-1.5 tracking-widest uppercase">
                        <span>{attr.label}</span>
                        <span>Lv.{Math.floor(attr.value / 20)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${attr.value}%` }}
                          transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                          className={`h-full ${attr.color} shadow-[0_0_8px_currentColor]`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-blue-200 mb-4 drop-shadow-sm">
                  <span className="w-1 h-3.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span> <Coffee className="w-3.5 h-3.5" /> Equipment
                </h2>
                <div className="flex flex-wrap gap-2">
                  {RESUME.equipment.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-[10px] font-bold tracking-wider text-white/90 shadow-sm cursor-none">
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-blue-200 mb-4 drop-shadow-sm">
                  <span className="w-1 h-3.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span> <Sparkles className="w-3.5 h-3.5" /> Interests
                </h2>
                <p className="text-xs leading-relaxed text-white/60 tracking-wide italic">
                  {RESUME.interests}
                </p>
              </section>
            </div>

          </div>

          {/* ── 页脚 ── */}
          <div className="mt-10 pt-6 border-t border-white/20 text-center text-[9px] tracking-widest uppercase text-white/30 font-bold">
            {siteConfig.author.name} · Personal File / 001 · CLASSIFIED
          </div>
        </motion.div>
      </main>
    </div>
  );
}