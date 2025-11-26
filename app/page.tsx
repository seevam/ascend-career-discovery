'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Palette,
  Trophy,
  ArrowRight,
  Zap,
  Star,
  Heart,
  Target,
  Flame,
  Award,
} from 'lucide-react';

// Duolingo-style colors
const colors = {
  primary: '#58CC02',
  secondary: '#1CB0F6',
  orange: '#FF9600',
  gold: '#FFC800',
  pink: '#FF4B4B',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-2xl">
                🚀
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Ascend Now</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-orange-50 rounded-2xl px-4 py-2 border-2 border-orange-200">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <span className="font-bold text-orange-700">Start your journey!</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-8xl md:text-9xl mb-6"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Discover Your Path
          </h2>
          <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto font-medium">
            Three fun activities to explore your interests and unlock your potential!
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-blue-200">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-3xl font-bold text-gray-800">45+</div>
              <div className="text-sm text-gray-600 font-semibold">Challenges</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-green-200">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-3xl font-bold text-gray-800">1000+</div>
              <div className="text-sm text-gray-600 font-semibold">XP to Earn</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-yellow-200">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-3xl font-bold text-gray-800">25+</div>
              <div className="text-sm text-gray-600 font-semibold">Rewards</div>
            </div>
          </div>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Activity 1: Interest Quest */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 hover:shadow-2xl transition-all border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 h-full group hover:scale-105 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-2xl group-hover:rotate-12 transition-transform">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Interest Quest</h3>
              </div>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Explore 7 career areas through 35 fun scenarios. Discover your top 3 interests!
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-purple-600 fill-purple-600" />
                  <span className="text-gray-700 font-semibold">35 scenarios</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-gray-700 font-semibold">Earn achievements</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-600 fill-purple-600" />
                  <span className="text-gray-700 font-semibold">Career recommendations</span>
                </div>
              </div>

              <Link href="/activities/interest-quest" className="block">
                <Button
                  className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg text-white"
                  style={{ backgroundColor: '#9333EA' }}
                >
                  START QUEST
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* Activity 2: Canvas Builder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 hover:shadow-2xl transition-all border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 h-full group hover:scale-105 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-2xl group-hover:rotate-12 transition-transform">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Canvas Builder</h3>
              </div>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Create a visual canvas with your strengths, passions, values, and goals!
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
                  <span className="text-gray-700 font-semibold">100+ visual elements</span>
                </div>
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 font-semibold">Custom backgrounds</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  <span className="text-gray-700 font-semibold">Download & share</span>
                </div>
              </div>

              <Link href="/activities/canvas-builder" className="block">
                <Button
                  className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg text-white"
                  style={{ backgroundColor: colors.secondary }}
                >
                  START BUILDING
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* Activity 3: Identity Discovery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 hover:shadow-2xl transition-all border-4 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 h-full group hover:scale-105 duration-300 relative overflow-hidden">
              {/* "NEW" badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                NEW! 🔥
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl group-hover:rotate-12 transition-transform">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Identity Discovery</h3>
              </div>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Complete 10 fun challenges to unlock your unique strengths, values, and interests!
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                  <span className="text-gray-700 font-semibold">10 unlock challenges</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                  <span className="text-gray-700 font-semibold">Earn epic rewards</span>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                  <span className="text-gray-700 font-semibold">500 XP + mega badge</span>
                </div>
              </div>

              <Link href="/activities/identity-discovery" className="block">
                <Button
                  className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  START DISCOVERY
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
            Why Choose Ascend Now?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-purple-300">
                <div className="text-4xl">💾</div>
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-800">Auto-Save Progress</h4>
              <p className="text-gray-600 leading-relaxed">
                Your progress is automatically saved. Come back anytime and pick up where you left off!
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-blue-300">
                <div className="text-4xl">🎮</div>
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-800">Fun & Gamified</h4>
              <p className="text-gray-600 leading-relaxed">
                Earn XP, unlock achievements, and level up as you discover your career path!
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-green-300">
                <div className="text-4xl">✨</div>
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-800">Personalized Results</h4>
              <p className="text-gray-600 leading-relaxed">
                Get customized insights, career recommendations, and a visual identity canvas!
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">Ready to Begin?</h3>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Start your career discovery journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/activities/identity-discovery">
                <Button
                  className="h-16 px-10 text-xl font-bold rounded-2xl bg-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  style={{ color: colors.primary }}
                >
                  <Zap className="w-6 h-6 mr-2 fill-current" />
                  START NOW!
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 font-medium">
            Part of the Ascend Now 10-Session Career Discovery Program
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
        </div>
      </footer>
    </div>
  );
}
