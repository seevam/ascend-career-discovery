/**
 * Identity Discovery Activity - Type Definitions
 *
 * A gamified activity where students unlock 10 identity elements through
 * reflection challenges, then compose them into a visual identity canvas.
 */

// ============================================================================
// Component Categories
// ============================================================================

export type ComponentCategory =
  | 'strengths'
  | 'values'
  | 'interests'
  | 'identity';

export type RewardType =
  | 'sticker'
  | 'badge'
  | 'textBox'
  | 'imageSlot'
  | 'mega-badge';

// ============================================================================
// Unlock Challenge Structure
// ============================================================================

export interface UnlockChallenge {
  id: string;
  componentNumber: number;
  category: ComponentCategory;
  element: string;
  unlockPrompt: string;
  unlockChallenge: string;
  rewardType: RewardType;
  rewardName: string;
  rewardIcon: string;
  sessionAlignment: string;
  phase: number;
  order: number;
}

// ============================================================================
// User Response Structure
// ============================================================================

export interface ChallengeResponse {
  challengeId: string;
  response: string;
  imageUrl?: string; // For visual elements
  completedAt: Date;
  timeSpent: number; // seconds
}

// ============================================================================
// Unlocked Element Structure
// ============================================================================

export interface UnlockedElement {
  challengeId: string;
  category: ComponentCategory;
  element: string;
  response: string;
  imageUrl?: string;
  rewardType: RewardType;
  rewardName: string;
  rewardIcon: string;
  unlockedAt: Date;
  position?: { x: number; y: number }; // Canvas position
  scale?: number; // 0.5 to 2.0
  rotation?: number; // degrees
}

// ============================================================================
// Canvas Element (for final composition)
// ============================================================================

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'badge' | 'sticker';
  content: string | null;
  imageUrl?: string;
  icon?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  scale: number;
  rotation: number;
  zIndex: number;
  category: ComponentCategory;
}

// ============================================================================
// Phase Structure
// ============================================================================

export type PhaseType =
  | 'welcome'
  | 'unlock'
  | 'compose'
  | 'finalize';

export interface PhaseProgress {
  phase: PhaseType;
  completed: boolean;
  startedAt: Date | null;
  completedAt: Date | null;
  challengesCompleted: number;
  totalChallenges: number;
}

// ============================================================================
// Main Activity State
// ============================================================================

export interface IdentityDiscoveryState {
  // Session metadata
  sessionId: string;
  studentName?: string;
  startedAt: Date;
  completedAt: Date | null;
  lastUpdatedAt: Date;

  // Current progress
  currentPhase: PhaseType;
  currentChallengeId: string | null;

  // Phase tracking
  phases: {
    welcome: PhaseProgress;
    unlock: PhaseProgress;
    compose: PhaseProgress;
    finalize: PhaseProgress;
  };

  // Challenge responses
  responses: ChallengeResponse[];

  // Unlocked elements
  unlockedElements: UnlockedElement[];

  // Final canvas composition
  canvasElements: CanvasElement[];
  canvasBackground: {
    type: 'color' | 'gradient' | 'pattern';
    value: string;
  };

  // Gamification
  totalPoints: number;
  badges: string[];
  megaBadgeUnlocked: boolean;

  // Metadata
  version: string;
  completionPercentage: number;
}

// ============================================================================
// Context Value Types
// ============================================================================

export interface IdentityDiscoveryContextValue {
  // State
  state: IdentityDiscoveryState;

  // Phase management
  startPhase: (phase: PhaseType) => void;
  completePhase: (phase: PhaseType) => void;
  goToPhase: (phase: PhaseType) => void;

  // Challenge management
  startChallenge: (challengeId: string) => void;
  submitChallengeResponse: (
    challengeId: string,
    response: string,
    imageUrl?: string
  ) => void;

  // Canvas management
  addCanvasElement: (element: Omit<CanvasElement, 'id' | 'zIndex'>) => void;
  updateCanvasElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeCanvasElement: (id: string) => void;
  setCanvasBackground: (background: IdentityDiscoveryState['canvasBackground']) => void;

  // Utilities
  getUnlockedElement: (challengeId: string) => UnlockedElement | undefined;
  getChallengeResponse: (challengeId: string) => ChallengeResponse | undefined;
  isElementUnlocked: (challengeId: string) => boolean;
  getPhaseProgress: (phase: PhaseType) => PhaseProgress;

  // Actions
  resetActivity: () => void;
  finalizeCanvas: () => void;
  exportCanvas: () => Promise<string>; // Returns image data URL
}

// ============================================================================
// Component Props
// ============================================================================

export interface UnlockChallengeCardProps {
  challenge: UnlockChallenge;
  isUnlocked: boolean;
  isActive: boolean;
  onStart: () => void;
  onComplete: (response: string, imageUrl?: string) => void;
}

export interface BadgeDisplayProps {
  rewardType: RewardType;
  rewardName: string;
  rewardIcon: string;
  unlocked: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface IdentityCanvasProps {
  elements: CanvasElement[];
  background: IdentityDiscoveryState['canvasBackground'];
  isEditable: boolean;
  onElementUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  onElementRemove?: (id: string) => void;
  onBackgroundChange?: (background: IdentityDiscoveryState['canvasBackground']) => void;
}

export interface PhaseNavigationProps {
  currentPhase: PhaseType;
  phases: IdentityDiscoveryState['phases'];
  onPhaseChange: (phase: PhaseType) => void;
}

// ============================================================================
// Challenge Templates
// ============================================================================

export interface ChallengeTemplate {
  type: 'text' | 'textarea' | 'choice' | 'image-select';
  placeholder?: string;
  maxLength?: number;
  choices?: string[];
  imageOptions?: Array<{ url: string; label: string }>;
}

// ============================================================================
// Export/Share
// ============================================================================

export interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf';
  includeResponses: boolean;
  includeTimestamp: boolean;
  quality: number; // 0-1
}

export interface ShareData {
  title: string;
  text: string;
  url: string;
  imageDataUrl: string;
}
