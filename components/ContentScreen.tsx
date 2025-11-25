'use client';

import React, { useEffect, useState } from 'react';
import TypingQuote from './TypingQuotue';
import { QuotePair } from '../types';

interface ContentScreenProps {
  data: QuotePair;
  onNext: () => void;
  isActive: boolean;
}

const ContentScreen: React.FC<ContentScreenProps> = ({ data, onNext, isActive }) => {
  const [q1Complete, setQ1Complete] = useState(false);
  const [shouldExit, setShouldExit] = useState(false);
  const [mountAnim, setMountAnim] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    // Small delay to allow DOM to paint initial state
    const timer = setTimeout(() => setMountAnim(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // If page becomes inactive, reset logic if needed, or handle transition out
  useEffect(() => {
    if (!isActive) {
      setQ1Complete(false);
      setShouldExit(false);
      setMountAnim(false);
    }
  }, [isActive]);

  const handleQ1Complete = () => {
    setQ1Complete(true);
  };

  const handleQ2Complete = () => {
    // Wait a bit after the second quote finishes before transitioning
    setTimeout(() => {
        setShouldExit(true);
        setTimeout(onNext, 1200); // Wait for transition animation to finish
    }, 4000);
  };

  // Animation classes
  // Start: Scale 1.05, Opacity 0 (Zoomed in slightly, hidden)
  // Active: Scale 1.0, Opacity 100 (Normal size, visible) -> This creates a subtle "settling" zoom-out effect on enter? 
  // actually request was zoom-out/zoom-in. 
  // Let's do: Start at 1.05 -> go to 1.0 (Entrance). 
  // Exit: Go to 0.95 (Zoom out further away).
  
  const baseClasses = "absolute inset-0 transition-all duration-[1200ms] ease-in-out";
  let animClasses = "opacity-0 scale-105"; // Initial state
  
  if (mountAnim && !shouldExit) {
      animClasses = "opacity-100 scale-100"; // Active state
  } else if (shouldExit) {
      animClasses = "opacity-0 scale-95"; // Exit state
  }

  return (
    <div className={`${baseClasses} ${animClasses}`}>
      {/* Quote 1: Top Right */}
      <TypingQuote 
        text={data.quote1} 
        position="top-right" 
        delayStart={1200} // Wait for entrance anim
        onComplete={handleQ1Complete}
      />
      
      {/* Quote 2: Bottom Left - Starts strictly after Q1 is complete */}
      {q1Complete && (
        <TypingQuote 
          text={data.quote2} 
          position="bottom-left" 
          delayStart={500} // Small pause before starting the second quote
          onComplete={handleQ2Complete}
        />
      )}
    </div>
  );
};

export default ContentScreen;