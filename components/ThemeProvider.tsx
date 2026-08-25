"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 網頁加載時，去緩存裏找之前的記憶
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // 切換模式時，同步修改緩存
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 暴露出遙控器
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme 必須在 ThemeProvider 內部使用");
  return context;
};