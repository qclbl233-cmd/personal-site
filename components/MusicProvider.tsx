"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

// 这里依然是你的私人歌单！
const PLAYLIST = [
  {
    id: 1,
    title: "慵懒",
    artist: "Dudley G",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500&auto=format&fit=crop",
    src: "/music/song1.mp3", 
  },
  {
    id: 2,
    title: "DEAR~",
    artist: "NANASE",
    cover: "https://s201.lzjoy.com/res/statics/fileupload/normal/202311/a59c979e655ca07a914de.png?65157bd54b2a57235af8a952cc0f3eb3087e88cf&x-oss-process=image/resize,h_300,m_lfit",
    src: "/music/song2.mp3", 
  },
  {
    id: 3,
    title: "Iwatodai Dorm -Reload-",
    artist: "アトラスサウンドチーム",
    cover: "https://assets.crownnote.com/s3fs-public/%21%21%21%213_33.jpg",
    src: "/music/song3.mp3",
  },
  {
    id: 4,
    title: "Signs Of Love",
    artist: "目黑将司",
    cover: "https://ts2.tc.mm.bing.net/th/id/OIP-C.DmlNx6BLzjsbdraFEa_UUwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    src: "/music/song4.mp3",
  },
  {
    id: 5,
    title: "Beneath the Mask",
    artist: "目黑将司",
    cover: "https://th.bing.com/th/id/OIP.cmhXxsGUGufiLEcyjaQhqAHaHa?w=108&h=108&c=1&bgcl=ec23c4&r=0&o=7&dpr=2&pid=ImgRC&rm=3",
    src: "/music/song5.mp3",
  },
  {
 id: 6,
    title: "Color Your Night",
    artist: "Lotus Juice&高橋あず美",
    cover: "https://img1.kuwo.cn/star/albumcover/500/s3s8/52/3332212308.jpg",
    src: "/music/song6.mp3",
  },
]
    // 定义魔法属性
interface MusicContextType {
  currentSong: typeof PLAYLIST[0];
  isPlaying: boolean;
  volume: number;
  togglePlay: () => void;
  skipSong: (direction: "next" | "prev") => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); // 默认 20% 音量
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = PLAYLIST[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const skipSong = (direction: "next" | "prev") => {
    const newIndex = direction === "next" 
      ? (currentSongIndex === PLAYLIST.length - 1 ? 0 : currentSongIndex + 1)
      : (currentSongIndex === 0 ? PLAYLIST.length - 1 : currentSongIndex - 1);
    setCurrentSongIndex(newIndex);
    if (isPlaying && audioRef.current) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const toggleMute = () => setVolume(volume > 0 ? 0 : 0.2);

  return (
    <MusicContext.Provider value={{ currentSong, isPlaying, volume, togglePlay, skipSong, setVolume, toggleMute }}>
      {/* 隐形的播放器，它将笼罩整个网站！ */}
      {children}
      <audio ref={audioRef} src={currentSong.src} onEnded={() => skipSong("next")} />
    </MusicContext.Provider>
  );
}

// 暴露一个挂钩，让遥控器可以随时连接引擎
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic 必须在 MusicProvider 内部使用");
  return context;
};