'use client';

import dynamic from 'next/dynamic';

const TextToSpeechReader = dynamic(() => import('@/components/TextToSpeechReader'), {
  ssr: false,
});

export function TextToSpeechWrapper({ content }: { content: string }) {
  return <TextToSpeechReader content={content} />;
}
