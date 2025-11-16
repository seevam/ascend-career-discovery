// types/canvas-builder.ts

export type CanvasZone =
  | 'strengths'
  | 'passions'
  | 'values'
  | 'goals'
  | 'quote'
  | 'free';

export type ElementType = 'icon' | 'text' | 'shape' | 'image';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  zone: CanvasZone;
  position: Position;
  size: Size;
  rotation: number; // degrees
  content: string; // icon name, text content, or image URL
  style: ElementStyle;
  zIndex: number;
}

export interface ElementStyle {
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  opacity?: number;
  backgroundColor?: string;
  borderRadius?: number;
}

export interface BackgroundSettings {
  type: 'solid' | 'gradient' | 'pattern';
  colors: string[];
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl';
  pattern?: string;
}

export interface CanvasData {
  sessionId: string;
  studentName?: string;
  createdAt: Date;
  updatedAt: Date;
  elements: CanvasElement[];
  background: BackgroundSettings;
  personalQuote: string;
  metadata: CanvasMetadata;
}

export interface CanvasMetadata {
  version: string;
  completionTime: number; // seconds spent
  zonesCompleted: CanvasZone[];
  exportCount: number;
}

export interface StoredCanvasData {
  data: CanvasData;
  version: string;
  expiry: number;
}

export interface AssetIcon {
  id: string;
  name: string;
  path?: string;
  emoji?: string;
}

export interface AssetCategory {
  name: string;
  description: string;
  icons?: AssetIcon[];
  presets?: string[];
}

export interface BackgroundPreset {
  id: string;
  name: string;
  type: 'solid' | 'gradient' | 'pattern';
  colors: string[];
  direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl';
}

export interface CanvasAssets {
  version: string;
  assetCategories: {
    strengths: AssetCategory;
    passions: AssetCategory;
    values: AssetCategory;
    goals: AssetCategory;
    backgrounds: {
      name: string;
      presets: BackgroundPreset[];
    };
  };
}
