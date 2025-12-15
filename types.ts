export interface HotKeyword {
  word: string;
  volume: number; // 0-100 scale representing popularity
  category: string;
  [key: string]: any;
}

export interface ConsumerAttribute {
  attribute: string;
  value: number; // 0-100
  description: string;
  [key: string]: any;
}

export interface PurchasePreference {
  name: string;
  percentage: number;
  [key: string]: any;
}

export interface FuturePersona {
  name: string;
  tagline: string;
  description: string;
  keyItems: string[];
  colorPalette: string[];
}

export interface TrendAnalysisData {
  hotKeywords: HotKeyword[];
  consumerHabits: ConsumerAttribute[]; // For Radar Chart
  preferences: PurchasePreference[]; // For Pie Chart
  futurePersonas: FuturePersona[];
  executiveSummary: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}