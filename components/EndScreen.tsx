'use client';

import React, { useState, useEffect } from 'react';
import { QuotePair } from '../types';

interface EndScreenProps {
  quotePairs: QuotePair[];
  onReplay: () => void;
  images: string[];
  customImages: Record<number, string>;
}

const EndScreen: React.FC<EndScreenProps> = ({ quotePairs, onReplay, images, customImages }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Flatten all quotes into a single list
  const allQuotes = quotePairs.flatMap(pair => [pair.quote1, pair.quote2]);

  const poemLines = [
    "اگر میں تم پہ کچھ لکھتی ؟",
    "تمہیں میں کل جہاں لکھتی چمن لکھتی ، گھٹا لکھتی ؟",
    "تمہیں میں آسماں لکھتی ؟",
    "صبح لکھتی میں شاموں کی تمہیں کوئی سنہر اساسماں لکھتی ؟",
    "ستارہ تم کو لکھتی ہیں ؟",
    "تمہی کو کہکشاں لکھتی؟",
    "بھلا کے ساری دنیا کو تمہیں میں من کی چاہ لکھتی ؟"
  ];

  useEffect(() => {
    // Image slideshow interval
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Get current image source (custom or default)
  const getCurrentImageSrc = () => {
    const imageIndex = currentImageIndex + 1; // +1 because images array starts from index 1
    return customImages[imageIndex] || images[currentImageIndex];
  };

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center overflow-hidden">
      
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 z-0">
        <img 
          src={getCurrentImageSrc()}
          alt={`Memory ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-500 ${fade ? 'opacity-40' : 'opacity-0'}`}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
        
      {/* Moving Credits Container - EXACT SAME ANIMATION */}
      <div className="w-full max-w-2xl px-6 text-center animate-credits pb-32 relative z-10">
        
        <div className="mb-24 space-y-4">
            <h1 className="font-urdu text-4xl sm:text-6xl text-white mb-2">سالگرہ مبارک</h1>
        </div>

        <div className="space-y-24">
            {allQuotes.map((quote, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-4">
                <p className="font-urdu text-2xl sm:text-4xl text-white/90 leading-loose">
                {quote}
                </p>
                <div className="w-12 h-px bg-white/20" />
            </div>
            ))}

            {/* Special Poem Section */}
            <div className="pt-12 pb-12 space-y-8">
               <div className="w-full h-px bg-yellow-400/50 mb-8" />
               {poemLines.map((line, idx) => (
                   <p key={`poem-${idx}`} className="font-urdu text-2xl sm:text-4xl text-white/95 leading-loose">
                       {line}
                   </p>
               ))}
               <div className="w-full h-px bg-yellow-400/50 mt-8" />
            </div>

            {/* Updated Credit */}
            <div className="flex flex-col items-center space-y-4 pt-12">
                 <p className="font-urdu text-4xl sm:text-6xl text-yellow-400 leading-relaxed">
                   پیشکش: ریشم کی گڑیا
                 </p>
                 <p className="font-cinematic text-white/50 text-xs tracking-widest uppercase pt-10">
                    Credit: Resham ki Guria
                 </p>
            </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes credits {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-20%); }
        }
        .animate-credits {
          animation: credits 100s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default EndScreen;