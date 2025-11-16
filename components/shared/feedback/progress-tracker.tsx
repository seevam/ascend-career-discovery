// components/shared/feedback/progress-tracker.tsx

'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressTrackerProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressTracker({ current, total, label }: ProgressTrackerProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          {label || 'Progress'}
        </span>
        <span className="text-sm text-gray-500">
          {current}/{total}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
