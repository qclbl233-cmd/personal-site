// config/site.ts

export const siteConfig = {
  // 1. 个人基础信息
  author: {
    name: "Sunshine",
    handle: "生命的长度，即是春天的长短。",
    avatar: "/nira.png", // 以后这里可以换成图片链接，比如 "/avatar.jpg"
    bio: "“”",
    freq: "03.18",
  },
  
  // 2. C位巨幕海报信息
  hero: {
    title: "TURNSO",
    subtitle: "欲变世界，先变其身",
    description: "Be the change you want to see in the world.",
  },

  // 3. 动态数据统计 (暂时写死，以后可以连数据库)
  stats: {
    total: 0,
    short: 0,
    long: 0,
  },

  // 4. 简介卡社交链接（icon: github | bilibili | steam | douyin；bg 为徽章渐变底色）
  socials: [
    { name: "GitHub", url: "https://github.com/qclbl233-cmd", icon: "github", bg: "linear-gradient(135deg,#4b5563,#111827)" },
    { name: "哔哩哔哩", url: "https://space.bilibili.com/1566148032?spm_id_from=333.1007.0.0", icon: "bilibili", bg: "linear-gradient(135deg,#fb7299,#e33e5c)" },
    { name: "Steam", url: "https://steamcommunity.com/profiles/76561199109067176/", icon: "steam", bg: "linear-gradient(135deg,#2a475e,#171a21)" },
    { name: "抖音", url: "https://v.douyin.com/lOVwjpBMNUI/", icon: "douyin", bg: "linear-gradient(135deg,#1f1f23,#3a3a42)" },
  ],
};