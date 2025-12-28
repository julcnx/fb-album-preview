// src/utils/imageDB.ts
// Simple IndexedDB wrapper for storing and retrieving images

const DB_NAME = "fab_album_db";
const STORE_NAME = "photos";
const DB_VERSION = 1;

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveImages(images: Blob[]): Promise<number[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const ids: number[] = [];
    images.forEach((img) => {
      const req = store.add({ blob: img });
      req.onsuccess = () => ids.push(req.result as number);
      req.onerror = reject;
    });
    tx.oncomplete = () => resolve(ids);
    tx.onerror = reject;
  });
}

export async function getAllImages(): Promise<{ id: number; blob: Blob }[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as { id: number; blob: Blob }[]);
    req.onerror = reject;
  });
}

export async function clearImages(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = reject;
  });
}
