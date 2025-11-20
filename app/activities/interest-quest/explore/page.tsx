'use client';

import { useRouter } from 'next/navigation';
import { InterestQuestProvider, useInterestQuest } from '@/contexts/interest-quest-context';
import PageWrapper from '@/components/shared/layout/page-wrapper';
import CategoryCard from '@/components/interest-quest/category-card';
import { StreakDisplay } from '@/components/interest-quest/streak-display';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import categoriesData from '@/data/categories.json';

function ExploreContent() {
  const router = useRouter();
  const { profile, getCompletedCategories, isCategoryCompleted } = useInterestQuest();

  const completedCount = getCompletedCategories();
  const totalCategories = categoriesData.categories.length;
  const progressPercentage = (completedCount / totalCategories) * 100;
  const canViewConstellation = completedCount >= 3;

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/activities/interest-quest/scenario/${categoryId}`);
  };

  const handleViewConstellation = () => {
    if (canViewConstellation) {
      router.push('/activities/interest-quest/results');
    }
  };

  return (
    <PageWrapper className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-3xl shadow-lg">
              🧭
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Explore Interest Areas</h1>
          <p className="text-lg text-gray-600">
            Choose a category to begin exploring through interactive scenarios
          </p>
        </div>

        {/* Streak & XP Display */}
        <StreakDisplay points={profile.points} />

        {/* Progress Tracker */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
              <p className="text-sm text-gray-600">
                Complete at least 3 categories to view your constellation
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {completedCount}/{totalCategories}
              </div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Categories Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesData.categories.map((category) => (
            <CategoryCard
              key={category.id}
              icon={category.icon}
              name={category.name}
              description={category.description}
              completed={isCategoryCompleted(category.id as any)}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>

        {/* View Constellation Button */}
        <div className="flex justify-center">
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleViewConstellation}
              disabled={!canViewConstellation}
              className="h-14 px-8 text-lg font-semibold shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
            >
              {canViewConstellation ? (
                <>
                  <span className="mr-2">✨</span>
                  View My Constellation
                </>
              ) : (
                <>
                  <span className="mr-2">🔒</span>
                  Complete {3 - completedCount} More to Unlock
                </>
              )}
            </Button>
            {canViewConstellation && (
              <p className="mt-3 text-sm text-gray-600">
                See your personalized interest profile and career recommendations
              </p>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 rounded-xl bg-blue-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-blue-900">
            <span className="text-xl">💡</span>
            Tips for Getting the Most Out of This Activity
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Answer honestly - there are no right or wrong choices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Go with your first instinct rather than overthinking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Explore all categories to get a complete picture of your interests</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Your progress is automatically saved - take breaks if needed</span>
            </li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  );
}

export default function ExplorePage() {
  return (
    <InterestQuestProvider>
      <ExploreContent />
    </InterestQuestProvider>
  );
}
