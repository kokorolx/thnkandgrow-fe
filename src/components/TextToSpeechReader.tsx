'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './TextToSpeechReader.module.css';

interface TextToSpeechReaderProps {
  content: string;
}

export default function TextToSpeechReader({ content }: TextToSpeechReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isVoicesLoaded, setIsVoicesLoaded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef<string>('');

  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState<string[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null); // Added this declaration

  // Slider state
  const [sliderValue, setSliderValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        setIsVoicesLoaded(true);

        // Try to find a better default voice (Google, Microsoft, or Natural)
        const preferredVoice = availableVoices.find(
          (voice) =>
            (voice.name.includes('Google') && voice.lang.startsWith('en')) ||
            (voice.name.includes('Natural') && voice.lang.startsWith('en')) ||
            (voice.name.includes('Microsoft') && voice.lang.startsWith('en'))
        );

        if (preferredVoice) {
          setSelectedVoice(preferredVoice);
        } else {
          // Fallback to first English voice
          const englishVoice = availableVoices.find((voice) => voice.lang.startsWith('en'));
          if (englishVoice) {
            setSelectedVoice(englishVoice);
          }
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Helper to split text into chunks
  const chunkText = (text: string): string[] => {
    // Split by sentence endings but keep the punctuation
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const maxChunkLength = 200; // Safe limit for most browsers
    const result: string[] = [];

    let currentChunk = '';

    sentences.forEach(sentence => {
      if (currentChunk.length + sentence.length > maxChunkLength) {
        if (currentChunk) result.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += ' ' + sentence;
      }
    });

    if (currentChunk) result.push(currentChunk.trim());
    return result;
  };

  useEffect(() => {
    // Check browser support
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    // Extract plain text from HTML content using DOMParser
    if (content && typeof window !== 'undefined') {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const text = doc.body.textContent || doc.body.innerText || '';
        // Clean up whitespace
        const cleanText = text.replace(/\s+/g, ' ').trim();
        textRef.current = cleanText;

        // Create chunks
        const textChunks = chunkText(cleanText);
        setChunks(textChunks);
      } catch (e) {
        console.error('Error parsing content for TTS:', e);
        // Fallback
        const temp = document.createElement('div');
        temp.innerHTML = content;
        const text = temp.textContent || temp.innerText || '';
        textRef.current = text;
        setChunks([text]);
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [content]);

  // Sync slider with playback progress when not dragging
  useEffect(() => {
    if (!isDragging && chunks.length > 0) {
      setSliderValue((currentChunkIndex / chunks.length) * 100);
    }
  }, [currentChunkIndex, chunks.length, isDragging]);

  const speakChunk = (index: number) => {
    if (index >= chunks.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentChunkIndex(0);
      currentUtteranceRef.current = null;
      return;
    }

    const chunk = chunks[index];
    const utterance = new SpeechSynthesisUtterance(chunk);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Track this specific utterance
    currentUtteranceRef.current = utterance;

    utterance.onend = () => {
      // Only proceed if this is still the current utterance
      if (currentUtteranceRef.current === utterance) {
        setCurrentChunkIndex(prev => {
          const next = prev + 1;
          if (next < chunks.length && isPlaying) {
             speakChunk(next);
          } else if (next >= chunks.length) {
             setIsPlaying(false);
             setIsPaused(false);
             setCurrentChunkIndex(0);
          }
          return next;
        });
      }
    };

    utterance.onerror = (e) => {
      if (currentUtteranceRef.current === utterance) {
        console.error('TTS Chunk Error:', e);
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (!isSupported || chunks.length === 0) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      // Start fresh
      currentUtteranceRef.current = null; // Ignore any pending events
      window.speechSynthesis.cancel();

      setIsPlaying(true);
      setIsPaused(false);
      speakChunk(currentChunkIndex);
    }
  };

  const handlePause = () => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!isSupported) return;
    currentUtteranceRef.current = null;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(0);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying) {
      currentUtteranceRef.current = null;
      window.speechSynthesis.cancel();
      setTimeout(() => {
        speakChunk(currentChunkIndex);
      }, 50);
    }
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceName = e.target.value;
    const voice = voices.find((v) => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);
      if (isPlaying) {
        currentUtteranceRef.current = null;
        window.speechSynthesis.cancel();
        setTimeout(() => {
          speakChunk(currentChunkIndex);
        }, 50);
      }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseFloat(e.target.value));
    setIsDragging(true);
  };

  const handleSliderCommit = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setIsDragging(false);
    const newPercentage = parseFloat(e.currentTarget.value);
    const newIndex = Math.floor((newPercentage / 100) * chunks.length);

    if (newIndex !== currentChunkIndex) {
      setCurrentChunkIndex(newIndex);
      if (isPlaying) {
        currentUtteranceRef.current = null;
        window.speechSynthesis.cancel();
        setTimeout(() => {
          speakChunk(newIndex);
        }, 50);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className={styles.unsupported}>
        <p>Text-to-speech is not supported in your browser.</p>
      </div>
    );
  }

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];



  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.mainControls}>
          <div className={styles.playControls}>
            {!isPlaying && !isPaused ? (
              <button
                onClick={handlePlay}
                className={styles.playButton}
                aria-label="Play"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
                <span>Listen to Article</span>
              </button>
            ) : (
              <>
                {isPlaying ? (
                  <button
                    onClick={handlePause}
                    className={styles.controlButton}
                    aria-label="Pause"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handlePlay}
                    className={styles.controlButton}
                    aria-label="Resume"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={handleStop}
                  className={styles.controlButton}
                  aria-label="Stop"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="6" width="12" height="12" fill="currentColor" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {isVoicesLoaded && voices.length > 0 && (
            <div className={styles.voiceSelectWrapper}>
              <select
                className={styles.voiceSelect}
                value={selectedVoice?.name || ''}
                onChange={handleVoiceChange}
                aria-label="Select Voice"
              >
                {voices
                  .filter((v) => v.lang.startsWith('en'))
                  .map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name.replace(/Microsoft |Google |English /g, '')}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {(isPlaying || isPaused) && (
          <div className={styles.secondaryControls}>
            <div className={styles.progressContainer}>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                onMouseUp={handleSliderCommit}
                onTouchEnd={handleSliderCommit}
                className={styles.progressBar}
                aria-label="Reading Progress"
                style={{ backgroundSize: `${sliderValue}% 100%` }}
              />
              <div className={styles.timeLabels}>
                <span>{Math.round(sliderValue)}%</span>
              </div>
            </div>

            <div className={styles.speedControl}>
              <label htmlFor="speed">Speed:</label>
              <div className={styles.speedButtons}>
                {speedOptions.map((speedOption) => (
                  <button
                    key={speedOption}
                    onClick={() => handleSpeedChange(speedOption)}
                    className={`${styles.speedButton} ${speed === speedOption ? styles.active : ''}`}
                    aria-label={`${speedOption}x speed`}
                  >
                    {speedOption}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
