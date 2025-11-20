'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Achievement } from '@/types/interest-quest';
import { Card } from '@/components/ui/card';
import { X, Sparkles } from 'lucide-react';

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-600',
};

const rarityGlow = {
  common: 'shadow-gray-500/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/50',
};

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  useEffect(() => {
    if (achievement) {
      // Trigger confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = achievement.rarity === 'legendary'
        ? ['#FFD700', '#FFA500', '#FF6347']
        : achievement.rarity === 'epic'
        ? ['#9333ea', '#c084fc', '#e879f9']
        : achievement.rarity === 'rare'
        ? ['#3b82f6', '#60a5fa', '#93c5fd']
        : ['#6b7280', '#9ca3af', '#d1d5db'];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Achievement Card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 300,
            }}
            className="relative z-10"
          >
            <Card
              className={`relative max-w-md overflow-hidden bg-gradient-to-br ${rarityColors[achievement.rarity]} p-1 shadow-2xl ${rarityGlow[achievement.rarity]}`}
            >
              <div className="rounded-lg bg-white p-6">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Achievement Unlocked!</p>
                    <p className={`text-xs font-semibold uppercase tracking-wide bg-gradient-to-r ${rarityColors[achievement.rarity]} bg-clip-text text-transparent`}>
                      {achievement.rarity}
                    </p>
                  </div>
                </div>

                {/* Achievement Icon */}
                <div className="mb-4 flex justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: 2,
                    }}
                    className="text-7xl"
                  >
                    {achievement.icon}
                  </motion.div>
                </div>

                {/* Achievement Details */}
                <div className="text-center">
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    {achievement.title}
                  </h3>
                  <p className="mb-4 text-gray-600">
                    {achievement.description}
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 text-white shadow-lg">
                    <span className="text-2xl">⭐</span>
                    <span className="text-lg font-bold">+{achievement.points} XP</span>
                  </div>
                </div>

                {/* Progress Bar Animation */}
                <motion.div
                  className="mt-6 h-2 overflow-hidden rounded-full bg-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className={`h-full bg-gradient-to-r ${rarityColors[achievement.rarity]}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
