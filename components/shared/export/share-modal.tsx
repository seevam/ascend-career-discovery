// components/shared/export/share-modal.tsx

'use client';

import { useState } from 'react';
import { Share, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ShareModalProps {
  shareURL: string;
  onGenerateURL: () => void;
}

export default function ShareModal({ shareURL, onGenerateURL }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && !shareURL) {
      onGenerateURL();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Share className="w-4 h-4 mr-2" />
          Share with Mentor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Results</DialogTitle>
          <DialogDescription>
            Share this link with your mentor or teacher to show your results.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={shareURL}
              readOnly
              className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm"
            />
            <Button onClick={handleCopy} variant="outline">
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            This link will work indefinitely and contains your results data.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
