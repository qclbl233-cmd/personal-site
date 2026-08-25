import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = {
  title: `影像 GALLERY · ${siteConfig.author.name}`,
  description: "本地的图片与视频，像朋友圈一样记录。",
};

export default function GalleryPage() {
  return <Gallery />;
}
