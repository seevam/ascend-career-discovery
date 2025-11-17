'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAutoSave } from '@/hooks/use-auto-save';
import { STORAGE_KEYS, saveToStorage } from '@/lib/storage';
import {
  CanvasData,
  CanvasElement,
  BackgroundSettings,
  CanvasZone,
  CanvasMetadata
} from '@/types/canvas-builder';

interface CanvasBuilderContextType {
  canvasData: CanvasData;
  addElement: (element: Omit<CanvasElement, 'id'>) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  setBackground: (background: BackgroundSettings) => void;
  setPersonalQuote: (quote: string) => void;
  setStudentName: (name: string) => void;
  clearCanvas: () => void;
  lastSaved: Date | null;
  incrementExportCount: () => void;
  markZoneCompleted: (zone: CanvasZone) => void;
}

const CanvasBuilderContext = createContext<CanvasBuilderContextType | undefined>(undefined);

const getInitialCanvasData = (): CanvasData => ({
  sessionId: uuidv4(),
  studentName: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
  elements: [],
  background: {
    type: 'solid',
    colors: ['#ffffff'],
  },
  personalQuote: '',
  metadata: {
    version: '1.0',
    completionTime: 0,
    zonesCompleted: [],
    exportCount: 0,
  },
});

export function CanvasBuilderProvider({ children }: { children: React.ReactNode }) {
  const [canvasData, setCanvasData] = useLocalStorage<CanvasData>(
    STORAGE_KEYS.CANVAS_BUILDER,
    getInitialCanvasData(),
    '1.0'
  );

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [startTime] = useState<number>(Date.now());

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setCanvasData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          completionTime: Math.floor((Date.now() - startTime) / 1000),
        },
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [startTime, setCanvasData]);

  // Auto-save functionality
  const saveData = useCallback((data: CanvasData) => {
    saveToStorage(STORAGE_KEYS.CANVAS_BUILDER, data, '1.0');
    setLastSaved(new Date());
  }, []);

  useAutoSave(canvasData, saveData, 3000);

  const addElement = useCallback((element: Omit<CanvasElement, 'id'>) => {
    console.log('🔧 Context: addElement called with:', element);
    const newElement: CanvasElement = {
      ...element,
      id: uuidv4(),
    };
    console.log('🔧 Context: Created element with ID:', newElement.id);

    setCanvasData((prev) => {
      console.log('🔧 Context: Previous elements count:', prev.elements.length);
      const updatedData = {
        ...prev,
        elements: [...prev.elements, newElement],
        updatedAt: new Date(),
      };
      console.log('🔧 Context: New elements count:', updatedData.elements.length);
      console.log('🔧 Context: All elements:', updatedData.elements);
      return updatedData;
    });
  }, [setCanvasData]);

  const removeElement = useCallback((id: string) => {
    setCanvasData((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
      updatedAt: new Date(),
    }));
  }, [setCanvasData]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setCanvasData((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
      updatedAt: new Date(),
    }));
  }, [setCanvasData]);

  const setBackground = useCallback((background: BackgroundSettings) => {
    setCanvasData((prev) => ({
      ...prev,
      background,
      updatedAt: new Date(),
    }));
  }, [setCanvasData]);

  const setPersonalQuote = useCallback((quote: string) => {
    setCanvasData((prev) => ({
      ...prev,
      personalQuote: quote,
      updatedAt: new Date(),
    }));
  }, [setCanvasData]);

  const setStudentName = useCallback((name: string) => {
    setCanvasData((prev) => ({
      ...prev,
      studentName: name,
      updatedAt: new Date(),
    }));
  }, [setCanvasData]);

  const clearCanvas = useCallback(() => {
    setCanvasData(getInitialCanvasData());
  }, [setCanvasData]);

  const incrementExportCount = useCallback(() => {
    setCanvasData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        exportCount: prev.metadata.exportCount + 1,
      },
    }));
  }, [setCanvasData]);

  const markZoneCompleted = useCallback((zone: CanvasZone) => {
    setCanvasData((prev) => {
      const zonesCompleted = prev.metadata.zonesCompleted.includes(zone)
        ? prev.metadata.zonesCompleted
        : [...prev.metadata.zonesCompleted, zone];

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          zonesCompleted,
        },
      };
    });
  }, [setCanvasData]);

  const value: CanvasBuilderContextType = {
    canvasData,
    addElement,
    removeElement,
    updateElement,
    setBackground,
    setPersonalQuote,
    setStudentName,
    clearCanvas,
    lastSaved,
    incrementExportCount,
    markZoneCompleted,
  };

  return (
    <CanvasBuilderContext.Provider value={value}>
      {children}
    </CanvasBuilderContext.Provider>
  );
}

export function useCanvasBuilder() {
  const context = useContext(CanvasBuilderContext);
  if (context === undefined) {
    throw new Error('useCanvasBuilder must be used within a CanvasBuilderProvider');
  }
  return context;
}
