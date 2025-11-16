'use client';

import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/shared/layout/page-wrapper';
import { Button } from '@/components/ui/button';

export default function InterestQuestLanding() {
  const router = useRouter();

  return (
    <PageWrapper className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-4xl shadow-lg">
              🧭
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Activity 1: Interest Quest
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-xl text-gray-600 sm:text-2xl">
            Discover what truly excites you through interactive scenarios
          </p>

          {/* Description */}
          <div className="mb-8 rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm">
            <p className="mb-6 text-lg text-gray-700">
              Embark on a journey of self-discovery! You'll explore 7 different interest areas
              through real-world scenarios. Each scenario helps us understand what naturally
              draws your attention and sparks your curiosity.
            </p>

            {/* Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-purple-50 p-4">
                <div className="mb-2 text-2xl">⏱️</div>
                <h3 className="mb-1 font-semibold text-gray-900">Time Required</h3>
                <p className="text-sm text-gray-600">15-20 minutes</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="mb-2 text-2xl">📱</div>
                <h3 className="mb-1 font-semibold text-gray-900">Device Friendly</h3>
                <p className="text-sm text-gray-600">Works on phone, tablet, or desktop</p>
              </div>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="mb-10 text-left">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
              What You'll Discover
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <div className="text-2xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Top 3 Interest Areas</h3>
                  <p className="text-sm text-gray-600">See which categories resonate most with you</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <div className="text-2xl">💼</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Career Path Ideas</h3>
                  <p className="text-sm text-gray-600">Explore careers that match your interests</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <div className="text-2xl">🛠️</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Skills to Develop</h3>
                  <p className="text-sm text-gray-600">Get personalized recommendations for your journey</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={() => router.push('/activities/interest-quest/explore')}
            className="h-14 px-8 text-lg font-semibold shadow-lg transition-transform hover:scale-105"
          >
            Start Your Journey
          </Button>

          {/* Additional Info */}
          <p className="mt-6 text-sm text-gray-500">
            Your progress is automatically saved. You can pause and come back anytime.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
