'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { IdentityCanvas } from '@/components/identity-discovery/identity-canvas';
import { BadgeDisplay, BadgeGrid } from '@/components/identity-discovery/badge-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { STORAGE_KEYS, loadFromStorage } from '@/lib/storage';
import { IdentityDiscoveryState } from '@/types/identity-discovery';
import challengesData from '@/data/identity-discovery-challenges.json';
import {
  Download,
  Share2,
  Edit3,
  ArrowLeft,
  Trophy,
  Calendar,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';

export default function ViewIdentityDiscoveryPage() {
  const [state, setState] = useState<IdentityDiscoveryState | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load saved state from localStorage
    const savedState = loadFromStorage<IdentityDiscoveryState>(
      STORAGE_KEYS.IDENTITY_DISCOVERY
    );

    if (savedState) {
      setState(savedState);
    }

    setLoading(false);
  }, []);

  const handleExport = () => {
    // Export canvas as image
    // This would be implemented in the actual component
    console.log('Export canvas');
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: 'My Identity Canvas',
        text: 'Check out my Identity Discovery Canvas!',
        url: window.location.href,
      });
    }
  };

  const handleEdit = () => {
    router.push('/activities/identity-discovery');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-6xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            ✨
          </motion.div>
          <p className="text-muted-foreground">Loading your canvas...</p>
        </motion.div>
      </div>
    );
  }

  if (!state || !state.completedAt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>No Completed Canvas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You haven't completed your Identity Discovery journey yet. Start
              the activity to create your unique canvas!
            </p>
            <Button onClick={() => router.push('/activities/identity-discovery')}>
              <Sparkles className="w-4 h-4 mr-2" />
              Start Identity Discovery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCompletionTime = () => {
    if (!state.completedAt) return 'N/A';
    const start = new Date(state.startedAt);
    const end = new Date(state.completedAt);
    const diffMinutes = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/activities')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Title and completion badge */}
        <motion.div
          className="text-center mb-8 space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">
              {state.studentName
                ? `${state.studentName}'s Identity Canvas`
                : 'My Identity Canvas'}
            </h1>
            <p className="text-muted-foreground">
              A visual representation of your unique strengths, values, and
              interests
            </p>
          </div>

          {state.megaBadgeUnlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <Badge variant="secondary" className="text-lg px-6 py-3">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Identity Architect
              </Badge>
            </motion.div>
          )}
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-lg font-semibold">
                    {formatDate(state.completedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Taken</p>
                  <p className="text-lg font-semibold">{getCompletionTime()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-lg font-semibold">{state.totalPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                  <p className="text-lg font-semibold">{state.badges.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canvas display */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="aspect-[4/3]">
              <IdentityCanvas
                elements={state.canvasElements}
                background={state.canvasBackground}
                isEditable={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Responses section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Challenge responses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Your Reflections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.responses.map((response) => {
                  const challenge = challengesData.challenges.find(
                    (c) => c.id === response.challengeId
                  );
                  if (!challenge) return null;

                  return (
                    <div
                      key={response.challengeId}
                      className="p-4 rounded-lg border border-border space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{challenge.rewardIcon}</span>
                        <p className="font-semibold text-sm">
                          {challenge.unlockPrompt}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{response.response}"
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Badges collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Badges & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BadgeGrid>
                {state.unlockedElements.map((element) => (
                  <BadgeDisplay
                    key={element.challengeId}
                    rewardType={element.rewardType}
                    rewardName={element.rewardName}
                    rewardIcon={element.rewardIcon}
                    unlocked={true}
                    size="sm"
                    showLabel={true}
                  />
                ))}

                {/* Mega badge */}
                {state.megaBadgeUnlocked && (
                  <BadgeDisplay
                    rewardType="mega-badge"
                    rewardName="Identity Architect"
                    rewardIcon={challengesData.megaBadge.icon}
                    unlocked={true}
                    size="sm"
                    showLabel={true}
                  />
                )}
              </BadgeGrid>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8">
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/activities')}
          >
            Explore More Activities
          </Button>
          <Button size="lg" onClick={handleExport}>
            <Download className="w-5 h-5 mr-2" />
            Download My Canvas
          </Button>
        </div>
      </div>
    </div>
  );
}
