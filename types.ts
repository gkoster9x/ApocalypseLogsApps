export interface JournalEntry {
  id: string;
  timestamp: number;
  dateDisplay: string;
  content: string;
  location: string;
  mood: 'Hopeful' | 'Desperate' | 'Neutral' | 'Scared' | 'Angry';
  tags: string[];
  aiAnalysis?: {
    riskLevel: number; // 0-100
    summary: string;
    survivalTips: string[];
    resourcesDetected: string[];
  };
  imageUrl?: string;
}

export interface UserStats {
  daysSurvived: number;
  entriesCount: number;
  lastLocation: string;
  healthStatus: number; // 0-100
}

export interface CraftedItem {
  id: string;
  name: string;
  description: string;
  utility: string;
  ingredients: string[];
  timestamp: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  ARCHIVE = 'ARCHIVE',
  CHAT = 'CHAT',
  CRAFTING = 'CRAFTING'
}

export const MOOD_COLORS = {
  Hopeful: 'text-emerald-500',
  Desperate: 'text-red-600',
  Neutral: 'text-stone-400',
  Scared: 'text-purple-500',
  Angry: 'text-orange-600'
};