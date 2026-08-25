// lib/galleryDB.ts
// 影像页面数据层：IndexedDB 持久化（图片/视频 Blob 都可存，刷新不丢失）

export interface GalleryPost {
  id?: number;
  type: "image" | "video";
  blob: Blob;
  caption: string;
  date: string; // ISO 字符串
  likes: number;
}

const DB_NAME = "vibe-gallery";
const STORE = "posts";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// 读取全部（按时间倒序）
export async function getAllPosts(): Promise<GalleryPost[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, "readonly");
    const req = t.objectStore(STORE).getAll();
    req.onsuccess = () => {
      const list = (req.result as GalleryPost[]).sort((a, b) => (a.date < b.date ? 1 : -1));
      resolve(list);
    };
    req.onerror = () => reject(req.error);
  });
}

// 新增一条
export async function addPost(post: GalleryPost): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, "readwrite");
    const req = t.objectStore(STORE).add({ ...post, likes: post.likes ?? 0 });
    req.onsuccess = () => resolve(req.result as number);
    req.onerror = () => reject(req.error);
  });
}

// 删除一条
export async function deletePost(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, "readwrite");
    const req = t.objectStore(STORE).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// 更新点赞数
export async function setLikes(id: number, likes: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, "readwrite");
    const req = t.objectStore(STORE).get(id);
    req.onsuccess = () => {
      const post = req.result as GalleryPost;
      if (post) {
        post.likes = likes;
        t.objectStore(STORE).put(post);
      }
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}
