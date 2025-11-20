'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { InterestQuestProvider, useInterestQuest } from '@/contexts/interest-quest-context';
import PageWrapper from '@/components/shared/layout/page-wrapper';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Card } from '@/components/ui/card';
import { Scenario, InterestCategory } from '@/types/interest-quest';
import { StoryProgress } from '@/components/interest-quest/story-progress';
import { AchievementPopup } from '@/components/interest-quest/achievement-popup';
import { FloatingTracker } from '@/components/interest-quest/floating-tracker';
import categoriesData from '@/data/categories.json';
import scenariosData from '@/data/scenarios.json';

// Category color mapping for progress bars
const CATEGORY_COLORS: Record<InterestCategory, string> = {
  arts_creativity: '#9333ea',
  stem_technology: '#3b82f6',
  social_impact: '#22c55e',
  business_entrepreneurship: '#f97316',
  nature_environment: '#10b981',
  health_wellness: '#ef4444',
  communication_media: '#6366f1',
};

function ScenarioContent() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.category as InterestCategory;

  const {
    profile,
    recordResponse,
    isCategoryCompleted,
    currentAchievement,
    clearAchievement,
    startCategory
  } = useInterestQuest();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Get scenarios for this category
  const scenarios = (scenariosData.scenarios[categoryId as keyof typeof scenariosData.scenarios] ||
    []) as Scenario[];

  // Get category metadata
  const category = categoriesData.categories.find((c) => c.id === categoryId);

  // Calculate real-time top interests
  const topInterests = useMemo(() => {
    const categoryScores: Record<InterestCategory, number> = {
      arts_creativity: 0,
      stem_technology: 0,
      social_impact: 0,
      business_entrepreneurship: 0,
      nature_environment: 0,
      health_wellness: 0,
      communication_media: 0,
    };

    // Calculate scores from all responses
    profile.categoryProgress.forEach((categoryProgress) => {
      const categoryScenarios = scenariosData.scenarios[categoryProgress.category];
      if (!categoryScenarios) return;

      categoryProgress.responses.forEach((response) => {
        const scenario = categoryScenarios.find((s) => s.id === response.scenarioId);
        if (!scenario) return;

        const choice = scenario.choices.find((c) => c.id === response.choiceId);
        if (!choice) return;

        choice.mapping.forEach((map) => {
          categoryScores[map.category as InterestCategory] += map.weight;
        });
      });
    });

    // Sort and return top 3
    return Object.entries(categoryScores)
      .map(([category, score]) => ({
        category: category as InterestCategory,
        score,
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [profile.categoryProgress]);

  // Start tracking time for this category
  useEffect(() => {
    if (category && !isCategoryCompleted(categoryId)) {
      startCategory(categoryId);
    }
  }, [category, categoryId, isCategoryCompleted, startCategory]);

  // Redirect if category not found or already completed
  useEffect(() => {
    if (!category) {
      router.push('/activities/interest-quest/explore');
      return;
    }

    if (isCategoryCompleted(categoryId)) {
      router.push('/activities/interest-quest/explore');
      return;
    }
  }, [category, categoryId, isCategoryCompleted, router]);

  if (!category || scenarios.length === 0) {
    return (
      <PageWrapper>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Loading...</h1>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];
  const isLastScenario = currentScenarioIndex === scenarios.length - 1;

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId);
  };

  const handleNext = () => {
    if (!selectedChoice) return;

    // Record the response
    recordResponse(currentScenario.id, selectedChoice, categoryId);

    setIsTransitioning(true);
    setSwipeDirection('up');

    // Delay before moving to next scenario or returning to explore
    setTimeout(() => {
      if (isLastScenario) {
        // Return to explore page after completing all scenarios
        router.push('/activities/interest-quest/explore');
      } else {
        // Move to next scenario
        setCurrentScenarioIndex(currentScenarioIndex + 1);
        setSelectedChoice(null);
        setIsTransitioning(false);
        setSwipeDirection(null);
        setShowHint(false);
      }
    }, 300);
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => {
      if (selectedChoice) {
        handleNext();
      }
    },
    onSwipedDown: () => {
      setShowHint(!showHint);
    },
    trackMouse: true,
    delta: 50,
  });

  return (
    <PageWrapper className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/activities/interest-quest/explore')}
            className="mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Categories
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>

          {/* Story-Style Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Question {currentScenarioIndex + 1} of {scenarios.length}
              </span>
              <span className="text-xs text-gray-500">
                {Math.round(((currentScenarioIndex) / scenarios.length) * 100)}% Complete
              </span>
            </div>
            <StoryProgress
              total={scenarios.length}
              current={currentScenarioIndex}
              categoryColor={CATEGORY_COLORS[categoryId]}
            />
          </div>
        </div>

        {/* Scenario Card with Swipe Support */}
        <div {...swipeHandlers} className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScenarioIndex}
              initial={{ y: swipeDirection === 'down' ? -50 : 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{
                y: swipeDirection === 'up' ? -100 : swipeDirection === 'down' ? 100 : 0,
                opacity: 0
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Card className="mb-6 bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {currentScenario.question}
            </h2>

            {/* Choices */}
            <div className="space-y-3">
              {currentScenario.choices.map((choice, index) => (
                <motion.button
                  key={choice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleChoiceSelect(choice.id)}
                  className={`
                    group w-full rounded-xl border-2 p-4 text-left transition-all
                    ${
                      selectedChoice === choice.id
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Radio Circle */}
                    <div
                      className={`
                      mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all
                      ${
                        selectedChoice === choice.id
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300 group-hover:border-purple-400'
                      }
                    `}
                    >
                      {selectedChoice === choice.id && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Choice Text */}
                    <p
                      className={`
                      flex-1 transition-colors
                      ${
                        selectedChoice === choice.id
                          ? 'font-medium text-purple-900'
                          : 'text-gray-700 group-hover:text-purple-800'
                      }
                    `}
                    >
                      {choice.text}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Swipe Hint Indicator */}
          {selectedChoice && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-500"
            >
              <svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>Swipe up or click Next to continue</span>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-end">
            <AnimatedButton
              size="lg"
              onClick={handleNext}
              disabled={!selectedChoice}
              className="h-12 px-8 text-base font-semibold shadow-lg disabled:opacity-50"
            >
              {isLastScenario ? 'Complete Category' : 'Next Scenario'}
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </AnimatedButton>
          </div>

          {/* Tip */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-sm text-blue-800">
              💡 Choose the option that feels most natural to you - there are no wrong answers!
            </p>
          </div>

          {/* Expandable Hint (Swipe Down) */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden rounded-lg bg-purple-50 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💭</span>
                  <div>
                    <h4 className="font-semibold text-purple-900">Think about it...</h4>
                    <p className="mt-1 text-sm text-purple-700">
                      Consider which option reflects what you genuinely enjoy, not what others expect of you.
                      Your authentic interests will guide you to the most fulfilling career path.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Achievement Popup */}
        <AchievementPopup
          achievement={currentAchievement}
          onClose={clearAchievement}
        />

        {/* Floating Interest Tracker */}
        <FloatingTracker topInterests={topInterests} />
      </div>
    </PageWrapper>
  );
}

export default function ScenarioPage() {
  return (
    <InterestQuestProvider>
      <ScenarioContent />
    </InterestQuestProvider>
  );
}
