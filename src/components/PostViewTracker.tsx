'use client';

import { useEffect } from 'react';

interface PostViewTrackerProps {
  postId: string;
}

export default function PostViewTracker({ postId }: PostViewTrackerProps) {
  useEffect(() => {
    // Track view after a short delay to ensure the user is actually reading
    const timer = setTimeout(() => {
      fetch('/api/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      }).catch((error) => {
        // Silently fail - view tracking shouldn't break the page
        console.error('Failed to track post view:', error);
      });
    }, 3000); // 3 second delay to ensure genuine read

    return () => clearTimeout(timer);
  }, [postId]);

  // This component doesn't render anything
  return null;
}
