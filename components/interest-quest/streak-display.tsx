'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, TrendingUp } from 'lucide-react';
import { UserPoints } from '@/types/interest-quest';

interface StreakDisplayProps {
  points: UserPoints;
}

export function StreakDisplay({ points }: StreakDisplayProps) {
  const progressToNextLevel = ((points.total % 100) / 100) * 100;

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      {/* Current Streak */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-4 text-white shadow-lg"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <Flame className={`h-6 w-6 ${points.currentStreak > 0 ? 'animate-pulse' : ''}`} />
        </div>
        <div>
          <p className="text-xs font-medium opacity-90">Current Streak</p>
          <p className="text-2xl font-bold">{points.currentStreak} days</p>
        </div>
      </motion.div>

      {/* Level & XP */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 text-white shadow-lg"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <Star className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium opacity-90">Level {points.level}</p>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1 text-xs opacity-75">
            {points.total % 100}/{100} XP
          </p>
        </div>
      </motion.div>

      {/* Total XP */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-4 text-white shadow-lg"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-medium opacity-90">Total XP</p>
          <p className="text-2xl font-bold">{points.total}</p>
          {points.longestStreak > 0 && (
            <p className="text-xs opacity-75">Best: {points.longestStreak} days</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
