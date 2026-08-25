"use client";

import { useState, useEffect } from "react";

export default function TimeWidget({ isDarkMode }: { isDarkMode: boolean }) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div className="w-full h-full flex items-center justify-center animate-pulse">
        <div className="w-24 h-8 bg-gray-200 dark:bg-blue-900/50 rounded"></div>
      </div>
    );
  }

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds(); 
  
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const day = days[time.getDay()];

  const offset = -(time.getTimezoneOffset() / 60);
  const tzString = `UTC${offset >= 0 ? "+" : ""}${offset}`;

  const totalSecondsInDay = 86400;
  const passedSeconds = time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds();
  const dayProgress = ((passedSeconds / totalSecondsInDay) * 100).toFixed(1);

  return (
    <>
      <div className="flex justify-between text-[10px] font-bold tracking-widest opacity-50 dark:text-blue-300 relative z-10 uppercase">
        <span>LOCAL TIME</span>
        <span>{tzString}</span>
      </div>

      <div className="flex justify-center items-center relative z-10 mt-2">
        <span className="text-[3.5rem] font-black tracking-tighter text-yellow-900 dark:text-white drop-shadow-md flex items-center">
          {hours}
          <span className={`pb-2 mx-1 opacity-${seconds % 2 === 0 ? '100' : '40'} transition-opacity duration-300`}>:</span>
          {minutes}
        </span>
        <span className="text-5xl absolute -right-4 -top-2 opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-transform hover:rotate-12 hover:scale-110 cursor-none">
          {isDarkMode ? "🌔" : "☀️"}
        </span>
      </div>

      <div className="w-full mt-2 relative z-10">
        <div className="text-center text-xs font-bold opacity-60 dark:text-blue-300 mb-3">
          {month}月{date}日 {day}
        </div>
        
        <div className="w-full">
          <div className="flex justify-between text-[8px] font-bold opacity-40 dark:text-blue-300 mb-1 tracking-widest">
            <span>DAY PROGRESS</span>
            <span>{dayProgress}%</span>
          </div>
          <div className="w-full h-1 bg-yellow-200/50 dark:bg-blue-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500 dark:bg-blue-400 rounded-full transition-all duration-1000 ease-linear shadow-[0_0_5px_rgba(250,204,21,0.5)] dark:shadow-[0_0_5px_rgba(96,165,250,0.5)]"
              style={{ width: `${dayProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}