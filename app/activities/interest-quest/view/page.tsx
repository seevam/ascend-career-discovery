'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageWrapper from '@/components/shared/layout/page-wrapper';
import RadarChart from '@/components/interest-quest/radar-chart';
import InterestCard from '@/components/interest-quest/interest-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Sparkles } from 'lucide-react';
import { decodeShareURL } from '@/lib/share';
import { FinalResults } from '@/types/interest-quest';
import categoriesData from '@/data/categories.json';

function ViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [finalResults, setFinalResults] = useState<FinalResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const encodedData = searchParams.get('data');
    if (!encodedData) {
      setError('No data provided');
      setIsLoading(false);
      return;
    }

    try {
      const decodedData = decodeShareURL(encodedData);
      if (!decodedData) {
        setError('Invalid or corrupted data');
        setIsLoading(false);
        return;
      }

      setFinalResults(decodedData);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to decode share URL:', err);
      setError('Failed to load results');
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-4xl">⏳</div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !finalResults) {
    return (
      <PageWrapper>
        <div className="flex min-h-screen items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Unable to Load Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                {error || 'The shared link appears to be invalid or corrupted.'}
              </p>
              <Button onClick={() => router.push('/activities/interest-quest')}>
                Try Interest Quest Yourself
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with View Only Badge */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-4xl shadow-lg">
              ✨
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Interest Quest Results
          </h1>
          <p className="text-lg text-gray-600">
            Shared Interest Constellation
          </p>
          <div className="mt-4 flex justify-center">
            <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700">
              <Eye className="mr-1 h-3 w-3" />
              View Only
            </Badge>
          </div>
        </div>

        {/* Radar Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Interest Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart chartData={finalResults.chartData} />
            <p className="mt-4 text-center text-sm text-gray-600">
              This chart shows relative interest levels across all 7 categories
            </p>
          </CardContent>
        </Card>

        {/* Top 3 Interests */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Top 3 Interest Areas
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
                This person also scored high in{' '}
                <strong>
                  {categoriesData.categories
                    .find((c) => c.id === finalResults.surpriseDiscovery)
                    ?.name || ''}
                </strong>
                !
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA for visitors */}
        <Card className="bg-gradient-to-br from-purple-100 to-blue-100">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Discover Your Own Interests
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-gray-700">
              Want to explore your own interest areas and career possibilities? Take the
              Interest Quest yourself!
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/activities/interest-quest')}
              className="shadow-lg transition-transform hover:scale-105"
            >
              Try It Yourself
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ViewContent />
    </Suspense>
  );
}
