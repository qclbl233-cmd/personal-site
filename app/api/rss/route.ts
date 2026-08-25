// app/api/rss/route.ts
// RSS 订阅源：把动态板块变成可订阅的信号流（呼应顶栏的 LIVE • RSS）
import { getAllSignals } from "@/lib/signals";
import { siteConfig } from "@/config/site";

// 正式域名通过环境变量 NEXT_PUBLIC_SITE_URL 配置（如 https://example.com），未配置时回退到本机
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const signals = getAllSignals();

  const items = signals
    .map((s) => {
      const date = new Date(s.date);
      const link = s.type === "long" ? `${BASE_URL}/signals/${s.slug}` : `${BASE_URL}/signals`;
      const title = s.type === "long" ? s.title ?? s.slug : s.content.trim().split("\n")[0] ?? "動態";
      const desc = s.summary ?? s.content.slice(0, 200);
      return `    <item>
      <title>${esc(title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${date.toUTCString()}</pubDate>
      <description>${esc(desc)}</description>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(siteConfig.author.name)} · Signal</title>
    <link>${BASE_URL}/signals</link>
    <description>${esc(siteConfig.author.bio)}</description>
    <language>zh-cn</language>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
