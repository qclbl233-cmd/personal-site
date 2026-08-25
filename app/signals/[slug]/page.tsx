import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSignalBySlug, getAllSignals } from "@/lib/signals";
import { siteConfig } from "@/config/site";
import SignalDetail from "@/components/SignalDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

// 构建时预生成所有动态的详情页（静态导出）
export function generateStaticParams() {
  return getAllSignals().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const signal = await getSignalBySlug(slug);
  if (!signal) return { title: `動態 · ${siteConfig.author.name}` };
  return {
    title: `${signal.title ?? "個人動態"} · ${siteConfig.author.name}`,
    description: signal.summary ?? signal.content.slice(0, 80),
  };
}

export default async function SignalDetailPage({ params }: Props) {
  const { slug } = await params;
  const signal = await getSignalBySlug(slug);
  if (!signal) notFound();
  return <SignalDetail signal={signal} />;
}
