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
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        saveToStorage(key, valueToStore, version);
      }
    } catch (error) {
      console.error('Error setting localStorage value:', error);
    }
  };

  return [storedValue, setValue];
}
