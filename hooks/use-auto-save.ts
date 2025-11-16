// hooks/use-auto-save.ts

import { useEffect, useRef } from 'react';

export function useAutoSave<T>(
  data: T,
  saveFunction: (data: T) => void,
  delay: number = 5000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<string>('');

  useEffect(() => {
    const currentData = JSON.stringify(data);

    // Only save if data has changed
    if (currentData !== lastSaveRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        saveFunction(data);
        lastSaveRef.current = currentData;
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFunction, delay]);
}
