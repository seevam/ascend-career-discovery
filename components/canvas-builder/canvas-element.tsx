'use client';

import React, { useState } from 'react';
import { CanvasElement as CanvasElementType } from '@/types/canvas-builder';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasElementProps {
  element: CanvasElementType;
  onRemove: (id: string) => void;
  isPreview?: boolean;
}

export function CanvasElement({ element, onRemove, isPreview = false }: CanvasElementProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(element.id);
  };

  return (
    <div
      className="relative inline-flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="bg-white rounded-lg shadow-md p-3 transition-all hover:shadow-lg"
        style={{
          opacity: element.style.opacity || 1,
          backgroundColor: element.style.backgroundColor || '#ffffff',
          borderRadius: `${element.style.borderRadius || 8}px`,
        }}
      >
        {element.type === 'icon' && (
          <span className="text-4xl">{element.content}</span>
        )}
        {element.type === 'text' && (
          <span
            style={{
              color: element.style.color || '#000000',
              fontSize: `${element.style.fontSize || 16}px`,
              fontFamily: element.style.fontFamily || 'inherit',
              fontWeight: element.style.fontWeight || 'normal',
            }}
          >
            {element.content}
          </span>
        )}
      </div>

      {!isPreview && isHovered && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
          onClick={handleRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
