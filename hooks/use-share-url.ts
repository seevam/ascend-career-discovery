// hooks/use-share-url.ts

import { useState } from 'react';
import { generateShareURL } from '@/lib/share';

export function useShareURL(activityPath: string) {
  const [shareURL, setShareURL] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const generateURL = (data: any): string => {
    const url = generateShareURL(activityPath, data);
    setShareURL(url);
    return url;
  };

  const copyToClipboard = async (url?: string) => {
    const urlToCopy = url || shareURL;

    try {
      await navigator.clipboard.writeText(urlToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return {
    shareURL,
    generateURL,
    copyToClipboard,
    isCopied
  };
}
