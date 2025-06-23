import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { NewsArticle, BiasMapPoint, TopicTrend, ComparisonData } from '../types';
import { newsApi } from '../services/newsApi';
import { geminiApi } from '../services/geminiApi';
import { useAuth } from './AuthContext';

interface AppState {
  articles: NewsArticle[];
  selectedArticles: NewsArticle[];
  biasMapPoints: BiasMapPoint[];
  topicTrends: TopicTrend[];
  comparisonData: ComparisonData | null;
  loading: boolean;
  error: string | null;
  selectedTopic: string;
  searchQuery: string;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ARTICLES'; payload: NewsArticle[] }
  | { type: 'UPDATE_ARTICLE'; payload: NewsArticle }
  | { type: 'SET_SELECTED_ARTICLES'; payload: NewsArticle[] }
  | { type: 'SET_BIAS_MAP_POINTS'; payload: BiasMapPoint[] }
  | { type: 'SET_TOPIC_TRENDS'; payload: TopicTrend[] }
  | { type: 'SET_COMPARISON_DATA'; payload: ComparisonData | null }
  | { type: 'SET_SELECTED_TOPIC'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

const initialState: AppState = {
  articles: [],
  selectedArticles: [],
  biasMapPoints: [],
  topicTrends: [],
  comparisonData: null,
  loading: false,
  error: null,
  selectedTopic: '',
  searchQuery: ''
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload };
    case 'UPDATE_ARTICLE':
      return {
        ...state,
        articles: state.articles.map(article =>
          article.id === action.payload.id ? action.payload : article
        )
      };
    case 'SET_SELECTED_ARTICLES':
      return { ...state, selectedArticles: action.payload };
    case 'SET_BIAS_MAP_POINTS':
      return { ...state, biasMapPoints: action.payload };
    case 'SET_TOPIC_TRENDS':
      return { ...state, topicTrends: action.payload };
    case 'SET_COMPARISON_DATA':
      return { ...state, comparisonData: action.payload };
    case 'SET_SELECTED_TOPIC':
      return { ...state, selectedTopic: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

interface AppContextType extends AppState {
  fetchNews: (topic?: string) => Promise<void>;
  analyzeArticle: (article: NewsArticle) => Promise<void>;
  selectArticleForComparison: (article: NewsArticle) => void;
  compareArticles: () => Promise<void>;
  clearComparison: () => void;
  setSelectedTopic: (topic: string) => void;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  const fetchNews = async (topic?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const articles = await newsApi.getTopHeadlines(topic);
      dispatch({ type: 'SET_ARTICLES', payload: articles });
      
      // Generate bias map points
      const biasPoints: BiasMapPoint[] = articles.map(article => ({
        id: article.id,
        title: article.title,
        x: Math.random() * 2 - 1, // -1 to 1 (liberal to conservative)
        y: Math.random(), // 0 to 1 (factual to sensational)
        source: article.source.name,
        color: getSourceColor(article.source.name),
        analysis: {
          politicalLeaning: ['liberal', 'conservative', 'centrist'][Math.floor(Math.random() * 3)] as any,
          tone: ['neutral', 'biased', 'emotionally-charged'][Math.floor(Math.random() * 3)] as any,
          summary: ['Key points discussed', 'Multiple perspectives presented', 'Policy implications analyzed'],
          opposingFraming: 'Alternative viewpoint could emphasize different aspects.',
          sentiment: Math.random() * 2 - 1,
          factualScore: Math.random() * 0.4 + 0.6,
          biasScore: Math.random() * 2 - 1
        }
      }));
      
      dispatch({ type: 'SET_BIAS_MAP_POINTS', payload: biasPoints });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch news articles' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const analyzeArticle = async (article: NewsArticle) => {
    if (!user?.preferences.enableAI) return;

    try {
      const analysis = await geminiApi.analyzeArticle(article);
      const updatedArticle = { ...article, analysis };
      dispatch({ type: 'UPDATE_ARTICLE', payload: updatedArticle });
    } catch (error) {
      console.error('Failed to analyze article:', error);
    }
  };

  const selectArticleForComparison = (article: NewsArticle) => {
    const { selectedArticles } = state;
    
    if (selectedArticles.length === 0) {
      dispatch({ type: 'SET_SELECTED_ARTICLES', payload: [article] });
    } else if (selectedArticles.length === 1) {
      if (selectedArticles[0].id !== article.id) {
        dispatch({ type: 'SET_SELECTED_ARTICLES', payload: [selectedArticles[0], article] });
      }
    } else {
      dispatch({ type: 'SET_SELECTED_ARTICLES', payload: [article] });
    }
  };

  const compareArticles = async () => {
    if (state.selectedArticles.length !== 2) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const comparison = await geminiApi.compareArticles(
        state.selectedArticles[0],
        state.selectedArticles[1]
      );
      dispatch({ type: 'SET_COMPARISON_DATA', payload: comparison });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to compare articles' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearComparison = () => {
    dispatch({ type: 'SET_SELECTED_ARTICLES', payload: [] });
    dispatch({ type: 'SET_COMPARISON_DATA', payload: null });
  };

  const setSelectedTopic = (topic: string) => {
    dispatch({ type: 'SET_SELECTED_TOPIC', payload: topic });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  // Initial news fetch
  useEffect(() => {
    if (user) {
      fetchNews();
    }
  }, [user]);

  const value: AppContextType = {
    ...state,
    fetchNews,
    analyzeArticle,
    selectArticleForComparison,
    compareArticles,
    clearComparison,
    setSelectedTopic,
    setSearchQuery
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

function getSourceColor(sourceName: string): string {
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
  let hash = 0;
  for (let i = 0; i < sourceName.length; i++) {
    hash = sourceName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}