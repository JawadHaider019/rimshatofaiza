'use client';

import React, { useState, useEffect } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in effect
    setTimeout(() => setOpacity(1), 500);
  }, []);

  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center z-30 cursor-pointer"
      onClick={onStart}
      style={{ opacity, transition: 'opacity 2s ease-in-out' }}
    >
      <div className="text-center space-y-4 sm:space-y-6 p-4 max-w-4xl mx-auto">
        <h1 className="font-urdu text-white text-4xl sm:text-6xl md:text-7xl drop-shadow-2xl animate-pulse leading-normal">
          سالگرہ مبارک
        </h1>
        {/* Updated Name */}
        <h1 className="font-urdu text-yellow-400 text-5xl sm:text-7xl md:text-8xl drop-shadow-2xl mt-4 leading-normal">
          فائزہ جانِ من
        </h1>
        
        <h2 className="font-cinematic text-white/80 text-lg sm:text-xl tracking-[0.3em] uppercase mt-8">
          Happy Birthday Faiza Janeman
        </h2>

        {/* Intro Quote */}
        <p className="font-urdu text-white/90 text-2xl sm:text-3xl mt-12 leading-relaxed px-4">
          سلام ہو اُن پر جو دوستی کے عہد پر قائم رہے اور وقت نے اُنہیں نہیں بدلا
        </p>

        <div className="mt-16 opacity-50 animate-bounce">
           <span className="font-cinematic text-xs text-white tracking-widest border-b border-white/30 pb-1">Tap to Open</span>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;