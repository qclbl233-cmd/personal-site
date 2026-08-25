// 服务端包装页：读取动态数据，传给客户端组件渲染。
// 页面主体在 components/HomeContent.tsx
import { getStats, getLatestSignals } from "@/lib/signals";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return <HomeContent stats={getStats()} latestSignals={getLatestSignals(3)} />;
}
