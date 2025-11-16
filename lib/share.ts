// lib/share.ts

import LZString from 'lz-string';

export function generateShareURL(
  activityPath: string,
  data: any
): string {
  const compressed = LZString.compressToEncodedURIComponent(
    JSON.stringify(data)
  );

  const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseURL}${activityPath}/view?data=${compressed}`;
}

export function decodeShareURL(encodedData: string): any {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
    if (!decompressed) throw new Error('Invalid data');
    return JSON.parse(decompressed);
  } catch (error) {
    console.error('Failed to decode share URL:', error);
    return null;
  }
}
