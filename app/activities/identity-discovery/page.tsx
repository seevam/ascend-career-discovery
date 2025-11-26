'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  IdentityDiscoveryProvider,
  useIdentityDiscovery,
} from '@/contexts/identity-discovery-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import challengesData from '@/data/identity-discovery-challenges.json';
import { PhaseType, UnlockedElement } from '@/types/identity-discovery';
import {
  Sparkles,
  Trophy,
  Star,
  Zap,
  Heart,
  ArrowRight,
  Check,
  Flame,
  Home,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

// Duolingo-style color palette
const colors = {
  primary: '#58CC02', // Duolingo green
  primaryDark: '#46A302',
  secondary: '#1CB0F6', // Duolingo blue
  warning: '#FF9600', // Duolingo orange
  danger: '#FF4B4B',
  success: '#58CC02',
  gold: '#FFC800',
  background: '#FFFFFF',
  cardBg: '#F7F7F7',
};

// XP Bar Component (Duolingo-style)
function XPBar({ current, max, level }: { current: number; max: number; level: number }) {
  const percentage = (current / max) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-gray-700">Level {level}</span>
        </div>
        <span className="text-sm font-semibold text-gray-600">
          {current} / {max} XP
        </span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// Streak Display (Duolingo-style)
function StreakDisplay({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 bg-orange-50 rounded-2xl px-4 py-2 border-2 border-orange-200">
      <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
      <span className="font-bold text-orange-700">{count} day streak!</span>
    </div>
  );
}

// Challenge Card (Duolingo-style)
function ChallengeCard({
  challenge,
  index,
  isUnlocked,
  isActive,
  onStart,
}: {
  challenge: any;
  index: number;
  isUnlocked: boolean;
  isActive: boolean;
  onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className={cn(
          'relative overflow-hidden border-4 transition-all hover:shadow-xl cursor-pointer',
          isUnlocked
            ? 'border-green-400 bg-green-50'
            : isActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        )}
        onClick={!isUnlocked ? onStart : undefined}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <motion.div
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl',
                isUnlocked
                  ? 'bg-green-500'
                  : 'bg-gradient-to-br from-blue-400 to-blue-600'
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {isUnlocked ? (
                <Check className="w-8 h-8 text-white" />
              ) : (
                <span>{challenge.rewardIcon}</span>
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl mb-2 text-gray-800">
                {challenge.unlockPrompt}
              </h3>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                {challenge.unlockChallenge}
              </p>

              {!isUnlocked && (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-yellow-700">
                    +50 XP
                  </span>
                </div>
              )}
            </div>

            {/* Status badge */}
            {isUnlocked && (
              <div className="flex-shrink-0">
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  COMPLETE
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {/* Progress indicator */}
        {!isUnlocked && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-0" />
          </div>
        )}
      </Card>
    </motion.div>
  );
}

// Response Modal (Duolingo-style)
function ResponseModal({
  challenge,
  onClose,
  onSubmit,
}: {
  challenge: any;
  onClose: () => void;
  onSubmit: (response: string) => void;
}) {
  const [response, setResponse] = useState('');

  const handleSubmit = () => {
    if (response.trim()) {
      onSubmit(response);
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{challenge.rewardIcon}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {challenge.unlockPrompt}
          </h2>
          <p className="text-gray-600">
            {challenge.unlockChallenge}
          </p>
        </div>

        {/* Response input */}
        <div className="mb-6">
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[150px] text-lg p-4 rounded-2xl border-3 border-gray-300 focus:border-blue-500 resize-none"
            maxLength={500}
            autoFocus
          />
          <div className="text-right mt-2 text-sm text-gray-500">
            {response.length}/500
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 h-14 text-lg font-bold rounded-2xl border-2 border-gray-300 hover:bg-gray-100"
          >
            SKIP
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!response.trim()}
            className="flex-1 h-14 text-lg font-bold rounded-2xl text-white shadow-lg"
            style={{
              backgroundColor: response.trim() ? colors.primary : '#E5E5E5',
              color: response.trim() ? 'white' : '#AFAFAF',
            }}
          >
            CONTINUE
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Success Celebration (Duolingo-style)
function SuccessCelebration({
  reward,
  xpEarned,
  onContinue,
}: {
  reward: UnlockedElement;
  xpEarned: number;
  onContinue: () => void;
}) {
  useEffect(() => {
    // Confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [colors.primary, colors.secondary, colors.gold],
    });
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: colors.primary }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center text-white"
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <motion.div
          className="text-9xl mb-6"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 0.6 }}
        >
          {reward.rewardIcon}
        </motion.div>

        <h1 className="text-5xl font-bold mb-4">Awesome!</h1>
        <p className="text-2xl mb-8 opacity-90">
          You earned: {reward.rewardName}
        </p>

        <motion.div
          className="inline-flex items-center gap-3 bg-white/20 backdrop-blur px-8 py-4 rounded-2xl mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Zap className="w-8 h-8 fill-yellow-300 text-yellow-300" />
          <span className="text-3xl font-bold">+{xpEarned} XP</span>
        </motion.div>

        <Button
          onClick={onContinue}
          className="h-16 px-12 text-xl font-bold rounded-2xl bg-white shadow-xl hover:shadow-2xl"
          style={{ color: colors.primary }}
        >
          CONTINUE
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Main Activity Content
function IdentityDiscoveryContent() {
  const { state, submitChallengeResponse, completePhase, goToPhase } =
    useIdentityDiscovery();
  const router = useRouter();

  const [activeChallenge, setActiveChallenge] = useState<any | null>(null);
  const [showCelebration, setShowCelebration] = useState<UnlockedElement | null>(null);

  const level = Math.floor(state.totalPoints / 100) + 1;
  const currentLevelXP = state.totalPoints % 100;
  const nextLevelXP = 100;

  const handleStartChallenge = (challenge: any) => {
    setActiveChallenge(challenge);
  };

  const handleSubmitResponse = (response: string) => {
    if (activeChallenge) {
      submitChallengeResponse(activeChallenge.id, response);

      // Show celebration
      const unlockedElement: UnlockedElement = {
        challengeId: activeChallenge.id,
        category: activeChallenge.category,
        element: activeChallenge.element,
        response,
        rewardType: activeChallenge.rewardType,
        rewardName: activeChallenge.rewardName,
        rewardIcon: activeChallenge.rewardIcon,
        unlockedAt: new Date(),
      };

      setShowCelebration(unlockedElement);
      setActiveChallenge(null);
    }
  };

  // Show welcome screen on first visit
  if (state.currentPhase === 'welcome') {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)` }}
      >
        <motion.div
          className="text-center text-white max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-9xl mb-8"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>

          <h1 className="text-6xl font-bold mb-6">Identity Discovery</h1>
          <p className="text-2xl mb-12 opacity-90">
            Complete 10 fun challenges to discover your unique strengths,
            values, and interests!
          </p>

          <div className="grid grid-cols-3 gap-6 mb-12 max-w-md mx-auto">
            <div>
              <div className="text-5xl mb-2">🎯</div>
              <div className="font-bold">10 Challenges</div>
            </div>
            <div>
              <div className="text-5xl mb-2">⚡</div>
              <div className="font-bold">500 XP</div>
            </div>
            <div>
              <div className="text-5xl mb-2">🏆</div>
              <div className="font-bold">Epic Rewards</div>
            </div>
          </div>

          <Button
            onClick={() => completePhase('welcome')}
            className="h-16 px-12 text-xl font-bold rounded-2xl bg-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            style={{ color: colors.primary }}
          >
            LET'S START!
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // Main challenges view
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Home className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex items-center gap-4">
              <StreakDisplay count={state.responses.length} />

              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2">
                <Trophy className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                <span className="font-bold text-gray-700">{state.badges.length}/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* XP Bar */}
        <XPBar current={currentLevelXP} max={nextLevelXP} level={level} />

        {/* Progress */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Identity Journey
          </h1>
          <p className="text-xl text-gray-600">
            {state.responses.length}/10 challenges completed
          </p>
        </div>

        {/* Challenges */}
        <div className="space-y-4 mb-8">
          {challengesData.challenges.map((challenge, index) => {
            const isUnlocked = state.unlockedElements.some(
              (e) => e.challengeId === challenge.id
            );

            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                index={index}
                isUnlocked={isUnlocked}
                isActive={false}
                onStart={() => handleStartChallenge(challenge)}
              />
            );
          })}
        </div>

        {/* Continue button */}
        {state.unlockedElements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-4 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Ready to create your canvas?
                </h3>
                <p className="text-gray-600 mb-6">
                  {state.responses.length === 10
                    ? 'Amazing! All challenges complete!'
                    : `Great progress! ${state.unlockedElements.length} elements unlocked.`}
                </p>
                <Button
                  onClick={() => completePhase('unlock')}
                  className="h-14 px-8 text-lg font-bold rounded-2xl shadow-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  CREATE CANVAS
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Response Modal */}
      <AnimatePresence>
        {activeChallenge && (
          <ResponseModal
            challenge={activeChallenge}
            onClose={() => setActiveChallenge(null)}
            onSubmit={handleSubmitResponse}
          />
        )}
      </AnimatePresence>

      {/* Success Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <SuccessCelebration
            reward={showCelebration}
            xpEarned={50}
            onContinue={() => setShowCelebration(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function IdentityDiscoveryPage() {
  return (
    <IdentityDiscoveryProvider>
      <IdentityDiscoveryContent />
    </IdentityDiscoveryProvider>
  );
}
