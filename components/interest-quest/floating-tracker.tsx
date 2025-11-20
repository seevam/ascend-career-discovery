'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InterestCategory } from '@/types/interest-quest';
import categoriesData from '@/data/categories.json';

interface FloatingTrackerProps {
  topInterests: { category: InterestCategory; score: number }[];
}

export function FloatingTracker({ topInterests }: FloatingTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (topInterests.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2"
    >
      <div className="relative">
        {/* Compact View */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white shadow-2xl backdrop-blur-sm transition-all hover:scale-105"
        >
          {/* Top 3 Icons */}
          <div className="flex -space-x-2">
            {topInterests.slice(0, 3).map((interest) => {
              const category = categoriesData.categories.find((c) => c.id === interest.category);
              return (
                <div
                  key={interest.category}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white"
                >
                  <span className="text-lg">{category?.icon || '🎯'}</span>
                </div>
              );
            })}
          </div>

          <span className="text-sm font-semibold">Top Interests</span>

          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </motion.button>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ y: 10, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.95 }}
              className="absolute bottom-full left-1/2 mb-2 w-80 -translate-x-1/2 rounded-2xl bg-white p-4 shadow-2xl"
            >
              <h3 className="mb-3 text-center text-sm font-bold text-gray-900">
                Your Top Interests Right Now
              </h3>
              <div className="space-y-2">
                {topInterests.slice(0, 3).map((interest, index) => {
                  const category = categoriesData.categories.find(
                    (c) => c.id === interest.category
                  );
                  const medals = ['🥇', '🥈', '🥉'];
                  const maxScore = Math.max(...topInterests.map((i) => i.score));
                  const percentage = maxScore > 0 ? (interest.score / maxScore) * 100 : 0;

                  return (
                    <div
                      key={interest.category}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                    >
                      <span className="text-2xl">{medals[index]}</span>
                      <span className="text-2xl">{category?.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {category?.name}
                        </p>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-purple-600">
                        {interest.score}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-center text-xs text-gray-500">
                Keep answering to refine your results!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
