'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAutoSave } from '@/hooks/use-auto-save';
import { STORAGE_KEYS } from '@/lib/storage';
import {
  InterestProfile,
  CategoryProgress,
  InterestCategory,
  ScenarioResponse,
} from '@/types/interest-quest';

interface InterestQuestContextValue {
  profile: InterestProfile;
  recordResponse: (scenarioId: string, choiceId: string, category: InterestCategory) => void;
  calculateScores: () => void;
  resetProgress: () => void;
  getCompletedCategories: () => number;
  isCategoryCompleted: (category: InterestCategory) => boolean;
}

const InterestQuestContext = createContext<InterestQuestContextValue | undefined>(undefined);

// Generate a unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Create initial empty profile
function createEmptyProfile(): InterestProfile {
  const categories: InterestCategory[] = [
    'arts_creativity',
    'stem_technology',
    'social_impact',
    'business_entrepreneurship',
    'nature_environment',
    'health_wellness',
    'communication_media',
  ];

  return {
    sessionId: generateSessionId(),
    startedAt: new Date(),
    completedAt: null,
    categoryProgress: categories.map((category) => ({
      category,
      completed: false,
      responses: [],
      score: 0,
    })),
    finalResults: null,
  };
}

interface InterestQuestProviderProps {
  children: ReactNode;
}

export function InterestQuestProvider({ children }: InterestQuestProviderProps) {
  const [profile, setProfile] = useLocalStorage<InterestProfile>(
    STORAGE_KEYS.INTEREST_QUEST,
    createEmptyProfile(),
    '1.0'
  );

  // Auto-save when profile changes
  useAutoSave(profile, (data) => {
    setProfile(data);
  });

  const recordResponse = useCallback(
    (scenarioId: string, choiceId: string, category: InterestCategory) => {
      setProfile((prev) => {
        const updated = { ...prev };
        const categoryIndex = updated.categoryProgress.findIndex(
          (cp) => cp.category === category
        );

        if (categoryIndex === -1) return prev;

        const response: ScenarioResponse = {
          scenarioId,
          choiceId,
          timestamp: new Date(),
        };

        // Create a new responses array with the new response
        const newResponses = [...updated.categoryProgress[categoryIndex].responses, response];

        // Update the category progress
        updated.categoryProgress[categoryIndex] = {
          ...updated.categoryProgress[categoryIndex],
          responses: newResponses,
          completed: newResponses.length >= 5, // Mark as completed after 5 responses
        };

        return updated;
      });
    },
    [setProfile]
  );

  const calculateScores = useCallback(() => {
    setProfile((prev) => {
      // This is a placeholder - the actual scoring logic would be more complex
      // and would involve loading scenarios data and calculating weighted scores
      const updated = { ...prev };

      updated.categoryProgress = updated.categoryProgress.map((cp) => ({
        ...cp,
        score: cp.responses.length * 20, // Simple placeholder calculation
      }));

      return updated;
    });
  }, [setProfile]);

  const resetProgress = useCallback(() => {
    setProfile(createEmptyProfile());
  }, [setProfile]);

  const getCompletedCategories = useCallback(() => {
    return profile.categoryProgress.filter((cp) => cp.completed).length;
  }, [profile]);

  const isCategoryCompleted = useCallback(
    (category: InterestCategory) => {
      const categoryProgress = profile.categoryProgress.find((cp) => cp.category === category);
      return categoryProgress?.completed ?? false;
    },
    [profile]
  );

  const value: InterestQuestContextValue = {
    profile,
    recordResponse,
    calculateScores,
    resetProgress,
    getCompletedCategories,
    isCategoryCompleted,
  };

  return (
    <InterestQuestContext.Provider value={value}>
      {children}
    </InterestQuestContext.Provider>
  );
}

export function useInterestQuest(): InterestQuestContextValue {
  const context = useContext(InterestQuestContext);
  if (context === undefined) {
    throw new Error('useInterestQuest must be used within an InterestQuestProvider');
  }
  return context;
}
