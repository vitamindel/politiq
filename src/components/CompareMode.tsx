import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  X, 
  Clock, 
  ExternalLink, 
  Lightbulb,
  ArrowRight,
  Scale,
  MessageSquare,
  Eye
} from 'lucide-react';
import { ComparisonData } from '../types';
import { BIAS_COLORS, TONE_COLORS } from '../utils/constants';

interface CompareModeProps {
  comparisonData: ComparisonData;
  onClose: () => void;
}

const CompareMode: React.FC<CompareModeProps> = ({ comparisonData, onClose }) => {
  const getBiasColor = (leaning: string) => {
    return BIAS_COLORS[leaning as keyof typeof BIAS_COLORS] || '#6B7280';
  };

  const getToneColor = (tone: string) => {
    return TONE_COLORS[tone as keyof typeof TONE_COLORS] || '#6B7280';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Scale className="w-6 h-6 mr-2 text-blue-600" />
            Article Comparison
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Articles Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Article 1 */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {comparisonData.article1.source.name}
                </span>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(new Date(comparisonData.article1.publishedAt), 'MMM d, h:mm a')}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {comparisonData.article1.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {comparisonData.article1.description}
              </p>

              {comparisonData.article1.analysis && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Political Leaning</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getBiasColor(comparisonData.article1.analysis.politicalLeaning) }}
                      />
                      <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                        {comparisonData.article1.analysis.politicalLeaning}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Tone</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getToneColor(comparisonData.article1.analysis.tone) }}
                      />
                      <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                        {comparisonData.article1.analysis.tone.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <a
                href={comparisonData.article1.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mt-4"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">Read Full Article</span>
              </a>
            </motion.div>

            {/* Article 2 */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {comparisonData.article2.source.name}
                </span>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(new Date(comparisonData.article2.publishedAt), 'MMM d, h:mm a')}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {comparisonData.article2.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {comparisonData.article2.description}
              </p>

              {comparisonData.article2.analysis && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Political Leaning</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getBiasColor(comparisonData.article2.analysis.politicalLeaning) }}
                      />
                      <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                        {comparisonData.article2.analysis.politicalLeaning}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Tone</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getToneColor(comparisonData.article2.analysis.tone) }}
                      />
                      <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                        {comparisonData.article2.analysis.tone.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <a
                href={comparisonData.article2.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mt-4"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">Read Full Article</span>
              </a>
            </motion.div>
          </div>

          {/* AI Verdict */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  AI Framing Verdict
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  How these articles frame the same story differently
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {comparisonData.verdict}
            </p>
          </motion.div>

          {/* Comparison Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Framing Differences */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <Eye className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Framing Differences
                </h4>
              </div>
              <ul className="space-y-2">
                {comparisonData.framingDifferences.map((difference, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {difference}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Key Fact Emphasis */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <Scale className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Key Fact Emphasis
                </h4>
              </div>
              <ul className="space-y-2">
                {comparisonData.keyFactEmphasis.map((emphasis, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {emphasis}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Language Contrasts */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <MessageSquare className="w-5 h-5 text-orange-600 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Language Contrasts
                </h4>
              </div>
              <ul className="space-y-2">
                {comparisonData.languageContrasts.map((contrast, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {contrast}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CompareMode;