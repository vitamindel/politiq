import React from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BiasMapPoint } from '../types';
import { BIAS_COLORS } from '../utils/constants';

interface BiasMapProps {
  data: BiasMapPoint[];
  onPointClick: (point: BiasMapPoint) => void;
}

const BiasMap: React.FC<BiasMapProps> = ({ data, onPointClick }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as BiasMapPoint;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {point.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Source: {point.source}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Political Leaning:</span>
              <div className="flex items-center space-x-1 mt-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: BIAS_COLORS[point.analysis.politicalLeaning] }}
                />
                <span className="capitalize text-gray-900 dark:text-white">
                  {point.analysis.politicalLeaning}
                </span>
              </div>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Tone:</span>
              <p className="capitalize text-gray-900 dark:text-white mt-1">
                {point.analysis.tone.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={payload.color}
        stroke="#fff"
        strokeWidth={2}
        className="cursor-pointer hover:r-8 transition-all"
        onClick={() => onPointClick(payload)}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Bias Visualization Map
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Explore how articles are positioned on the ideological spectrum
        </p>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[-1, 1]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value === -1) return 'Liberal';
                if (value === 0) return 'Centrist';
                if (value === 1) return 'Conservative';
                return '';
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 1]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value === 0) return 'Factual';
                if (value === 1) return 'Sensational';
                return '';
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              data={data}
              fill="#8884d8"
              shape={<CustomDot />}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Liberal</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-600" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Centrist</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-600" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Conservative</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BiasMap;