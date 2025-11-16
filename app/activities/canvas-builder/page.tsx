'use client';

import React, { useState } from 'react';
import { CanvasBuilderProvider, useCanvasBuilder } from '@/contexts/canvas-builder-context';
import { AssetLibrary } from '@/components/canvas-builder/asset-library';
import { CanvasZone } from '@/components/canvas-builder/canvas-zone';
import { PreviewModal } from '@/components/canvas-builder/preview-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CanvasZone as CanvasZoneType,
  BackgroundPreset,
  ElementType,
} from '@/types/canvas-builder';
import { Eye, Download, Trash2, Menu, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function CanvasBuilderContent() {
  const {
    canvasData,
    addElement,
    removeElement,
    setBackground,
    setPersonalQuote,
    setStudentName,
    clearCanvas,
    lastSaved,
    markZoneCompleted,
  } = useCanvasBuilder();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleAddIcon = (zone: CanvasZoneType, emoji: string, name: string) => {
    addElement({
      type: 'icon',
      zone,
      position: { x: 0, y: 0 },
      size: { width: 48, height: 48 },
      rotation: 0,
      content: emoji,
      style: {},
      zIndex: 1,
    });
    markZoneCompleted(zone);
  };

  const handleAddValue = (value: string) => {
    addElement({
      type: 'text',
      zone: 'values',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 30 },
      rotation: 0,
      content: value,
      style: {
        fontSize: 16,
        color: '#1f2937',
      },
      zIndex: 1,
    });
    markZoneCompleted('values');
  };

  const handleSelectBackground = (preset: BackgroundPreset) => {
    setBackground({
      type: preset.type,
      colors: preset.colors,
      gradientDirection: preset.direction,
    });
  };

  const handleClearCanvas = () => {
    if (showClearConfirm) {
      clearCanvas();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

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

  const zones: CanvasZoneType[] = ['strengths', 'passions', 'values', 'goals', 'quote'];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Career Discovery Canvas
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-sm text-gray-500 hidden sm:inline">
                  Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(true)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearCanvas}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {showClearConfirm ? 'Click Again to Confirm' : 'Clear'}
                </span>
              </Button>
            </div>
          </div>

          {/* Student Name Input */}
          <div className="mt-3">
            <input
              type="text"
              placeholder="Enter your name (optional)"
              value={canvasData.studentName || ''}
              onChange={(e) => setStudentName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Asset Library */}
        <aside
          className={`${
            isSidebarOpen ? 'block' : 'hidden'
          } md:block w-full md:w-80 flex-shrink-0 overflow-y-auto absolute md:relative z-10 h-full md:h-auto bg-white md:bg-transparent`}
        >
          <AssetLibrary
            onAddIcon={handleAddIcon}
            onAddValue={handleAddValue}
            onSelectBackground={handleSelectBackground}
          />
        </aside>

        {/* Canvas Workspace */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div
            className="max-w-6xl mx-auto p-6 md:p-8 rounded-lg shadow-lg min-h-[800px]"
            style={getBackgroundStyle()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <CanvasZone
                zone="strengths"
                elements={canvasData.elements.filter((el) => el.zone === 'strengths')}
                onRemoveElement={removeElement}
              />

              {/* Passions */}
              <CanvasZone
                zone="passions"
                elements={canvasData.elements.filter((el) => el.zone === 'passions')}
                onRemoveElement={removeElement}
              />

              {/* Values */}
              <CanvasZone
                zone="values"
                elements={canvasData.elements.filter((el) => el.zone === 'values')}
                onRemoveElement={removeElement}
                onAddValue={handleAddValue}
              />

              {/* Goals */}
              <CanvasZone
                zone="goals"
                elements={canvasData.elements.filter((el) => el.zone === 'goals')}
                onRemoveElement={removeElement}
              />

              {/* Quote - Full Width */}
              <div className="md:col-span-2">
                <CanvasZone
                  zone="quote"
                  elements={[]}
                  onRemoveElement={removeElement}
                  onUpdateQuote={setPersonalQuote}
                  quote={canvasData.personalQuote}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        canvasData={canvasData}
      />
    </div>
  );
}

export default function CanvasBuilderPage() {
  return (
    <CanvasBuilderProvider>
      <CanvasBuilderContent />
    </CanvasBuilderProvider>
  );
}
