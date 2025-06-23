import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  TrendingUp,
  Users,
  Eye,
  ChevronDown,
  X
} from 'lucide-react';
import Navigation from '../components/Navigation';
import NewsCard from '../components/NewsCard';
import BiasMap from '../components/BiasMap';
import CompareMode from '../components/CompareMode';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { TOPICS } from '../utils/constants';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    articles,
    selectedArticles,
    biasMapPoints,
    comparisonData,
    loading,
    error,
    selectedTopic,
    searchQuery,
    fetchNews,
    analyzeArticle,
    selectArticleForComparison,
    compareArticles,
    clearComparison,
    setSelectedTopic,
    setSearchQuery
  } = useApp();

  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState<'feed' | 'map' | 'compare'>('feed');

  useEffect(() => {
    if (selectedArticles.length === 2) {
      compareArticles();
    }
  }, [selectedArticles, compareArticles]);

  const handleRefresh = () => {
    fetchNews(selectedTopic || undefined);
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    fetchNews(topic || undefined);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNews(searchQuery);
    }
  };

  const handleAnalyze = (article: any) => {
    analyzeArticle(article);
  };

  const handleCompare = (article: any) => {
    selectArticleForComparison(article);
  };

  const stats = [
    { label: 'Articles Analyzed', value: articles.length, icon: Eye },
    { label: 'Sources Tracked', value: new Set(articles.map(a => a.source.name)).size, icon: Users },
    { label: 'Topics Covered', value: TOPICS.length, icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.displayName || 'User'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Stay informed with AI-powered political news analysis
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search political news..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </form>

            {/* Topic Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>{selectedTopic || 'All Topics'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        handleTopicChange('');
                        setShowFilters(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                    >
                      All Topics
                    </button>
                    {TOPICS.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => {
                          handleTopicChange(topic);
                          setShowFilters(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setActiveView('feed')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'feed'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Feed
              </button>
              <button
                onClick={() => setActiveView('map')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'map'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Map
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Comparison Bar */}
        {selectedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-2xl p-4 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                <span className="text-purple-700 dark:text-purple-300 font-medium">
                  {selectedArticles.length === 1
                    ? 'Select another article to compare'
                    : `Comparing ${selectedArticles.length} articles`}
                </span>
              </div>
              <button
                onClick={clearComparison}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl p-4 mb-8">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeView === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {loading && articles.length === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      onAnalyze={handleAnalyze}
                      onCompare={handleCompare}
                      isSelected={selectedArticles.some(a => a.id === article.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BiasMap
                data={biasMapPoints}
                onPointClick={(point) => {
                  const article = articles.find(a => a.id === point.id);
                  if (article) {
                    handleCompare(article);
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Modal */}
        <AnimatePresence>
          {comparisonData && (
            <CompareMode
              comparisonData={comparisonData}
              onClose={clearComparison}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;