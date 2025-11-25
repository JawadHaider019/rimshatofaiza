'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { StyledWord } from '../types';

interface TypingQuoteProps {
  text: string;
  position: 'top-right' | 'bottom-left';
  delayStart?: number; // Delay in ms before typing starts
  className?: string;
  onComplete?: () => void;
}

const COLORS = [
  'text-white',
  'text-yellow-400',
  'text-red-500',
  'text-cyan-400',
  'text-lime-400',
];

const TypingQuote: React.FC<TypingQuoteProps> = ({ text, position, delayStart = 0, className = '', onComplete }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Check for Urdu characters
  const isUrdu = /[\u0600-\u06FF]/.test(text);

  // Pre-process text into words, respecting newlines
  const words: StyledWord[] = useMemo(() => {
    // Split by newlines first to preserve line breaks
    const lines = text.split('\n');
    const processedWords: StyledWord[] = [];
    
    lines.forEach((line) => {
      const lineWords = line.split(/\s+/).filter(w => w.length > 0);
      lineWords.forEach((word, wordIndex) => {
         const colorIndex = (processedWords.length + word.length) % COLORS.length;
         processedWords.push({
           text: word,
           color: COLORS[colorIndex],
           id: `word-${processedWords.length}-${word}`,
           isNewLine: wordIndex === 0 && processedWords.length > 0 // Mark first word of new line (except very first word)
         });
      });
      // We don't explicitly store "newline" objects, but we can infer line breaks visually via CSS flex w-full
      // OR we insert a break marker. A cleaner way for flex layout is to check `isNewLine` during render.
    });
    return processedWords;
  }, [text]);

  // Reset if text changes
  useEffect(() => {
    setVisibleCount(0);
  }, [text]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    // Initial delay before starting the typing sequence
    timeoutId = setTimeout(() => {
      // Word appearance interval
      intervalId = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev < words.length) {
            return prev + 1;
          }
          clearInterval(intervalId);
          if (onComplete) {
            // Small buffer after last word before triggering complete
            setTimeout(onComplete, 800); 
          }
          return prev;
        });
      }, 400); // 400ms per word
    }, delayStart);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [words.length, delayStart, onComplete]);

  // Auto-scroll logic if content grows
  useEffect(() => {
     if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
     }
  }, [visibleCount]);

  // Determine alignment classes based on position and language direction
  let justifyClass = '';
  if (position === 'top-right') {
    justifyClass = isUrdu ? 'justify-start' : 'justify-end';
  } else {
    justifyClass = isUrdu ? 'justify-end' : 'justify-start';
  }

  const textAlignClass = position === 'top-right' ? 'text-right' : 'text-left';

  // Responsive positioning and width constraints
  // Increased max-width to prevent unnecessary wrapping
  const containerClasses = position === 'top-right'
    ? 'top-10 right-0 pr-4 sm:pr-8 sm:top-10 sm:right-0 md:top-12 lg:top-16 items-end'
    : 'bottom-10 left-0 pl-4 sm:pl-8 sm:bottom-10 sm:left-0 md:bottom-12 lg:bottom-16 items-start';

  // Wider containers to accommodate longer lines
  const widthClasses = 'w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%]';
  const maxHeightClasses = 'max-h-[45vh] overflow-y-auto no-scrollbar';

  // Adjusted Granular responsive font sizes
  const fontClass = isUrdu 
    ? 'font-urdu text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.8] sm:leading-[2.0]' 
    : 'font-cinematic text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl italic tracking-wide leading-relaxed';

  return (
    <div 
      ref={containerRef}
      className={`absolute ${widthClasses} ${maxHeightClasses} flex flex-col pointer-events-none z-10 ${containerClasses} ${textAlignClass} ${className}`}
      dir={isUrdu ? 'rtl' : 'ltr'}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className={`flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 sm:gap-y-2 ${justifyClass}`}>
        {words.map((word, index) => (
          <React.Fragment key={word.id}>
             {/* Force line break if original text had a newline here */}
             {word.isNewLine && <div className="basis-full h-0" />}
             
             <span
                className={`
                  transition-opacity duration-700 ease-out
                  ${fontClass}
                  ${word.color}
                  ${index < visibleCount ? 'opacity-100' : 'opacity-0'}
                `}
              >
                {word.text}
              </span>
          </React.Fragment>
        ))}
        {/* Invisible anchor for scrolling */}
        <div ref={bottomRef} className="w-full h-px opacity-0" />
      </div>
    </div>
  );
};

export default TypingQuote;