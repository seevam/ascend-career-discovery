'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BadgeDisplayProps } from '@/types/identity-discovery';
import { Lock, Sparkles } from 'lucide-react';

export function BadgeDisplay({
  rewardType,
  rewardName,
  rewardIcon,
  unlocked,
  size = 'md',
  showLabel = true,
}: BadgeDisplayProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const getRewardTypeColor = () => {
    switch (rewardType) {
      case 'sticker':
        return 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500/30';
      case 'badge':
        return 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-500/30';
      case 'textBox':
        return 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'imageSlot':
        return 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/30';
      case 'mega-badge':
        return 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-500/50';
      default:
        return 'bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  const getRewardTypeIcon = () => {
    switch (rewardType) {
      case 'sticker':
        return '🎨';
      case 'badge':
        return '🏅';
      case 'textBox':
        return '📝';
      case 'imageSlot':
        return '🖼️';
      case 'mega-badge':
        return '🏆';
      default:
        return '🎁';
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {/* Badge container */}
      <motion.div
        className={cn(
          'relative rounded-2xl border-2 flex items-center justify-center transition-all duration-300',
          sizeClasses[size],
          unlocked
            ? getRewardTypeColor()
            : 'bg-gray-200/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-700/50'
        )}
        whileHover={unlocked ? { scale: 1.05, rotate: 2 } : undefined}
        whileTap={unlocked ? { scale: 0.95 } : undefined}
      >
        {/* Locked state */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10 rounded-2xl">
            <Lock className="w-1/3 h-1/3 text-muted-foreground/50" />
          </div>
        )}

        {/* Reward icon */}
        <motion.div
          className={cn(
            'relative z-10',
            !unlocked && 'opacity-30 blur-sm'
          )}
          animate={
            unlocked
              ? {
                  rotate: [0, -5, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: unlocked ? Infinity : 0,
            repeatDelay: 3,
          }}
        >
          {rewardIcon}
        </motion.div>

        {/* Sparkle effect for unlocked */}
        {unlocked && (
          <motion.div
            className="absolute -top-1 -right-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Reward type indicator */}
        {unlocked && (
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background border border-border rounded-full px-2 py-0.5 text-xs shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {getRewardTypeIcon()}
          </motion.div>
        )}
      </motion.div>

      {/* Label */}
      {showLabel && (
        <motion.div
          className="text-center space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p
            className={cn(
              'font-semibold leading-tight',
              labelSizeClasses[size],
              !unlocked && 'text-muted-foreground'
            )}
          >
            {rewardName}
          </p>
          {!unlocked && (
            <p className="text-xs text-muted-foreground">
              Complete challenge to unlock
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Grid layout component for displaying multiple badges
export function BadgeGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

// Reward popup component (shown when unlocking)
export function RewardPopup({
  rewardType,
  rewardName,
  rewardIcon,
  onClose,
}: {
  rewardType: BadgeDisplayProps['rewardType'];
  rewardName: string;
  rewardIcon: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-background rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-border"
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 100 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti effect */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full"
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.05,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              delay: 0.2,
            }}
          >
            <BadgeDisplay
              rewardType={rewardType}
              rewardName={rewardName}
              rewardIcon={rewardIcon}
              unlocked={true}
              size="lg"
              showLabel={false}
            />
          </motion.div>

          <div className="space-y-2">
            <motion.h2
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              🎉 Reward Unlocked!
            </motion.h2>
            <motion.p
              className="text-lg font-semibold text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {rewardName}
            </motion.p>
          </div>

          <motion.button
            onClick={onClose}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
