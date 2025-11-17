// hooks/use-local-storage.ts

import { useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  version: string = '1.0'
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    const item = loadFromStorage<T>(key);
    return item !== null ? item : initialValue;
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // Use functional update to ensure we always get the latest state
      setStoredValue((prevState) => {
        const valueToStore = value instanceof Function ? value(prevState) : value;

        if (typeof window !== 'undefined') {
          saveToStorage(key, valueToStore, version);
        }

        return valueToStore;
      });
    } catch (error) {
      console.error('Error setting localStorage value:', error);
    }
  };

  return [storedValue, setValue];
}
