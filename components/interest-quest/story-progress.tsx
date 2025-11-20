'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StoryProgressProps {
  total: number;
  current: number;
  categoryColor?: string;
}

export function StoryProgress({ total, current, categoryColor = '#9333ea' }: StoryProgressProps) {
  return (
    <div className="flex gap-1 w-full">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className="relative h-1 flex-1 overflow-hidden rounded-full bg-gray-200/50"
        >
          {/* Background track */}
          <div className="absolute inset-0 bg-white/20" />

          {/* Progress fill */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: categoryColor }}
            initial={{ width: 0 }}
            animate={{
              width: index < current ? '100%' : index === current ? '50%' : '0%',
            }}
            transition={{
              duration: index === current ? 0.3 : 0.2,
              ease: 'easeOut',
            }}
          />

          {/* Shimmer effect for current segment */}
          {index === current && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
