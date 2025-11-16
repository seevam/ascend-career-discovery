'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CanvasAssets, BackgroundPreset, CanvasZone } from '@/types/canvas-builder';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import canvasAssetsData from '@/data/canvas-assets.json';

interface AssetLibraryProps {
  onAddIcon: (zone: CanvasZone, emoji: string, name: string) => void;
  onAddValue: (value: string) => void;
  onSelectBackground: (background: BackgroundPreset) => void;
}

export function AssetLibrary({
  onAddIcon,
  onAddValue,
  onSelectBackground,
}: AssetLibraryProps) {
  const assets = canvasAssetsData as CanvasAssets;
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'strengths',
    'passions',
    'values',
    'goals',
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const isExpanded = (section: string) => expandedSections.includes(section);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Asset Library</h2>

        {/* Strengths Section */}
        <div className="mb-4">
          <button
            className="flex items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('strengths')}
          >
            <span className="font-semibold text-gray-700">
              {assets.assetCategories.strengths.name}
            </span>
            {isExpanded('strengths') ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
          {isExpanded('strengths') && (
            <div className="mt-2 p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                {assets.assetCategories.strengths.description}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {assets.assetCategories.strengths.icons?.filter(icon => icon.emoji).map((icon) => (
                  <Button
                    key={icon.id}
                    variant="outline"
                    className="h-auto flex flex-col items-center p-3 hover:bg-blue-50"
                    onClick={() => onAddIcon('strengths', icon.emoji!, icon.name)}
                  >
                    <span className="text-3xl mb-1">{icon.emoji}</span>
                    <span className="text-xs text-center">{icon.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Passions Section */}
        <div className="mb-4">
          <button
            className="flex items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('passions')}
          >
            <span className="font-semibold text-gray-700">
              {assets.assetCategories.passions.name}
            </span>
            {isExpanded('passions') ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
          {isExpanded('passions') && (
            <div className="mt-2 p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                {assets.assetCategories.passions.description}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {assets.assetCategories.passions.icons?.filter(icon => icon.emoji).map((icon) => (
                  <Button
                    key={icon.id}
                    variant="outline"
                    className="h-auto flex flex-col items-center p-3 hover:bg-blue-50"
                    onClick={() => onAddIcon('passions', icon.emoji!, icon.name)}
                  >
                    <span className="text-3xl mb-1">{icon.emoji}</span>
                    <span className="text-xs text-center">{icon.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Values Section */}
        <div className="mb-4">
          <button
            className="flex items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('values')}
          >
            <span className="font-semibold text-gray-700">
              {assets.assetCategories.values.name}
            </span>
            {isExpanded('values') ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
          {isExpanded('values') && (
            <div className="mt-2 p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                {assets.assetCategories.values.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {assets.assetCategories.values.presets?.map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => onAddValue(preset)}
                    className="hover:bg-blue-50"
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Goals Section */}
        <div className="mb-4">
          <button
            className="flex items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('goals')}
          >
            <span className="font-semibold text-gray-700">
              {assets.assetCategories.goals.name}
            </span>
            {isExpanded('goals') ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
          {isExpanded('goals') && (
            <div className="mt-2 p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                {assets.assetCategories.goals.description}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {assets.assetCategories.goals.icons?.filter(icon => icon.emoji).map((icon) => (
                  <Button
                    key={icon.id}
                    variant="outline"
                    className="h-auto flex flex-col items-center p-3 hover:bg-blue-50"
                    onClick={() => onAddIcon('goals', icon.emoji!, icon.name)}
                  >
                    <span className="text-3xl mb-1">{icon.emoji}</span>
                    <span className="text-xs text-center">{icon.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Backgrounds Section */}
        <div className="mb-4">
          <button
            className="flex items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('backgrounds')}
          >
            <span className="font-semibold text-gray-700">
              {assets.assetCategories.backgrounds.name}
            </span>
            {isExpanded('backgrounds') ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
          {isExpanded('backgrounds') && (
            <div className="mt-2 p-3 bg-white rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                {assets.assetCategories.backgrounds.presets.map((preset) => (
                  <button
                    key={preset.id}
                    className="h-16 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors overflow-hidden"
                    onClick={() => onSelectBackground(preset)}
                    style={{
                      background:
                        preset.type === 'gradient'
                          ? `linear-gradient(${preset.direction || 'to-r'}, ${preset.colors.join(', ')})`
                          : preset.colors[0],
                    }}
                    title={preset.name}
                  >
                    <span className="sr-only">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
