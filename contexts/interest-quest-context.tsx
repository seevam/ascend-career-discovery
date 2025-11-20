'use client';

import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAutoSave } from '@/hooks/use-auto-save';
import { STORAGE_KEYS } from '@/lib/storage';
import {
  InterestProfile,
  CategoryProgress,
  InterestCategory,
  ScenarioResponse,
  Achievement,
  AchievementType,
} from '@/types/interest-quest';
import achievementsData from '@/data/achievements.json';

interface InterestQuestContextValue {
  profile: InterestProfile;
  recordResponse: (scenarioId: string, choiceId: string, category: InterestCategory) => void;
  calculateScores: () => void;
  resetProgress: () => void;
  getCompletedCategories: () => number;
  isCategoryCompleted: (category: InterestCategory) => boolean;
  currentAchievement: Achievement | null;
  clearAchievement: () => void;
  startCategory: (category: InterestCategory) => void;
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

  // Initialize all achievements as locked
  const achievements: Achievement[] = achievementsData.achievements.map((ach) => ({
    ...ach,
    unlockedAt: null,
  })) as Achievement[];

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
    achievements,
    points: {
      total: 0,
      level: 1,
      nextLevelAt: 100,
    },
    categoryStartTimes: {},
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

  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  // Auto-save when profile changes
  useAutoSave(profile, (data) => {
    setProfile(data);
  });

  // Unlock an achievement
  const unlockAchievement = useCallback((achievementId: AchievementType) => {
    setProfile((prev) => {
      const achievement = prev.achievements.find((a) => a.id === achievementId);

      // If already unlocked or doesn't exist, don't unlock again
      if (!achievement || achievement.unlockedAt) {
        return prev;
      }

      const updated = { ...prev };
      const achIndex = updated.achievements.findIndex((a) => a.id === achievementId);

      // Unlock the achievement
      updated.achievements[achIndex] = {
        ...updated.achievements[achIndex],
        unlockedAt: new Date(),
      };

      // Award points
      updated.points = {
        ...updated.points,
        total: updated.points.total + achievement.points,
      };

      // Calculate level (100 XP per level)
      const newLevel = Math.floor(updated.points.total / 100) + 1;
      updated.points.level = newLevel;
      updated.points.nextLevelAt = newLevel * 100;

      // Show the achievement popup
      setCurrentAchievement(updated.achievements[achIndex]);

      return updated;
    });
  }, [setProfile]);

  // Check for achievements
  const checkAchievements = useCallback((category?: InterestCategory) => {
    setProfile((prev) => {
      const completedCount = prev.categoryProgress.filter((cp) => cp.completed).length;

      // First category
      if (completedCount === 1) {
        unlockAchievement('first_category');
      }

      // Three categories
      if (completedCount === 3) {
        unlockAchievement('three_categories');
        unlockAchievement('consistent');
      }

      // All categories
      if (completedCount === 7) {
        unlockAchievement('all_categories');
      }

      // Check speed demon (category completed in under 2 minutes)
      if (category && prev.categoryStartTimes[category]) {
        const startTime = new Date(prev.categoryStartTimes[category]);
        const endTime = new Date();
        const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

        if (durationMinutes < 2) {
          unlockAchievement('speed_demon');
        } else if (durationMinutes > 5) {
          unlockAchievement('thoughtful');
        }
      }

      return prev;
    });
  }, [setProfile, unlockAchievement]);

  const startCategory = useCallback((category: InterestCategory) => {
    setProfile((prev) => ({
      ...prev,
      categoryStartTimes: {
        ...prev.categoryStartTimes,
        [category]: new Date(),
      },
    }));
  }, [setProfile]);

  const clearAchievement = useCallback(() => {
    setCurrentAchievement(null);
  }, []);

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

        // Check if category was just completed
        const wasCompleted = updated.categoryProgress[categoryIndex].completed;
        const isNowCompleted = newResponses.length >= 5;

        // Update the category progress
        updated.categoryProgress[categoryIndex] = {
          ...updated.categoryProgress[categoryIndex],
          responses: newResponses,
          completed: isNowCompleted,
        };

        // Check for achievements if category just completed
        if (!wasCompleted && isNowCompleted) {
          // Use setTimeout to avoid state updates during render
          setTimeout(() => checkAchievements(category), 100);
        }

        return updated;
      });
    },
    [setProfile, checkAchievements]
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
    currentAchievement,
    clearAchievement,
    startCategory,
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
