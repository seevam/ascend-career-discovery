// lib/storage.ts

const EXPIRY_DAYS = 30;

interface StorageItem<T> {
  data: T;
  version: string;
  expiry: number;
}

export function saveToStorage<T>(
  key: string,
  data: T,
  version: string = '1.0'
): void {
  const item: StorageItem<T> = {
    data,
    version,
    expiry: Date.now() + (EXPIRY_DAYS * 24 * 60 * 60 * 1000)
  };

  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed: StorageItem<T> = JSON.parse(item);

    // Check expiry
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

export function clearStorage(key: string): void {
  localStorage.removeItem(key);
}

// Storage keys
export const STORAGE_KEYS = {
  INTEREST_QUEST: 'ascend_interest_quest_v1',
  CANVAS_BUILDER: 'ascend_canvas_builder_v1',
} as const;
