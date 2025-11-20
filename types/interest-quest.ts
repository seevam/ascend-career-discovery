// types/interest-quest.ts

export type InterestCategory =
  | 'arts_creativity'
  | 'stem_technology'
  | 'social_impact'
  | 'business_entrepreneurship'
  | 'nature_environment'
  | 'health_wellness'
  | 'communication_media';

export interface Scenario {
  id: string;
  category: InterestCategory;
  question: string;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  mapping: CategoryMapping[];
}

export interface CategoryMapping {
  category: InterestCategory;
  weight: number; // 1-3
}

export interface ScenarioResponse {
  scenarioId: string;
  choiceId: string;
  timestamp: Date;
}

export interface CategoryProgress {
  category: InterestCategory;
  completed: boolean;
  responses: ScenarioResponse[];
  score: number; // 0-100
}

export interface InterestProfile {
  sessionId: string;
  startedAt: Date;
  completedAt: Date | null;
  categoryProgress: CategoryProgress[];
  finalResults: FinalResults | null;
  achievements: Achievement[];
  points: UserPoints;
  categoryStartTimes: Record<string, Date>;
}

export interface FinalResults {
  topThree: RankedInterest[];
  allScores: Record<InterestCategory, number>;
  surpriseDiscovery: InterestCategory | null;
  chartData: RadarChartPoint[];
}

export interface RankedInterest {
  rank: 1 | 2 | 3;
  category: InterestCategory;
  score: number;
  percentage: number;
  description: string;
  sampleCareers: string[];
  skillsToDevelop: string[];
}

export interface RadarChartPoint {
  category: string;
  value: number;
}

export interface CategoryMetadata {
  id: InterestCategory;
  name: string;
  icon: string;
  description: string;
  keywords: string[];
  resultDescription: string;
  sampleCareers: string[];
  skillsToDevelop: string[];
  scenarios: Scenario[];
}

export interface StoredInterestQuestData {
  data: InterestProfile;
  version: string;
  expiry: number;
}

// Achievement System Types
export type AchievementType =
  | 'first_category'
  | 'three_categories'
  | 'all_categories'
  | 'speed_demon'
  | 'thoughtful'
  | 'explorer'
  | 'balanced'
  | 'specialist'
  | 'consistent';

export interface Achievement {
  id: AchievementType;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt: Date | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserPoints {
  total: number;
  level: number;
  nextLevelAt: number;
}
