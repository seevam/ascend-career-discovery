// components/shared/export/download-button.tsx

'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

export default function DownloadButton({
  onClick,
  label = 'Download PDF',
  disabled = false
}: DownloadButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled}>
      <Download className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
