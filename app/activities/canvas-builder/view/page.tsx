'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { decodeShareURL } from '@/lib/share';
import { CanvasData, CanvasZone as CanvasZoneType } from '@/types/canvas-builder';
import { CanvasZone } from '@/components/canvas-builder/canvas-zone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles } from 'lucide-react';

function CanvasViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const encodedData = searchParams.get('data');
    if (!encodedData) {
      setError('No canvas data found in URL');
      return;
    }

    const decoded = decodeShareURL(encodedData);
    if (!decoded) {
      setError('Invalid or corrupted canvas data');
      return;
    }

    setCanvasData(decoded);
  }, [searchParams]);

  const getBackgroundStyle = () => {
    if (!canvasData) return {};
    const { background } = canvasData;
    if (background.type === 'gradient') {
      return {
        background: `linear-gradient(${background.gradientDirection || 'to-r'}, ${background.colors.join(', ')})`,
      };
    }
    return {
      backgroundColor: background.colors[0],
    };
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/activities/canvas-builder')}>
            Create Your Own Canvas
          </Button>
        </div>
      </div>
    );
  }

  if (!canvasData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/activities/canvas-builder')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Career Discovery Canvas
              </h1>
              <Badge variant="secondary">View Only</Badge>
            </div>

            <Button
              onClick={() => router.push('/activities/canvas-builder')}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Try It Yourself</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Canvas Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div
          className="p-6 md:p-8 rounded-lg shadow-lg"
          style={getBackgroundStyle()}
        >
          {canvasData.studentName && (
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              {canvasData.studentName}&apos;s Career Discovery Canvas
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <CanvasZone
              zone="strengths"
              elements={canvasData.elements.filter((el) => el.zone === 'strengths')}
              onRemoveElement={() => {}}
              isPreview={true}
            />

            {/* Passions */}
            <CanvasZone
              zone="passions"
              elements={canvasData.elements.filter((el) => el.zone === 'passions')}
              onRemoveElement={() => {}}
              isPreview={true}
            />

            {/* Values */}
            <CanvasZone
              zone="values"
              elements={canvasData.elements.filter((el) => el.zone === 'values')}
              onRemoveElement={() => {}}
              isPreview={true}
            />

            {/* Goals */}
            <CanvasZone
              zone="goals"
              elements={canvasData.elements.filter((el) => el.zone === 'goals')}
              onRemoveElement={() => {}}
              isPreview={true}
            />

            {/* Quote - Full Width */}
            <div className="md:col-span-2">
              <CanvasZone
                zone="quote"
                elements={[]}
                onRemoveElement={() => {}}
                quote={canvasData.personalQuote}
                isPreview={true}
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">
              Ready to Create Your Own?
            </h3>
            <p className="text-gray-600 mb-4">
              Build your personal career discovery canvas and share it with others!
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/activities/canvas-builder')}
              className="gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Start Building
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CanvasViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading canvas...</p>
          </div>
        </div>
      }
    >
      <CanvasViewContent />
    </Suspense>
  );
}
