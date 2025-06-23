export interface User {
  uid: string;
  email: string;
  displayName?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  darkMode: boolean;
  ideologicalFilters: string[];
  preferredSources: string[];
  enableAI: boolean;
  favoriteTopics: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  source: NewsSource;
  publishedAt: string;
  url: string;
  urlToImage?: string;
  author?: string;
  analysis?: ArticleAnalysis;
}

export interface NewsSource {
  id: string;
  name: string;
  category: string;
  language: string;
  country: string;
}

export interface ArticleAnalysis {
  politicalLeaning: 'liberal' | 'conservative' | 'centrist';
  tone: 'neutral' | 'biased' | 'emotionally-charged';
  summary: string[];
  opposingFraming: string;
  sentiment: number; // -1 to 1
  factualScore: number; // 0 to 1
  biasScore: number; // -1 to 1
}

export interface BiasMapPoint {
  id: string;
  title: string;
  x: number; // ideological position
  y: number; // factual vs sensational
  source: string;
  color: string;
  analysis: ArticleAnalysis;
}

export interface TopicTrend {
  topic: string;
  data: {
    date: string;
    sentiment: number;
    bias: number;
    volume: number;
  }[];
}

export interface ComparisonData {
  article1: NewsArticle;
  article2: NewsArticle;
  framingDifferences: string[];
  keyFactEmphasis: string[];
  languageContrasts: string[];
  verdict: string;
}