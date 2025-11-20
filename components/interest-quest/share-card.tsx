'use client';

import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FinalResults, InterestCategory } from '@/types/interest-quest';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import categoriesData from '@/data/categories.json';

interface ShareCardProps {
  results: FinalResults;
  shareURL: string;
  studentName?: string;
  points?: number;
  level?: number;
}

export function ShareCard({ results, shareURL, studentName, points = 0, level = 1 }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        width: 1080,
        height: 1920,
      });

      const link = document.createElement('a');
      link.download = 'career-discovery-results.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate share card:', error);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        width: 1080,
        height: 1920,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], 'career-discovery-results.png', {
          type: 'image/png',
        });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'My Career Discovery Results',
            text: 'Check out my career interest results!',
          });
        } else {
          // Fallback to download
          handleDownload();
        }
      });
    } catch (error) {
      console.error('Failed to share:', error);
      handleDownload();
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview Card - Instagram Story Size (1080x1920) */}
      <div className="overflow-hidden rounded-lg shadow-2xl" style={{ width: '540px', height: '960px' }}>
        <div
          ref={cardRef}
          className="relative flex flex-col items-center justify-between bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-16 text-white"
          style={{ width: '1080px', height: '1920px', transform: 'scale(0.5)', transformOrigin: 'top left' }}
        >
          {/* Header */}
          <div className="w-full text-center">
            <div className="mb-8 text-8xl">✨</div>
            <h1 className="mb-4 text-8xl font-bold">Career Discovery</h1>
            {studentName && (
              <p className="text-5xl font-semibold opacity-90">{studentName}&apos;s Results</p>
            )}
          </div>

          {/* Top 3 Interests */}
          <div className="w-full flex-1 space-y-8 py-16">
            <h2 className="mb-12 text-center text-6xl font-bold">My Top 3 Interests</h2>
            {results.topThree.map((interest, index) => {
              const categoryMeta = categoriesData.categories.find(
                (c) => c.id === interest.category
              );
              const medals = ['🥇', '🥈', '🥉'];

              return (
                <div
                  key={interest.category}
                  className="flex items-center gap-8 rounded-3xl bg-white/20 p-10 backdrop-blur-sm"
                >
                  <div className="text-8xl">{medals[index]}</div>
                  <div className="text-7xl">{categoryMeta?.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-5xl font-bold">{categoryMeta?.name}</h3>
                    <div className="mt-4 h-6 overflow-hidden rounded-full bg-white/30">
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: `${interest.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-6xl font-bold">{interest.percentage}%</div>
                </div>
              );
            })}
          </div>

          {/* Stats and QR Code */}
          <div className="w-full space-y-8">
            {/* Stats */}
            <div className="flex justify-center gap-12">
              <div className="text-center">
                <div className="text-7xl font-bold">{level}</div>
                <div className="text-4xl opacity-90">Level</div>
              </div>
              <div className="text-center">
                <div className="text-7xl font-bold">{points}</div>
                <div className="text-4xl opacity-90">XP</div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-6">
              <div className="rounded-3xl bg-white p-8">
                <QRCodeCanvas value={shareURL} size={300} level="H" />
              </div>
              <p className="text-center text-4xl font-semibold">
                Scan to view full results
              </p>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-5xl font-bold">Ascend Career Discovery</p>
              <p className="mt-2 text-3xl opacity-75">Find Your Path</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleDownload} variant="outline" className="flex-1">
          <Download className="mr-2 h-5 w-5" />
          Download Story
        </Button>
        <Button onClick={handleShare} className="flex-1">
          <Share2 className="mr-2 h-5 w-5" />
          Share
        </Button>
      </div>
      <p className="text-center text-sm text-gray-600">
        Optimized for Instagram Stories (1080x1920)
      </p>
    </div>
  );
}
