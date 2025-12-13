'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './ShareButtons.module.css';

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(typeof window !== 'undefined' ? window.location.href : '');
  }, []);

  const handleCopyLink = () => {
    if (url) {
      navigator.clipboard.writeText(url);
    }
  };

  // Don't render if URL isn't loaded yet (hydration mismatch prevention)
  if (!url) {
    return null;
  }

  return (
    <div className={styles.socialShare}>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} className={styles.shareButton} title="Share on Facebook" target="_blank" rel="noopener noreferrer">
        <Image
          src="/icons/facebook.svg"
          alt="Share on Facebook"
          width={20}
          height={20}
        />
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`} className={styles.shareButton} title="Share on X" target="_blank" rel="noopener noreferrer">
        <Image
          src="/icons/twitter.svg"
          alt="Share on X"
          width={20}
          height={20}
        />
      </a>
      <a href={`mailto:?subject=${title}&body=${url}`} className={styles.shareButton} title="Share via Email">
        <Image
          src="/icons/email.svg"
          alt="Share via Email"
          width={20}
          height={20}
        />
      </a>
      <button className={styles.shareButton} title="Copy link" onClick={handleCopyLink}>
        <Image
          src="/icons/link.svg"
          alt="Copy link"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
