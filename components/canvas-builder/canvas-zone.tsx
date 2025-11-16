'use client';

import React, { useState } from 'react';
import { CanvasZone as CanvasZoneType, CanvasElement as CanvasElementType } from '@/types/canvas-builder';
import { CanvasElement } from './canvas-element';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CanvasZoneProps {
  zone: CanvasZoneType;
  elements: CanvasElementType[];
  onRemoveElement: (id: string) => void;
  onUpdateQuote?: (quote: string) => void;
  onAddValue?: (value: string) => void;
  quote?: string;
  isPreview?: boolean;
}

const ZONE_LABELS: Record<CanvasZoneType, string> = {
  strengths: 'My Strengths',
  passions: 'My Passions',
  values: 'My Values',
  goals: 'My Goals',
  quote: 'My Personal Quote',
  free: 'Free Space',
};

export function CanvasZone({
  zone,
  elements,
  onRemoveElement,
  onUpdateQuote,
  onAddValue,
  quote = '',
  isPreview = false,
}: CanvasZoneProps) {
  const [newValue, setNewValue] = useState('');
  const [isAddingValue, setIsAddingValue] = useState(false);

  const handleAddValue = () => {
    if (newValue.trim() && onAddValue) {
      onAddValue(newValue.trim());
      setNewValue('');
      setIsAddingValue(false);
    }
  };

  return (
    <div className="h-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">
        {ZONE_LABELS[zone]}
      </h3>

      <div className="space-y-2">
        {zone === 'quote' ? (
          <div className="h-full">
            {isPreview ? (
              <p className="text-gray-800 italic text-center py-4">
                {quote || 'No quote added yet'}
              </p>
            ) : (
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your personal quote or motto..."
                value={quote}
                onChange={(e) => onUpdateQuote?.(e.target.value)}
              />
            )}
          </div>
        ) : zone === 'values' ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {elements.map((element) => (
                <CanvasElement
                  key={element.id}
                  element={element}
                  onRemove={onRemoveElement}
                  isPreview={isPreview}
                />
              ))}
            </div>
            {!isPreview && (
              <div className="mt-2">
                {isAddingValue ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter a value..."
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddValue()}
                      autoFocus
                    />
                    <Button onClick={handleAddValue} size="sm">
                      Add
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingValue(false);
                        setNewValue('');
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsAddingValue(true)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Value
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 min-h-[100px]">
            {elements.length === 0 && !isPreview && (
              <p className="text-gray-400 text-sm">
                Click icons from the library to add them here
              </p>
            )}
            {elements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                onRemove={onRemoveElement}
                isPreview={isPreview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
