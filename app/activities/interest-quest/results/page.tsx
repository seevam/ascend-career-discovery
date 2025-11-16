'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { InterestQuestProvider, useInterestQuest } from '@/contexts/interest-quest-context';
import PageWrapper from '@/components/shared/layout/page-wrapper';
import RadarChart from '@/components/interest-quest/radar-chart';
import InterestCard from '@/components/interest-quest/interest-card';
import ShareModal from '@/components/shared/export/share-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Sparkles } from 'lucide-react';
import { triggerCelebration } from '@/lib/confetti';
import { exportToPDF } from '@/lib/export';
import { generateShareURL } from '@/lib/share';
import {
  InterestCategory,
  RankedInterest,
  RadarChartPoint,
  FinalResults,
} from '@/types/interest-quest';
import categoriesData from '@/data/categories.json';
import scenariosData from '@/data/scenarios.json';

function ResultsContent() {
  const router = useRouter();
  const { profile } = useInterestQuest();
  const [shareURL, setShareURL] = useState('');
  const [celebrationTriggered, setCelebrationTriggered] = useState(false);

  // Calculate final results based on responses
  const finalResults = useMemo<FinalResults | null>(() => {
    // Calculate scores for each category
    const categoryScores: Record<InterestCategory, number> = {
      arts_creativity: 0,
      stem_technology: 0,
      social_impact: 0,
      business_entrepreneurship: 0,
      nature_environment: 0,
      health_wellness: 0,
      communication_media: 0,
    };

    // Go through each category's responses
    profile.categoryProgress.forEach((categoryProgress) => {
      const categoryScenarios = scenariosData.scenarios[categoryProgress.category];
      if (!categoryScenarios) return;

      categoryProgress.responses.forEach((response) => {
        // Find the scenario
        const scenario = categoryScenarios.find((s) => s.id === response.scenarioId);
        if (!scenario) return;

        // Find the choice
        const choice = scenario.choices.find((c) => c.id === response.choiceId);
        if (!choice) return;

        // Add weights from the choice's mapping
        choice.mapping.forEach((map) => {
          const cat = map.category as InterestCategory;
          categoryScores[cat] += map.weight;
        });
      });
    });

    // Find the maximum possible score (to normalize)
    const maxScore = Math.max(...Object.values(categoryScores));
    if (maxScore === 0) return null;

    // Normalize scores to 0-100 scale
    const normalizedScores: Record<InterestCategory, number> = {} as any;
    Object.keys(categoryScores).forEach((category) => {
      normalizedScores[category as InterestCategory] = Math.round(
        (categoryScores[category as InterestCategory] / maxScore) * 100
      );
    });

    // Sort categories by score to get rankings
    const sortedCategories = Object.entries(normalizedScores).sort(
      ([, a], [, b]) => b - a
    );

    // Get top 3
    const topThree: RankedInterest[] = sortedCategories.slice(0, 3).map(([category, score], index) => {
      const categoryMeta = categoriesData.categories.find((c) => c.id === category);
      return {
        rank: (index + 1) as 1 | 2 | 3,
        category: category as InterestCategory,
        score: categoryScores[category as InterestCategory],
        percentage: score,
        description: categoryMeta?.resultDescription || '',
        sampleCareers: categoryMeta?.sampleCareers || [],
        skillsToDevelop: categoryMeta?.skillsToDevelop || [],
      };
    });

    // Check for surprise discovery (4th place with score > 60)
    const fourthPlace = sortedCategories[3];
    const surpriseDiscovery =
      fourthPlace && fourthPlace[1] > 60
        ? (fourthPlace[0] as InterestCategory)
        : null;

    // Create radar chart data
    const chartData: RadarChartPoint[] = categoriesData.categories.map((category) => ({
      category: category.name,
      value: normalizedScores[category.id as InterestCategory] || 0,
    }));

    return {
      topThree,
      allScores: normalizedScores,
      surpriseDiscovery,
      chartData,
    };
  }, [profile]);

  // Trigger confetti celebration on mount
  useEffect(() => {
    if (!celebrationTriggered && finalResults) {
      triggerCelebration();
      setCelebrationTriggered(true);
    }
  }, [celebrationTriggered, finalResults]);

  // Generate share URL
  const handleGenerateShareURL = () => {
    if (!finalResults) return;
    const url = generateShareURL('/activities/interest-quest', finalResults);
    setShareURL(url);
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      await exportToPDF('results-content', 'interest-quest-results.pdf');
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  if (!finalResults) {
    return (
      <PageWrapper>
        <div className="flex min-h-screen items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>No Results Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                You need to complete at least 3 categories to view your results.
              </p>
              <Button onClick={() => router.push('/activities/interest-quest/explore')}>
                Continue Exploring
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div id="results-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-4xl shadow-lg">
              ✨
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Your Interest Constellation
          </h1>
          <p className="text-lg text-gray-600">
            Discover your unique pattern of interests and career possibilities
          </p>
          <div className="mt-4 flex justify-center">
            <Badge variant="secondary" className="text-sm">
              Completed on {new Date(profile.completedAt || Date.now()).toLocaleDateString()}
            </Badge>
          </div>
        </div>

        {/* Radar Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Your Interest Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart chartData={finalResults.chartData} />
            <p className="mt-4 text-center text-sm text-gray-600">
              This chart shows your relative interest levels across all 7 categories
            </p>
          </CardContent>
        </Card>

        {/* Top 3 Interests */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Your Top 3 Interest Areas
          </h2>
          <div className="space-y-6">
            {finalResults.topThree.map((interest) => {
              const categoryMeta = categoriesData.categories.find(
                (c) => c.id === interest.category
              );
              return (
                <InterestCard
                  key={interest.category}
                  interest={interest}
                  icon={categoryMeta?.icon || ''}
                />
              );
            })}
          </div>
        </div>

        {/* Surprise Discovery */}
        {finalResults.surpriseDiscovery && (
          <Card className="mb-8 border-2 border-purple-300 bg-purple-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                Surprise Discovery!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                You also scored high in{' '}
                <strong>
                  {categoriesData.categories
                    .find((c) => c.id === finalResults.surpriseDiscovery)
                    ?.name || ''}
                </strong>
                ! This might be an interest area worth exploring further.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Export Buttons */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={handleExportPDF} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <ShareModal shareURL={shareURL} onGenerateURL={handleGenerateShareURL} />
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Save your results or share them with teachers, mentors, or college counselors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>
                  Explore careers in your top interest areas - talk to professionals, shadow them, or
                  research online
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>
                  Start developing the recommended skills through online courses, workshops, or school
                  clubs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>
                  Look for internships, volunteer opportunities, or projects related to your interests
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>
                  Continue exploring other activities on Ascend to learn more about yourself
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/activities/interest-quest/explore')}
          >
            Explore More Categories
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default function ResultsPage() {
  return (
    <InterestQuestProvider>
      <ResultsContent />
    </InterestQuestProvider>
  );
}
