import type { Metadata } from "next";
import { getAllSignals } from "@/lib/signals";
import { siteConfig } from "@/config/site";
import SignalsTimeline, { type Filter } from "@/components/SignalsTimeline";

export const metadata: Metadata = {
  title: `動態 SIGNAL · ${siteConfig.author.name}`,
  description: "短動態與長文章，按時間出現在這裡。",
};

// 动态渲染：每次请求实时读取 data/signals/，新发的动态刷新即可见
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function SignalsPage({ searchParams }: Props) {
  // 筛选完全由 URL 驱动（服务端处理，首屏渲染就是正确结果，无闪烁）
  const { type } = await searchParams;
  const initialFilter: Filter = type === "short" || type === "long" ? type : "all";

  const all = getAllSignals();
  const signals = initialFilter === "all" ? all : all.filter((s) => s.type === initialFilter);

  return <SignalsTimeline signals={signals} allSignals={all} initialFilter={initialFilter} />;
}
