'use client';

import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CanvasData, CanvasZone as CanvasZoneType } from '@/types/canvas-builder';
import { CanvasZone } from './canvas-zone';
import { exportToPNG } from '@/lib/export';
import { useShareURL } from '@/hooks/use-share-url';
import { Download, Share2, Copy, Check } from 'lucide-react';
import { useCanvasBuilder } from '@/contexts/canvas-builder-context';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasData: CanvasData;
}

export function PreviewModal({ isOpen, onClose, canvasData }: PreviewModalProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { incrementExportCount } = useCanvasBuilder();
  const { generateURL, copyToClipboard, isCopied } = useShareURL('/activities/canvas-builder');

  const getBackgroundStyle = () => {
    const { background } = canvasData;
    if (background.type === 'gradient') {
      return {
        background: `linear-gradient(${background.gradientDirection || 'to-r'}, ${background.colors.join(', ')})`,
      };
    }
    return {
      backgroundColor: background.colors[0],
    };
  };

  const handleDownloadPNG = async () => {
    if (canvasRef.current) {
      try {
        const filename = `my-career-canvas-${new Date().toISOString().split('T')[0]}.png`;
        await exportToPNG(canvasRef.current, filename);
        incrementExportCount();
      } catch (error) {
        console.error('Failed to export PNG:', error);
      }
    }
  };

  const handleGetShareLink = () => {
    const url = generateURL(canvasData);
    copyToClipboard(url);
  };

  const zones: CanvasZoneType[] = ['strengths', 'passions', 'values', 'goals', 'quote'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Canvas Preview</DialogTitle>
        </DialogHeader>

        <div
          ref={canvasRef}
          className="p-8 rounded-lg"
          style={getBackgroundStyle()}
        >
          {canvasData.studentName && (
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              {canvasData.studentName}&apos;s Career Discovery Canvas
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <CanvasZone
              zone="strengths"
              elements={canvasData.elements.filter((el) => el.zone === 'strengths')}
              onRemoveElement={() => {}}
              isPreview={true}
            />

            {/* Passions */}
            <CanvasZone
              zone="passions"
              elements={canvasData.elements.filter((el) => el.zone === 'passions')}
              onRemoveElement={() => {}}
              isPreview={true}
            />

            {/* Values */}
            <CanvasZone
              zone="values"
              elements={canvasData.elements.filter((el) => el.zone === 'values')}
              onRemoveElement={() => {}}
              isPreview={true}
            />

            {/* Goals */}
            <CanvasZone
              zone="goals"
              elements={canvasData.elements.filter((el) => el.zone === 'goals')}
              onRemoveElement={() => {}}
              isPreview={true}
            />

            {/* Quote - Full Width */}
            <div className="md:col-span-2">
              <CanvasZone
                zone="quote"
                elements={[]}
                onRemoveElement={() => {}}
                quote={canvasData.personalQuote}
                isPreview={true}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Continue Editing
          </Button>
          <Button onClick={handleDownloadPNG} className="gap-2">
            <Download className="h-4 w-4" />
            Download PNG
          </Button>
          <Button onClick={handleGetShareLink} className="gap-2" variant="secondary">
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                Link Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Get Share Link
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
