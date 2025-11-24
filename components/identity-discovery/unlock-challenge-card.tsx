'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { UnlockChallengeCardProps } from '@/types/identity-discovery';
import { cn } from '@/lib/utils';

export function UnlockChallengeCard({
  challenge,
  isUnlocked,
  isActive,
  onStart,
  onComplete,
}: UnlockChallengeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => {
    setIsExpanded(true);
    onStart();
  };

  const handleSubmit = async () => {
    if (!response.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate processing
    onComplete(response, selectedImage);
    setIsSubmitting(false);
    setIsExpanded(false);
  };

  const getCategoryColor = () => {
    switch (challenge.category) {
      case 'strengths':
        return 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40';
      case 'values':
        return 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40';
      case 'interests':
        return 'bg-green-500/10 border-green-500/20 hover:border-green-500/40';
      case 'identity':
        return 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40';
      default:
        return 'bg-gray-500/10 border-gray-500/20 hover:border-gray-500/40';
    }
  };

  const getRewardTypeLabel = () => {
    switch (challenge.rewardType) {
      case 'sticker':
        return '🎨 Sticker';
      case 'badge':
        return '🏅 Badge';
      case 'textBox':
        return '📝 Text Box';
      case 'imageSlot':
        return '🖼️ Image Slot';
      default:
        return '🎁 Reward';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          'relative overflow-hidden border-2 transition-all duration-300',
          getCategoryColor(),
          isActive && 'ring-2 ring-primary ring-offset-2',
          isUnlocked && 'opacity-90'
        )}
      >
        {/* Unlock status indicator */}
        <div className="absolute top-4 right-4 z-10">
          {isUnlocked ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </motion.div>
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {/* Challenge icon */}
            <motion.div
              className="text-4xl flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {challenge.rewardIcon}
            </motion.div>

            <div className="flex-1 space-y-2">
              {/* Challenge number and category */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  #{challenge.componentNumber}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {challenge.category}
                </Badge>
              </div>

              {/* Challenge title */}
              <CardTitle className="text-lg leading-tight">
                {challenge.unlockPrompt}
              </CardTitle>

              {/* Reward type */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>{getRewardTypeLabel()}: {challenge.rewardName}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Challenge prompt (always visible) */}
          <div className="text-sm text-muted-foreground">
            <p className="leading-relaxed">{challenge.unlockChallenge}</p>
          </div>

          {/* Expand to respond */}
          <AnimatePresence>
            {!isUnlocked && !isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  onClick={handleStart}
                  className="w-full"
                  variant="default"
                  size="lg"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Start Challenge
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {!isUnlocked && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Response textarea */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Response</label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Share your thoughts here..."
                    className="min-h-[120px] resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {response.length}/500
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    disabled={!response.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                        Unlocking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Unlock Reward
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {isUnlocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg bg-green-500/10 border border-green-500/20 p-4"
              >
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">
                    Challenge Completed! Reward Unlocked.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        {/* Decorative gradient overlay for unlocked cards */}
        {isUnlocked && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
        )}
      </Card>
    </motion.div>
  );
}
