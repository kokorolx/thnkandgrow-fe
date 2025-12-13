'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './ImageWithFallback.module.css';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  objectPosition?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fallback = '/images/placeholder.svg',
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  objectFit = 'cover',
  objectPosition = 'center',
}: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    setImageSrc(fallback);
    setIsLoading(false);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className={`${styles.imageWrapper} ${hasError ? styles.fallback : ''}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={className}
        onError={handleError}
        onLoadingComplete={handleLoadingComplete}
        style={{
          objectFit,
          objectPosition,
        }}
      />
      {isLoading && (
        <div className={styles.skeleton} />
      )}
    </div>
  );
}
