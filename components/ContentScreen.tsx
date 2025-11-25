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

  // Reset states when data changes or screen becomes inactive
  useEffect(() => {
    if (isActive) {
      setQ1Complete(false);
      setShouldExit(false);
      const timer = setTimeout(() => setMountAnim(true), 50);
      return () => clearTimeout(timer);
    } else {
      setMountAnim(false);
    }
  }, [isActive, data]);

  const handleQ1Complete = () => {
    if (isActive && !shouldExit) {
      setQ1Complete(true);
    }
  };

  const handleQ2Complete = () => {
    if (isActive && !shouldExit) {
      setTimeout(() => {
        setShouldExit(true);
        setTimeout(onNext, 1200);
      }, 2000);
    }
  };

  const baseClasses = "absolute inset-0 transition-all duration-[1200ms] ease-in-out";
  let animClasses = "opacity-0 scale-105";
  
  if (mountAnim && !shouldExit) {
    animClasses = "opacity-100 scale-100";
  } else if (shouldExit) {
    animClasses = "opacity-0 scale-95";
  }

  if (!isActive && !shouldExit) {
    return null;
  }

  return (
    <div className={`${baseClasses} ${animClasses}`}>
      {/* Quote 1: Top Right */}
      <TypingQuote 
        text={data.quote1} 
        position="top-right" 
        delayStart={300}
        onComplete={handleQ1Complete}
      />
      
      {/* Quote 2: Bottom Left - Starts strictly after Q1 is complete */}
      {q1Complete && (
        <TypingQuote 
          text={data.quote2} 
          position="bottom-left" 
          delayStart={200}
          onComplete={handleQ2Complete}
        />
      )}
    </div>
  );
};

export default ContentScreen;