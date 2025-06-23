import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Clock, 
  ExternalLink, 
  Zap, 
  CheckCircle,
  Brain,
  TrendingUp,
  Shuffle
} from 'lucide-react';
import { NewsArticle } from '../types';
import { useApp } from '../contexts/AppContext';
import { BIAS_COLORS, TONE_COLORS } from '../utils/constants';

interface NewsCardProps {
  article: NewsArticle;
  onAnalyze: (article: NewsArticle) => void;
  onCompare: (article: NewsArticle) => void;
  isSelected?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  article, 
  onAnalyze, 
  onCompare, 
  isSelected = false 
}) => {
  const { selectedArticles } = useApp();
  const isSelectedForComparison = selectedArticles.some(a => a.id === article.id);

  const handleAnalyze = () => {
    onAnalyze(article);
  };

  const handleCompare = () => {
    onCompare(article);
  };

  const getBiasColor = (leaning: string) => {
    return BIAS_COLORS[leaning as keyof typeof BIAS_COLORS] || '#6B7280';
  };

  const getToneColor = (tone: string) => {
    return TONE_COLORS[tone as keyof typeof TONE_COLORS] || '#6B7280';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
        isSelectedForComparison ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Article Image */}
      {article.urlToImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Source and Timestamp */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {article.source.name}
            </span>
            {article.analysis && (
              <div className="flex items-center space-x-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getBiasColor(article.analysis.politicalLeaning) }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {article.analysis.politicalLeaning}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {format(new Date(article.publishedAt), 'MMM d, h:mm a')}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {article.description}
        </p>

        {/* Analysis Results */}
        {article.analysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                <Brain className="w-4 h-4 mr-2 text-blue-600" />
                AI Analysis
              </h4>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Political Leaning</span>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getBiasColor(article.analysis.politicalLeaning) }}
                  />
                  <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                    {article.analysis.politicalLeaning}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Tone</span>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getToneColor(article.analysis.tone) }}
                  />
                  <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                    {article.analysis.tone.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Key Points</span>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {article.analysis.summary.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Alternative Framing</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                "{article.analysis.opposingFraming}"
              </p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalyze}
              disabled={!!article.analysis}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                article.analysis
                  ? 'bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {article.analysis ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Analyzed</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Analyze</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompare}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isSelectedForComparison
                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Shuffle className="w-4 h-4" />
              <span>Compare</span>
            </motion.button>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">Read Full</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;