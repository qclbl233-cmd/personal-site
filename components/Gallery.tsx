"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sun, Moon, Plus, Trash2, Heart, Image as ImageIcon, Film, Images, Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { siteConfig } from "@/config/site";
import { getAllPosts, addPost, deletePost, setLikes, type GalleryPost } from "@/lib/galleryDB";

function formatDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * 影像 GALLERY：本地上传图片/视频，朋友圈式时间线展示（IndexedDB 持久化）
 */
export default function Gallery() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<Record<number, string>>({}); // 仅用于卸载/更新时回收 objectURL
  const [urls, setUrls] = useState<Record<number, string>>({}); // 驱动渲染的 URL 映射

  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryPost | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [showCaption, setShowCaption] = useState(false);

  const load = useCallback(async () => {
    const all = await getAllPosts();
    setPosts(all);
    // 重新生成 objectURL（先回收旧的）
    Object.values(urlsRef.current).forEach((u) => URL.revokeObjectURL(u));
    const map: Record<number, string> = {};
    all.forEach((p) => {
      if (p.id != null) map[p.id] = URL.createObjectURL(p.blob);
    });
    urlsRef.current = map;
    setUrls(map);
  }, []);

  useEffect(() => {
    load();
    return () => Object.values(urlsRef.current).forEach((u) => URL.revokeObjectURL(u));
  }, [load]);

  // 选择本地文件后：弹出文字输入窗口（不立即上传）
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setPendingFiles(files);
    setCaption("");
    setShowCaption(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 确定文字 → 逐条上传
  const submitCaption = async () => {
    setShowCaption(false);
    setUploading(true);
    try {
      for (const file of pendingFiles) {
        await addPost({
          type: file.type.startsWith("video") ? "video" : "image",
          blob: file,
          caption: caption.trim(),
          date: new Date().toISOString(),
          likes: 0,
        });
      }
      await load();
    } finally {
      setUploading(false);
      setPendingFiles([]);
    }
  };

  // 请求删除 → 打开确认弹窗
  const askDelete = (post: GalleryPost) => setDeleteTarget(post);

  // 确认删除
  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    await deletePost(deleteTarget.id);
    setDeleteTarget(null);
    await load();
  };

  const handleLike = async (post: GalleryPost) => {
    if (post.id == null) return;
    const next = post.likes > 0 ? 0 : 1; // 简单切换：未赞→赞1，已赞→取消
    await setLikes(post.id, next);
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, likes: next } : p)));
  };

  return (
    <div className="min-h-screen transition-colors duration-700 ease-in-out bg-[#e6eff8] dark:bg-[#030614] text-slate-800 dark:text-slate-200 relative cursor-none font-sans pb-24">
      {/* 🌟 顶部全局导航栏（GALLERY 高亮） */}
      <header className="max-w-[1200px] mx-auto p-4 md:px-8 pt-6 flex items-center justify-center relative z-50">
        <div className="hidden md:flex items-center gap-3 shrink-0 text-sm font-bold tracking-widest uppercase">
          <span onClick={() => router.push('/')} className="opacity-70 hover:opacity-100 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-blue-500/10 hover:text-blue-400 dark:hover:text-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] whitespace-nowrap">主頁 HOME</span>
          <span onClick={() => router.push('/signals')} className="opacity-70 hover:opacity-100 px-4 py-2 rounded-full transition-all duration-300 cursor-none hover:scale-110 hover:bg-blue-500/10 hover:text-blue-400 dark:hover:text-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] whitespace-nowrap">動態 SIGNAL</span>
          <span className="flex items-center gap-1 text-blue-300 bg-blue-900/40 px-4 py-2 rounded-full backdrop-blur-md border border-blue-400/20 shadow-[0_0_10px_rgba(59,130,246,0.3)] cursor-none hover:scale-110 duration-300 whitespace-nowrap">
            影像 GALLERY
          </span>
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
        {/* 标题区 + 添加按钮 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold opacity-50 tracking-widest uppercase mb-3 dark:text-blue-200">
              <Images className="w-3.5 h-3.5" /> Gallery / {String(posts.length).padStart(3, "0")}
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#1b2554] dark:text-white mb-2">影像</h1>
            <p className="text-sm opacity-60 font-serif italic dark:text-blue-200">像发朋友圈一样，记录本地图片和视频。</p>
          </div>

          {/* 隐藏的文件选择框：支持多选图片/视频 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-300/90 dark:bg-blue-600/40 dark:border dark:border-blue-400/30 text-yellow-900 dark:text-blue-100 text-xs font-bold tracking-widest shadow-md hover:scale-105 transition-all duration-300 cursor-none disabled:opacity-60"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {uploading ? "上傳中…" : "添加影像"}
          </button>
        </motion.div>

        {/* 朋友圈式时间线 */}
        {posts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bento-card bg-white/70 dark:bg-[#0a1024]/40 dark:border-blue-400/20 backdrop-blur-xl p-12 text-center">
            <div className="text-5xl mb-4 opacity-60">🖼️</div>
            <div className="text-xs font-bold text-orange-400 dark:text-blue-400 mb-3 tracking-widest">NO FRAMES YET</div>
            <p className="text-sm opacity-60 font-serif dark:text-blue-200">还没有任何影像。点击右上角「添加影像」，把本地的图片和视频放进来吧。</p>
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: Math.min(i * 0.05, 0.3) }}
                className="bento-card bg-white/90 dark:bg-[#0a1024]/50 dark:border-blue-400/20 backdrop-blur-xl p-5"
              >
                {/* 头部：头像 + 名字 + 时间 + 类型 + 删除 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-blue-400/30 bg-blue-50 dark:bg-blue-900/40 shrink-0">
                    <img src={siteConfig.author.avatar} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-slate-800 dark:text-blue-50">{siteConfig.author.name}</div>
                    <div className="text-[10px] opacity-40 tracking-wider dark:text-blue-300">{formatDate(post.date)}</div>
                  </div>
                  <span className={`ml-auto flex items-center gap-1 text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full ${
                    post.type === "video"
                      ? "bg-blue-100 dark:bg-blue-600/30 text-blue-700 dark:text-blue-200"
                      : "bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-200"
                  }`}>
                    {post.type === "video" ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {post.type === "video" ? "VIDEO" : "IMAGE"}
                  </span>
                  <button
                    onClick={() => askDelete(post)}
                    className="opacity-30 hover:opacity-100 hover:text-red-500 transition-all cursor-none"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 文字 */}
                {post.caption && (
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-blue-100 mb-3 whitespace-pre-wrap">{post.caption}</p>
                )}

                {/* 媒体 */}
                {post.type === "video" ? (
                  <video src={urls[post.id!]} controls playsInline className="w-full rounded-xl bg-black/10 dark:bg-blue-950/50 max-h-[420px]" />
                ) : (
                  <img src={urls[post.id!]} alt={post.caption || "影像"} className="w-full rounded-xl bg-black/5 dark:bg-blue-950/40 max-h-[420px] object-contain" />
                )}

                {/* 点赞 */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200/70 dark:border-blue-900/40">
                  <button
                    onClick={() => handleLike(post)}
                    className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest transition-all duration-300 cursor-none hover:scale-110 ${
                      post.likes > 0 ? "text-red-500" : "text-slate-400 dark:text-blue-300/60"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likes > 0 ? "fill-red-500" : ""}`} />
                    {post.likes > 0 ? `${post.likes} 赞` : "点赞"}
                  </button>
                  <span className="text-[10px] opacity-30 ml-auto tracking-widest dark:text-blue-300">LOCAL STORAGE</span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      {/* 🗑️ 删除确认弹窗 */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bento-card bg-white/95 dark:bg-[#0d1229]/95 dark:border-blue-400/20 backdrop-blur-xl p-6 w-full max-w-sm text-center"
          >
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-black text-lg mb-1 text-slate-800 dark:text-blue-50">删除这条影像？</h3>
            <p className="text-xs opacity-50 mb-6 dark:text-blue-300">删除后无法恢复（仅本机数据）</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-blue-950/40 dark:border dark:border-blue-400/20 text-xs font-bold tracking-widest text-slate-600 dark:text-blue-200 hover:scale-105 transition-all duration-300 cursor-none"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold tracking-widest hover:scale-105 transition-all duration-300 cursor-none shadow-md"
              >
                删除
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ✍️ 上传文字输入弹窗（页面内实现） */}
      {showCaption && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bento-card bg-white/95 dark:bg-[#0d1229]/95 dark:border-blue-400/20 backdrop-blur-xl p-6 w-full max-w-md"
          >
            <h3 className="font-black text-lg mb-1 text-slate-800 dark:text-blue-50">写点什么…</h3>
            <p className="text-xs opacity-50 mb-4 dark:text-blue-300">像发朋友圈那样（{pendingFiles.length} 个文件，可留空）</p>
            <textarea
              autoFocus
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-white/80 dark:bg-blue-950/40 dark:border dark:border-blue-400/20 border border-gray-200 p-3 text-sm outline-none resize-none focus:border-blue-400 dark:focus:border-blue-400/50"
              placeholder="这一刻的想法…"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowCaption(false); setPendingFiles([]); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-blue-950/40 dark:border dark:border-blue-400/20 text-xs font-bold tracking-widest text-slate-600 dark:text-blue-200 hover:scale-105 transition-all duration-300 cursor-none"
              >
                取消
              </button>
              <button
                onClick={submitCaption}
                disabled={uploading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-yellow-300/90 dark:bg-blue-600/40 dark:border dark:border-blue-400/30 text-yellow-900 dark:text-blue-100 text-xs font-bold tracking-widest hover:scale-105 transition-all duration-300 cursor-none disabled:opacity-60"
              >
                发布
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
