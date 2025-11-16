'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { InterestQuestProvider, useInterestQuest } from '@/contexts/interest-quest-context';
import PageWrapper from '@/components/shared/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scenario, InterestCategory } from '@/types/interest-quest';
import categoriesData from '@/data/categories.json';
import scenariosData from '@/data/scenarios.json';

function ScenarioContent() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.category as InterestCategory;

  const { recordResponse, isCategoryCompleted } = useInterestQuest();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get scenarios for this category
  const scenarios = (scenariosData.scenarios[categoryId as keyof typeof scenariosData.scenarios] ||
    []) as Scenario[];

  // Get category metadata
  const category = categoriesData.categories.find((c) => c.id === categoryId);

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
      }
    }, 300);
  };

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

          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Scenario {currentScenarioIndex + 1} of {scenarios.length}
            </span>
            <div className="flex gap-1.5">
              {scenarios.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentScenarioIndex
                      ? 'w-8 bg-purple-600'
                      : index < currentScenarioIndex
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scenario Card */}
        <div
          className={`transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Card className="mb-6 bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {currentScenario.question}
            </h2>

            {/* Choices */}
            <div className="space-y-3">
              {currentScenario.choices.map((choice) => (
                <button
                  key={choice.id}
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
                </button>
              ))}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!selectedChoice}
              className="h-12 px-8 text-base font-semibold shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
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
            </Button>
          </div>

          {/* Tip */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-sm text-blue-800">
              💡 Choose the option that feels most natural to you - there are no wrong answers!
            </p>
          </div>
        </div>
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
