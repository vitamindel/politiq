export const TOPICS = [
  'Economy',
  'Elections',
  'Climate',
  'Healthcare',
  'Foreign Policy',
  'Immigration',
  'Technology',
  'Education',
  'Criminal Justice',
  'Social Issues'
];

export const NEWS_SOURCES = [
  'BBC News',
  'CNN',
  'Fox News',
  'Reuters',
  'Associated Press',
  'The Guardian',
  'Wall Street Journal',
  'New York Times',
  'Washington Post',
  'NPR'
];

export const BIAS_COLORS = {
  liberal: '#3B82F6',
  conservative: '#EF4444',
  centrist: '#10B981'
};

export const TONE_COLORS = {
  neutral: '#6B7280',
  biased: '#F59E0B',
  'emotionally-charged': '#EF4444'
};

export const API_ENDPOINTS = {
  NEWS_API: 'https://newsapi.org/v2',
  GEMINI_API: 'https://generativelanguage.googleapis.com/v1beta'
};

// API keys from environment variables
export const API_KEYS = {
  NEWS_API: import.meta.env.VITE_NEWS_API_KEY || '2766fc37a783411eb6d31a5cb40932be',
  GEMINI_API: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyC81MaFeeD6-H7TVe5AMTRYxV_mjVV86P4'
};