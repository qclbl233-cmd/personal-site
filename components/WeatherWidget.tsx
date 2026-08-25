"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

// 天气代码映射 (WMO 气象代码转化为直观的图标和文字)
const getWeatherInfo = (code: number, isNight: boolean) => {
  if (code === 0) return { text: "晴朗", icon: isNight ? "🌌" : "☀️" };
  if (code === 1 || code === 2 || code === 3) return { text: "多云", icon: isNight ? "☁️" : "⛅" };
  if (code >= 45 && code <= 48) return { text: "起雾", icon: "🌫️" };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { text: "下雨", icon: "🌧️" };
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return { text: "下雪", icon: "❄️" };
  if (code >= 95) return { text: "雷暴", icon: "⛈️" };
  return { text: "未知", icon: "✨" };
};

export default function WeatherWidget({ isDarkMode }: { isDarkMode: boolean }) {
  const [weather, setWeather] = useState<{ temp: number; wind: number; code: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // ⚠️ 部署前请改成你所在城市的经纬度：
      //    在浏览器打开 https://open-meteo.com/ 搜索城市即可看到 latitude / longitude
      // 例如：北京 latitude=39.9042, longitude=116.4074
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true"
      );
      const data = await res.json();
      setWeather({
        temp: Math.round(data.current_weather.temperature),
        wind: Math.round(data.current_weather.windspeed),
        code: data.current_weather.weathercode,
      });
    } catch (error) {
      console.error("天气获取失败", error);
    } finally {
      setTimeout(() => setLoading(false), 800); // 假装加载一会儿，增加 UI 动效感
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const weatherInfo = weather ? getWeatherInfo(weather.code, isDarkMode) : { text: "读取中", icon: "📡" };

  return (
    <>
      {/* 顶部标题 */}
      <div className="flex justify-between text-[10px] font-bold tracking-widest opacity-50 border-b border-dashed border-gray-300 dark:border-blue-800/50 pb-2 mb-4 dark:text-blue-300 uppercase">
        <span>LOCAL SKY</span>
        <span>{isDarkMode ? "NIGHT SKY" : "DAYLIGHT"}</span>
      </div>

      {/* 天气核心信息 */}
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="w-14 h-14 rounded-full border-4 border-white/60 dark:border-blue-900 border-t-sky-400 animate-spin"></div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-blue-900/40 border border-white/90 dark:border-blue-400/20 shadow-inner flex items-center justify-center">
            <span className="text-4xl drop-shadow-md animate-[pulse_3s_ease-in-out_infinite]">
              {weatherInfo.icon}
            </span>
          </div>
        )}
        <div>
          <div className="text-4xl font-black text-slate-700 dark:text-white leading-none">
            {loading ? "--" : weather?.temp}°
          </div>
          <div className="text-sm font-bold opacity-70 dark:text-blue-200 tracking-wider mt-1">
            {weatherInfo.text}
          </div>
        </div>
      </div>

      {/* 底部风速与刷新按钮 */}
      <div className="text-[10px] opacity-40 mt-3 text-center dark:text-blue-300 tracking-widest">
        測距儀定位 • 風速 {loading ? "--" : weather?.wind} km/h
      </div>
      
      <button 
        onClick={fetchWeather}
        disabled={loading}
        className="w-full mt-4 py-2 bg-white dark:bg-blue-900/30 dark:border dark:border-blue-500/20 rounded-lg text-[10px] font-bold tracking-widest shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-blue-800/40 cursor-none relative z-10 dark:text-blue-200 transition-all disabled:opacity-50"
      >
        <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
        {loading ? "同步中..." : "重新同步天气"}
      </button>
    </>
  );
}