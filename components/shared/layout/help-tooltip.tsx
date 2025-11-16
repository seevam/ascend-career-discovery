// components/shared/layout/help-tooltip.tsx

'use client';

import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function HelpTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="text-gray-500 hover:text-gray-700">
            <HelpCircle className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">Need help? Your progress is automatically saved.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
