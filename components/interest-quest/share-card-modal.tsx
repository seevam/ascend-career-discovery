'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShareCard } from './share-card';
import { FinalResults } from '@/types/interest-quest';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: FinalResults;
  shareURL: string;
  studentName?: string;
  points?: number;
  level?: number;
}

export function ShareCardModal({
  isOpen,
  onClose,
  results,
  shareURL,
  studentName,
  points,
  level,
}: ShareCardModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Your Results</DialogTitle>
          <DialogDescription>
            Download or share your career discovery results optimized for social media
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          <ShareCard
            results={results}
            shareURL={shareURL}
            studentName={studentName}
            points={points}
            level={level}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
