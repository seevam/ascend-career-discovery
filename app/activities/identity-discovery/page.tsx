'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  IdentityDiscoveryProvider,
  useIdentityDiscovery,
} from '@/contexts/identity-discovery-context';
import { UnlockChallengeCard } from '@/components/identity-discovery/unlock-challenge-card';
import { BadgeDisplay, BadgeGrid, RewardPopup } from '@/components/identity-discovery/badge-display';
import { IdentityCanvas } from '@/components/identity-discovery/identity-canvas';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import challengesData from '@/data/identity-discovery-challenges.json';
import { PhaseType, UnlockedElement } from '@/types/identity-discovery';
import {
  Sparkles,
  Trophy,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Home,
  Download,
  Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function PhaseIndicator({
  currentPhase,
  completedPhases,
}: {
  currentPhase: PhaseType;
  completedPhases: Set<PhaseType>;
}) {
  const phases: { id: PhaseType; label: string; icon: string }[] = [
    { id: 'welcome', label: 'Welcome', icon: '👋' },
    { id: 'unlock', label: 'Unlock Challenges', icon: '🔓' },
    { id: 'compose', label: 'Compose Canvas', icon: '🎨' },
    { id: 'finalize', label: 'Finalize', icon: '🏆' },
  ];

  const currentIndex = phases.findIndex((p) => p.id === currentPhase);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
      {phases.map((phase, index) => (
        <React.Fragment key={phase.id}>
          <motion.div
            className={cn(
              'flex flex-col items-center gap-2',
              index <= currentIndex ? 'opacity-100' : 'opacity-40'
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: index <= currentIndex ? 1 : 0.4, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all',
                completedPhases.has(phase.id)
                  ? 'bg-green-500 border-green-500 text-white'
                  : index === currentIndex
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-muted border-muted-foreground/20'
              )}
            >
              {completedPhases.has(phase.id) ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                phase.icon
              )}
            </div>
            <span className="text-xs font-medium text-center max-w-[80px]">
              {phase.label}
            </span>
          </motion.div>

          {index < phases.length - 1 && (
            <div
              className={cn(
                'w-8 md:w-16 h-1 rounded-full transition-all',
                index < currentIndex
                  ? 'bg-green-500'
                  : 'bg-muted-foreground/20'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function WelcomePhase({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="max-w-2xl mx-auto text-center space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="space-y-4">
        <motion.div
          className="text-6xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          ✨
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Identity Discovery Journey
        </h1>

        <p className="text-xl text-muted-foreground">
          Unlock your unique identity through 10 meaningful challenges
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔓</span>
            <div>
              <h3 className="font-semibold">1. Complete 10 Challenges</h3>
              <p className="text-sm text-muted-foreground">
                Answer reflection prompts about your strengths, values,
                interests, and identity
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🏅</span>
            <div>
              <h3 className="font-semibold">2. Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Unlock stickers, badges, and special elements for each
                challenge
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <h3 className="font-semibold">3. Create Your Canvas</h3>
              <p className="text-sm text-muted-foreground">
                Arrange your unlocked elements into a visual identity collage
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="font-semibold">4. Share Your Journey</h3>
              <p className="text-sm text-muted-foreground">
                Download and share your completed identity canvas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button size="lg" onClick={onStart} className="px-8">
        <Sparkles className="w-5 h-5 mr-2" />
        Begin Your Journey
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );
}

function UnlockPhase() {
  const { state, submitChallengeResponse, startChallenge, completePhase } =
    useIdentityDiscovery();
  const [showReward, setShowReward] = useState<UnlockedElement | null>(null);

  const handleChallengeComplete = (
    challengeId: string,
    response: string,
    imageUrl?: string
  ) => {
    submitChallengeResponse(challengeId, response, imageUrl);

    // Show reward popup
    const challenge = challengesData.challenges.find((c) => c.id === challengeId);
    if (challenge) {
      setShowReward({
        challengeId,
        category: challenge.category as any,
        element: challenge.element,
        response,
        imageUrl,
        rewardType: challenge.rewardType as any,
        rewardName: challenge.rewardName,
        rewardIcon: challenge.rewardIcon,
        unlockedAt: new Date(),
      });
    }
  };

  useEffect(() => {
    if (state.responses.length === 10 && !state.phases.unlock.completed) {
      completePhase('unlock');
    }
  }, [state.responses.length, state.phases.unlock.completed, completePhase]);

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="max-w-2xl mx-auto space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {state.responses.length} / 10 Challenges Completed
          </span>
          <span className="text-sm text-muted-foreground">
            {state.totalPoints} Points
          </span>
        </div>
        <Progress value={(state.responses.length / 10) * 100} />
      </div>

      {/* Badges overview */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Your Rewards Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BadgeGrid>
            {challengesData.challenges.map((challenge) => {
              const isUnlocked = state.unlockedElements.some(
                (e) => e.challengeId === challenge.id
              );
              return (
                <BadgeDisplay
                  key={challenge.id}
                  rewardType={challenge.rewardType as any}
                  rewardName={challenge.rewardName}
                  rewardIcon={challenge.rewardIcon}
                  unlocked={isUnlocked}
                  size="sm"
                  showLabel={true}
                />
              );
            })}
          </BadgeGrid>
        </CardContent>
      </Card>

      {/* Challenges */}
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Unlock Challenges
        </h2>

        <div className="space-y-4">
          {challengesData.challenges.map((challenge) => {
            const isUnlocked = state.unlockedElements.some(
              (e) => e.challengeId === challenge.id
            );
            const isActive = state.currentChallengeId === challenge.id;

            return (
              <UnlockChallengeCard
                key={challenge.id}
                challenge={challenge as any}
                isUnlocked={isUnlocked}
                isActive={isActive}
                onStart={() => startChallenge(challenge.id)}
                onComplete={(response, imageUrl) =>
                  handleChallengeComplete(challenge.id, response, imageUrl)
                }
              />
            );
          })}
        </div>
      </div>

      {/* Reward popup */}
      <AnimatePresence>
        {showReward && (
          <RewardPopup
            rewardType={showReward.rewardType}
            rewardName={showReward.rewardName}
            rewardIcon={showReward.rewardIcon}
            onClose={() => setShowReward(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ComposePhase() {
  const {
    state,
    addCanvasElement,
    updateCanvasElement,
    removeCanvasElement,
    setCanvasBackground,
    goToPhase,
  } = useIdentityDiscovery();

  const handleAddElement = (unlockedElement: UnlockedElement) => {
    // Create canvas element from unlocked element
    const newElement = {
      type: unlockedElement.rewardType === 'textBox' ? 'text' :
            unlockedElement.rewardType === 'imageSlot' ? 'image' :
            unlockedElement.rewardType === 'badge' ? 'badge' : 'sticker',
      content: unlockedElement.rewardType === 'textBox' ? unlockedElement.response : unlockedElement.rewardName,
      imageUrl: unlockedElement.imageUrl,
      icon: unlockedElement.rewardIcon,
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 200 + 100,
      },
      size: { width: 150, height: 150 },
      scale: 1,
      rotation: 0,
      category: unlockedElement.category,
    } as any;

    addCanvasElement(newElement);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Compose Your Identity Canvas</h2>
        <p className="text-muted-foreground">
          Arrange your unlocked elements to create your unique visual identity
        </p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Unlocked elements sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.unlockedElements.map((element) => (
              <motion.div
                key={element.challengeId}
                className="p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleAddElement(element)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{element.rewardIcon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {element.rewardName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click to add
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="min-h-[600px]">
          <CardContent className="p-6 h-full">
            <IdentityCanvas
              elements={state.canvasElements}
              background={state.canvasBackground}
              isEditable={true}
              onElementUpdate={updateCanvasElement}
              onElementRemove={removeCanvasElement}
              onBackgroundChange={setCanvasBackground}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => goToPhase('unlock')}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Challenges
        </Button>
        <Button onClick={() => goToPhase('finalize')}>
          Continue to Finalize
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function FinalizePhase() {
  const { state, finalizeCanvas, exportCanvas, goToPhase } =
    useIdentityDiscovery();
  const router = useRouter();

  const handleFinalize = () => {
    finalizeCanvas();
  };

  const handleExport = async () => {
    const dataUrl = await exportCanvas();
    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'my-identity-canvas.png';
    link.click();
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {!state.completedAt ? (
        <>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Review & Finalize</h2>
            <p className="text-muted-foreground">
              Take a final look at your identity canvas
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="aspect-[4/3] mb-6">
                <IdentityCanvas
                  elements={state.canvasElements}
                  background={state.canvasBackground}
                  isEditable={false}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => goToPhase('compose')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <Button size="lg" onClick={handleFinalize}>
              <Trophy className="w-5 h-5 mr-2" />
              Complete Journey
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold mb-2">
              Congratulations!
            </h2>
            <p className="text-xl text-muted-foreground mb-4">
              You've completed your Identity Discovery Journey
            </p>
            <Badge variant="secondary" className="text-lg px-6 py-2">
              <Trophy className="w-5 h-5 mr-2" />
              Identity Architect - {state.totalPoints} Points
            </Badge>
          </motion.div>

          <Card>
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

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={handleExport}>
              <Download className="w-5 h-5 mr-2" />
              Download Canvas
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/activities')}
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Activities
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function IdentityDiscoveryContent() {
  const { state, startPhase, completePhase } = useIdentityDiscovery();

  const completedPhases = new Set<PhaseType>(
    Object.entries(state.phases)
      .filter(([_, phase]) => phase.completed)
      .map(([key]) => key as PhaseType)
  );

  const handleWelcomeStart = () => {
    completePhase('welcome');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Phase indicator */}
        <PhaseIndicator
          currentPhase={state.currentPhase}
          completedPhases={completedPhases}
        />

        {/* Phase content */}
        <AnimatePresence mode="wait">
          {state.currentPhase === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WelcomePhase onStart={handleWelcomeStart} />
            </motion.div>
          )}

          {state.currentPhase === 'unlock' && (
            <motion.div
              key="unlock"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <UnlockPhase />
            </motion.div>
          )}

          {state.currentPhase === 'compose' && (
            <motion.div
              key="compose"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ComposePhase />
            </motion.div>
          )}

          {state.currentPhase === 'finalize' && (
            <motion.div
              key="finalize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <FinalizePhase />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function IdentityDiscoveryPage() {
  return (
    <IdentityDiscoveryProvider>
      <IdentityDiscoveryContent />
    </IdentityDiscoveryProvider>
  );
}
