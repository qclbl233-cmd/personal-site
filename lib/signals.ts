// lib/signals.ts
// 动态数据层：读取 data/signals/ 下的 Markdown 文件，解析 frontmatter，按时间倒序返回。
// 以后如果要换成数据库，只需要改这个文件，页面不用动。

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type SignalType = "short" | "long";

export interface Signal {
  slug: string;
  title?: string; // 短动态通常没有标题
  date: string; // ISO 格式，如 2025-06-01T21:30:00
  type: SignalType;
  mood?: string;
  weather?: string;
  tags: string[];
  images?: string[];
  summary?: string; // 列表页展示用摘要
  cover?: string; // 长文章封面
  content: string; // markdown 原文
  contentHtml?: string; // 渲染后的 HTML（长文章详情页用）
}

const signalsDir = path.join(process.cwd(), "data", "signals");

function parseDate(raw: string): string {
  // 支持 "2025-06-01" / "2025-06-01 21:30" / "2025-06-01T21:30:00"
  const d = raw.trim().replace(" ", "T");
  return isNaN(new Date(d).getTime()) ? new Date().toISOString() : new Date(d).toISOString();
}

export function getAllSignals(): Signal[] {
  if (!fs.existsSync(signalsDir)) return [];

  const files = fs
    .readdirSync(signalsDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const signals: Signal[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(signalsDir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx?$/, "");

    return {
      slug,
      title: data.title,
      date: parseDate(data.date ?? file.slice(0, 10)),
      type: (data.type === "long" ? "long" : "short") as SignalType,
      mood: data.mood,
      weather: data.weather,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      images: Array.isArray(data.images) ? data.images.map(String) : undefined,
      summary: data.summary,
      cover: data.cover,
      content,
    };
  });

  // 按时间倒序（最新的在最上面）
  return signals.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getSignalBySlug(slug: string): Promise<Signal | null> {
  const signal = getAllSignals().find((s) => s.slug === slug);
  if (!signal) return null;

  // 只在详情页需要时渲染 HTML，避免列表页做无谓的渲染
  const processed = await remark().use(html).process(signal.content);
  signal.contentHtml = processed.toString();
  return signal;
}

// 首页数据看板用的统计
export function getStats() {
  const all = getAllSignals();
  return {
    total: all.length,
    short: all.filter((s) => s.type === "short").length,
    long: all.filter((s) => s.type === "long").length,
  };
}

// 首页最新动态预览
export function getLatestSignals(count = 3): Signal[] {
  return getAllSignals().slice(0, count);
}
