import { nanoid } from 'nanoid';

// Function to generate a shortened URL
export function shortenUrl(originalUrl, length = 7) {
  // Generate a unique ID using nanoid
  const shortId = nanoid(length);
  
  return {
    originalUrl: originalUrl,
    shortId: shortId,
    shortenedUrl: `https://short.url/${shortId}`,
    createdAt: new Date()
  };
}