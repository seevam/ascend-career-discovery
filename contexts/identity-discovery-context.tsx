'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAutoSave } from '@/hooks/use-auto-save';
import { STORAGE_KEYS } from '@/lib/storage';
import {
  IdentityDiscoveryState,
  IdentityDiscoveryContextValue,
  PhaseType,
  PhaseProgress,
  CanvasElement,
  UnlockedElement,
  ChallengeResponse,
} from '@/types/identity-discovery';
import challengesData from '@/data/identity-discovery-challenges.json';

const IdentityDiscoveryContext = createContext<
  IdentityDiscoveryContextValue | undefined
>(undefined);

// Generate a unique session ID
function generateSessionId(): string {
  return `identity_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Create initial phase progress
function createPhaseProgress(phase: PhaseType): PhaseProgress {
  const challengeCounts: Record<PhaseType, number> = {
    welcome: 0,
    unlock: 10,
    compose: 0,
    finalize: 0,
  };

  return {
    phase,
    completed: false,
    startedAt: null,
    completedAt: null,
    challengesCompleted: 0,
    totalChallenges: challengeCounts[phase],
  };
}

// Create initial empty state
function createInitialState(): IdentityDiscoveryState {
  return {
    sessionId: generateSessionId(),
    studentName: undefined,
    startedAt: new Date(),
    completedAt: null,
    lastUpdatedAt: new Date(),

    currentPhase: 'welcome',
    currentChallengeId: null,

    phases: {
      welcome: createPhaseProgress('welcome'),
      unlock: createPhaseProgress('unlock'),
      compose: createPhaseProgress('compose'),
      finalize: createPhaseProgress('finalize'),
    },

    responses: [],
    unlockedElements: [],

    canvasElements: [],
    canvasBackground: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },

    totalPoints: 0,
    badges: [],
    megaBadgeUnlocked: false,

    version: '1.0',
    completionPercentage: 0,
  };
}

interface IdentityDiscoveryProviderProps {
  children: ReactNode;
}

export function IdentityDiscoveryProvider({
  children,
}: IdentityDiscoveryProviderProps) {
  const [state, setState] = useLocalStorage<IdentityDiscoveryState>(
    STORAGE_KEYS.IDENTITY_DISCOVERY,
    createInitialState(),
    '1.0'
  );

  const [showReward, setShowReward] = useState<UnlockedElement | null>(null);

  // Auto-save when state changes
  useAutoSave(state, (data) => {
    setState(data);
  });

  // Calculate completion percentage
  const updateCompletionPercentage = useCallback(
    (updatedState: IdentityDiscoveryState) => {
      const totalChallenges = 10;
      const completedChallenges = updatedState.responses.length;
      const canvasFinalized = updatedState.phases.finalize.completed;

      const percentage = Math.floor(
        (completedChallenges / totalChallenges) * 90 +
          (canvasFinalized ? 10 : 0)
      );

      return { ...updatedState, completionPercentage: percentage };
    },
    []
  );

  // Phase management
  const startPhase = useCallback(
    (phase: PhaseType) => {
      setState((prev) => {
        const updated = { ...prev };
        updated.currentPhase = phase;
        updated.phases[phase].startedAt = new Date();
        updated.lastUpdatedAt = new Date();
        return updateCompletionPercentage(updated);
      });
    },
    [setState, updateCompletionPercentage]
  );

  const completePhase = useCallback(
    (phase: PhaseType) => {
      setState((prev) => {
        const updated = { ...prev };
        updated.phases[phase].completed = true;
        updated.phases[phase].completedAt = new Date();
        updated.lastUpdatedAt = new Date();

        // Auto-progress to next phase
        if (phase === 'welcome') {
          updated.currentPhase = 'unlock';
          updated.phases.unlock.startedAt = new Date();
        } else if (phase === 'unlock') {
          updated.currentPhase = 'compose';
          updated.phases.compose.startedAt = new Date();
        } else if (phase === 'compose') {
          updated.currentPhase = 'finalize';
          updated.phases.finalize.startedAt = new Date();
        }

        return updateCompletionPercentage(updated);
      });
    },
    [setState, updateCompletionPercentage]
  );

  const goToPhase = useCallback(
    (phase: PhaseType) => {
      setState((prev) => ({
        ...prev,
        currentPhase: phase,
        lastUpdatedAt: new Date(),
      }));
    },
    [setState]
  );

  // Challenge management
  const startChallenge = useCallback(
    (challengeId: string) => {
      setState((prev) => ({
        ...prev,
        currentChallengeId: challengeId,
        lastUpdatedAt: new Date(),
      }));
    },
    [setState]
  );

  const submitChallengeResponse = useCallback(
    (challengeId: string, response: string, imageUrl?: string) => {
      setState((prev) => {
        // Find the challenge data
        const challenge = challengesData.challenges.find(
          (c) => c.id === challengeId
        );
        if (!challenge) return prev;

        const updated = { ...prev };

        // Create response record
        const challengeResponse: ChallengeResponse = {
          challengeId,
          response,
          imageUrl,
          completedAt: new Date(),
          timeSpent: 0, // Could track this if needed
        };

        // Add or update response
        const existingIndex = updated.responses.findIndex(
          (r) => r.challengeId === challengeId
        );
        if (existingIndex >= 0) {
          updated.responses[existingIndex] = challengeResponse;
        } else {
          updated.responses.push(challengeResponse);
        }

        // Create unlocked element
        const unlockedElement: UnlockedElement = {
          challengeId,
          category: challenge.category as any,
          element: challenge.element,
          response,
          imageUrl,
          rewardType: challenge.rewardType as any,
          rewardName: challenge.rewardName,
          rewardIcon: challenge.rewardIcon,
          unlockedAt: new Date(),
        };

        // Add or update unlocked element
        const existingUnlockedIndex = updated.unlockedElements.findIndex(
          (e) => e.challengeId === challengeId
        );
        if (existingUnlockedIndex >= 0) {
          updated.unlockedElements[existingUnlockedIndex] = unlockedElement;
        } else {
          updated.unlockedElements.push(unlockedElement);
        }

        // Add badge if not already earned
        if (!updated.badges.includes(challenge.rewardName)) {
          updated.badges.push(challenge.rewardName);
        }

        // Award points (50 points per challenge)
        updated.totalPoints += 50;

        // Update unlock phase progress
        updated.phases.unlock.challengesCompleted = updated.responses.length;

        // If all challenges completed, mark unlock phase as complete
        if (updated.responses.length === 10) {
          updated.phases.unlock.completed = true;
          updated.phases.unlock.completedAt = new Date();
        }

        // Clear current challenge
        updated.currentChallengeId = null;
        updated.lastUpdatedAt = new Date();

        // Show reward popup
        setShowReward(unlockedElement);

        return updateCompletionPercentage(updated);
      });
    },
    [setState, updateCompletionPercentage]
  );

  // Canvas management
  const addCanvasElement = useCallback(
    (element: Omit<CanvasElement, 'id' | 'zIndex'>) => {
      setState((prev) => {
        const updated = { ...prev };
        const maxZIndex = Math.max(
          0,
          ...updated.canvasElements.map((e) => e.zIndex)
        );

        const newElement: CanvasElement = {
          ...element,
          id: `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          zIndex: maxZIndex + 1,
        };

        updated.canvasElements.push(newElement);
        updated.lastUpdatedAt = new Date();

        return updated;
      });
    },
    [setState]
  );

  const updateCanvasElement = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      setState((prev) => {
        const updated = { ...prev };
        const index = updated.canvasElements.findIndex((e) => e.id === id);

        if (index >= 0) {
          updated.canvasElements[index] = {
            ...updated.canvasElements[index],
            ...updates,
          };
          updated.lastUpdatedAt = new Date();
        }

        return updated;
      });
    },
    [setState]
  );

  const removeCanvasElement = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        canvasElements: prev.canvasElements.filter((e) => e.id !== id),
        lastUpdatedAt: new Date(),
      }));
    },
    [setState]
  );

  const setCanvasBackground = useCallback(
    (background: IdentityDiscoveryState['canvasBackground']) => {
      setState((prev) => ({
        ...prev,
        canvasBackground: background,
        lastUpdatedAt: new Date(),
      }));
    },
    [setState]
  );

  // Utility functions
  const getUnlockedElement = useCallback(
    (challengeId: string) => {
      return state.unlockedElements.find((e) => e.challengeId === challengeId);
    },
    [state.unlockedElements]
  );

  const getChallengeResponse = useCallback(
    (challengeId: string) => {
      return state.responses.find((r) => r.challengeId === challengeId);
    },
    [state.responses]
  );

  const isElementUnlocked = useCallback(
    (challengeId: string) => {
      return state.unlockedElements.some((e) => e.challengeId === challengeId);
    },
    [state.unlockedElements]
  );

  const getPhaseProgress = useCallback(
    (phase: PhaseType) => {
      return state.phases[phase];
    },
    [state.phases]
  );

  // Actions
  const resetActivity = useCallback(() => {
    setState(createInitialState());
  }, [setState]);

  const finalizeCanvas = useCallback(() => {
    setState((prev) => {
      const updated = { ...prev };

      // Complete compose and finalize phases
      if (!updated.phases.compose.completed) {
        updated.phases.compose.completed = true;
        updated.phases.compose.completedAt = new Date();
      }

      updated.phases.finalize.completed = true;
      updated.phases.finalize.completedAt = new Date();

      // Award mega badge
      updated.megaBadgeUnlocked = true;
      updated.totalPoints += 500;
      updated.badges.push('Identity Architect');

      // Mark activity as completed
      updated.completedAt = new Date();
      updated.lastUpdatedAt = new Date();

      return updateCompletionPercentage(updated);
    });
  }, [setState, updateCompletionPercentage]);

  const exportCanvas = useCallback(async () => {
    // This will be implemented to export canvas as image
    // For now, return a placeholder
    return Promise.resolve('data:image/png;base64,...');
  }, []);

  const contextValue: IdentityDiscoveryContextValue = {
    state,
    startPhase,
    completePhase,
    goToPhase,
    startChallenge,
    submitChallengeResponse,
    addCanvasElement,
    updateCanvasElement,
    removeCanvasElement,
    setCanvasBackground,
    getUnlockedElement,
    getChallengeResponse,
    isElementUnlocked,
    getPhaseProgress,
    resetActivity,
    finalizeCanvas,
    exportCanvas,
  };

  return (
    <IdentityDiscoveryContext.Provider value={contextValue}>
      {children}
      {/* TODO: Add RewardPopup component here when unlocking elements */}
    </IdentityDiscoveryContext.Provider>
  );
}

// Custom hook to use the context
export function useIdentityDiscovery() {
  const context = useContext(IdentityDiscoveryContext);
  if (!context) {
    throw new Error(
      'useIdentityDiscovery must be used within an IdentityDiscoveryProvider'
    );
  }
  return context;
}
