'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Palette, Trophy, ArrowRight, Clock, Smartphone } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="p-6 text-white">
        <h1 className="text-2xl font-bold">Ascend Now</h1>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Discover Your Path
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Three interactive activities to help you explore your interests and express your identity
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Activity 1: Interest Quest */}
          <Card className="p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold">Interest Discovery Quest</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Explore different career interests through interactive scenarios and watch your personal constellation form. Discover your top 3 interest areas and potential career paths.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>15-20 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Smartphone className="w-4 h-4" />
                <span>Mobile friendly</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <span className="text-purple-600">✓</span>
                <span className="text-sm text-gray-600">35 engaging scenario questions</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">✓</span>
                <span className="text-sm text-gray-600">Visual radar chart of your interests</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">✓</span>
                <span className="text-sm text-gray-600">Personalized career recommendations</span>
              </div>
            </div>

            <Link href="/activities/interest-quest">
              <Button className="w-full" size="lg">
                Start Interest Quest
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          {/* Activity 2: Canvas Builder */}
          <Card className="p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold">Identity Canvas Builder</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Create a visual canvas that expresses your strengths, passions, values, and goals. Build a unique representation of who you are and what matters to you.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>15-20 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Smartphone className="w-4 h-4" />
                <span>Mobile friendly</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span className="text-sm text-gray-600">100+ icons and visual elements</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span className="text-sm text-gray-600">Customizable backgrounds and colors</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span className="text-sm text-gray-600">Download and share your canvas</span>
              </div>
            </div>

            <Link href="/activities/canvas-builder">
              <Button className="w-full" size="lg" variant="secondary">
                Start Canvas Builder
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          {/* Activity 3: Identity Discovery */}
          <Card className="p-8 hover:shadow-2xl transition-shadow border-2 border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold">Identity Discovery</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Unlock your unique identity through 10 meaningful challenges. Reflect on your strengths, values, and interests, then compose them into a visual identity canvas.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>20-25 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Smartphone className="w-4 h-4" />
                <span>Mobile friendly</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600">✓</span>
                <span className="text-sm text-gray-600">10 gamified unlock challenges</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-600">✓</span>
                <span className="text-sm text-gray-600">Earn badges, stickers, and rewards</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-600">✓</span>
                <span className="text-sm text-gray-600">Create your unique identity collage</span>
              </div>
            </div>

            <Link href="/activities/identity-discovery">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700" size="lg">
                Start Identity Discovery
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-white">
          <h3 className="text-xl font-bold mb-4 text-center">Why These Activities?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💾</div>
              <h4 className="font-semibold mb-2">Auto-Save</h4>
              <p className="text-sm text-blue-100">
                Your progress is automatically saved so you can come back anytime
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold mb-2">Personalized Results</h4>
              <p className="text-sm text-blue-100">
                Get customized insights based on your unique responses
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔗</div>
              <h4 className="font-semibold mb-2">Share & Export</h4>
              <p className="text-sm text-blue-100">
                Download PDFs or share results with mentors and teachers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-white/60 py-8">
        <p className="text-sm">
          Part of the Ascend Now 10-Session Career Discovery Program
        </p>
      </footer>
    </div>
  );
}
