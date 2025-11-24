'use client';

import React, { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IdentityCanvasProps, CanvasElement } from '@/types/identity-discovery';
import { Trash2, RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function IdentityCanvas({
  elements,
  background,
  isEditable,
  onElementUpdate,
  onElementRemove,
  onBackgroundChange,
}: IdentityCanvasProps) {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (
    elementId: string,
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!onElementUpdate) return;

    const element = elements.find((e) => e.id === elementId);
    if (!element) return;

    const newX = element.position.x + info.offset.x;
    const newY = element.position.y + info.offset.y;

    onElementUpdate(elementId, {
      position: { x: newX, y: newY },
    });
  };

  const handleRotate = (elementId: string) => {
    if (!onElementUpdate) return;

    const element = elements.find((e) => e.id === elementId);
    if (!element) return;

    const newRotation = (element.rotation + 15) % 360;
    onElementUpdate(elementId, { rotation: newRotation });
  };

  const handleScale = (elementId: string, delta: number) => {
    if (!onElementUpdate) return;

    const element = elements.find((e) => e.id === elementId);
    if (!element) return;

    const newScale = Math.max(0.5, Math.min(2, element.scale + delta));
    onElementUpdate(elementId, { scale: newScale });
  };

  const handleDelete = (elementId: string) => {
    if (!onElementRemove) return;
    onElementRemove(elementId);
    setSelectedElementId(null);
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    switch (background.type) {
      case 'color':
        return { backgroundColor: background.value };
      case 'gradient':
        return { backgroundImage: background.value };
      case 'pattern':
        return {
          backgroundImage: background.value,
          backgroundSize: '20px 20px',
        };
      default:
        return { backgroundColor: '#ffffff' };
    }
  };

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElementId === element.id;

    return (
      <motion.div
        key={element.id}
        drag={isEditable}
        dragMomentum={false}
        onDragEnd={(event, info) => handleDragEnd(element.id, event, info)}
        onClick={() => isEditable && setSelectedElementId(element.id)}
        className={cn(
          'absolute cursor-move select-none',
          isSelected && 'z-50'
        )}
        style={{
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          zIndex: isSelected ? 9999 : element.zIndex,
        }}
        animate={{
          scale: element.scale,
          rotate: element.rotation,
        }}
        whileHover={isEditable ? { scale: element.scale * 1.05 } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Element content */}
        <div
          className={cn(
            'w-full h-full flex items-center justify-center rounded-lg transition-all',
            isSelected && isEditable && 'ring-2 ring-primary ring-offset-2'
          )}
        >
          {element.type === 'text' && (
            <div className="p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-lg shadow-lg">
              <p className="text-sm font-medium text-center whitespace-pre-wrap">
                {element.content}
              </p>
            </div>
          )}

          {element.type === 'image' && element.imageUrl && (
            <img
              src={element.imageUrl}
              alt="Canvas element"
              className="w-full h-full object-contain rounded-lg shadow-lg"
            />
          )}

          {element.type === 'badge' && (
            <div className="p-6 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 backdrop-blur rounded-2xl shadow-xl border-2 border-amber-500/30">
              <div className="text-center space-y-2">
                <div className="text-5xl">{element.icon}</div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                  {element.content}
                </p>
              </div>
            </div>
          )}

          {element.type === 'sticker' && (
            <motion.div
              className="text-6xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {element.icon}
            </motion.div>
          )}
        </div>

        {/* Element controls (when selected and editable) */}
        {isSelected && isEditable && (
          <motion.div
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-background border border-border rounded-lg shadow-lg p-1 flex gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleRotate(element.id);
              }}
              className="h-8 w-8"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleScale(element.id, 0.1);
              }}
              className="h-8 w-8"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleScale(element.id, -0.1);
              }}
              className="h-8 w-8"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(element.id);
              }}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="relative w-full h-full">
      {/* Canvas container */}
      <div
        ref={canvasRef}
        className={cn(
          'relative w-full h-full rounded-xl overflow-hidden shadow-2xl border-2 border-border',
          isEditable && 'cursor-crosshair'
        )}
        style={getBackgroundStyle()}
        onClick={() => isEditable && setSelectedElementId(null)}
      >
        {/* Empty state */}
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <Move className="w-16 h-16 mx-auto text-muted-foreground/30" />
              <div className="space-y-2">
                <p className="text-lg font-semibold text-muted-foreground">
                  Your Identity Canvas
                </p>
                <p className="text-sm text-muted-foreground/70">
                  {isEditable
                    ? 'Complete challenges to unlock elements and add them here'
                    : 'No elements on canvas yet'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Render all elements */}
        {elements.map((element) => renderElement(element))}

        {/* Watermark */}
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 select-none">
          Ascend Identity Canvas
        </div>
      </div>

      {/* Background picker (if editable) */}
      {isEditable && onBackgroundChange && (
        <motion.div
          className="absolute -bottom-20 left-0 right-0 bg-background border border-border rounded-lg p-3 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm font-medium whitespace-nowrap">
              Background:
            </span>
            <div className="flex gap-2">
              {/* Gradient options */}
              {[
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
              ].map((gradient, index) => (
                <button
                  key={index}
                  onClick={() =>
                    onBackgroundChange({ type: 'gradient', value: gradient })
                  }
                  className={cn(
                    'w-10 h-10 rounded-lg border-2 transition-all hover:scale-110',
                    background.type === 'gradient' &&
                      background.value === gradient
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-border'
                  )}
                  style={{ backgroundImage: gradient }}
                />
              ))}

              {/* Solid color options */}
              {['#ffffff', '#f3f4f6', '#1f2937', '#fef3c7', '#dbeafe'].map(
                (color, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      onBackgroundChange({ type: 'color', value: color })
                    }
                    className={cn(
                      'w-10 h-10 rounded-lg border-2 transition-all hover:scale-110',
                      background.type === 'color' && background.value === color
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-border'
                    )}
                    style={{ backgroundColor: color }}
                  />
                )
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Helper component for canvas preview (read-only, smaller)
export function CanvasPreview({
  elements,
  background,
  className,
}: {
  elements: CanvasElement[];
  background: IdentityCanvasProps['background'];
  className?: string;
}) {
  return (
    <div className={cn('relative w-full aspect-[4/3]', className)}>
      <IdentityCanvas
        elements={elements}
        background={background}
        isEditable={false}
      />
    </div>
  );
}
