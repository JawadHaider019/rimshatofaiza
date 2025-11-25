
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { generateCinematicQuotes } from '../services/geminiService';
import StartScreen from '../components/StartScreen';
import ContentScreen from '../components/ContentScreen';
import EndScreen from '../components/EndScreen';
import { BirthdayData } from '../types';

// Default Paths (Expects files in public/ folder)
// Note: In Next.js, files in 'public' are accessed from the root with a leading slash.
const DEFAULT_IMAGES = [
   "/start.jpeg",
  "/1.jpeg",
  "/2.jpeg",
  "/3.jpeg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpeg",
  "/7.jpeg",
  "/8.jpeg", 
  "/9.jpeg",
  "/10.jpeg"
];
export default function Home() {
  const [view, setView] = useState<'start' | 'content' | 'end'>('start');
  const [data, setData] = useState<BirthdayData | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Custom user-uploaded images (mapped by index 0-9)
  const [customImages, setCustomImages] = useState<Record<number, string>>({});
  // Track errors to show fallback UI
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preload data
  useEffect(() => {
    generateCinematicQuotes().then(setData);
  }, []);

  // Audio control for End Screen
  useEffect(() => {
    if (view === 'end' && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    } else if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  }, [view]);

  const handleStart = () => {
    if (data) {
      setView('content');
    }
  };

  const handleNextPage = () => {
    if (data && currentPageIndex < data.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    } else {
      setView('end');
    }
  };

  const handleReplay = () => {
    setCurrentPageIndex(0);
    setView('start');
  };

  // Logic to determine which image index we are currently viewing
  let activeImageIndex = 0;
  if (view === 'start') {
    activeImageIndex = 0; // Use p1.jpeg for start screen
  } else if (view === 'content') {
    activeImageIndex = currentPageIndex;
  } else if (view === 'end') {
    activeImageIndex = 9; // Use p10.jpeg for end screen
  }

  // Get the source: either custom uploaded blob or default path
  const currentBgSrc = customImages[activeImageIndex] || DEFAULT_IMAGES[activeImageIndex];
  const hasError = imgErrors[activeImageIndex] && !customImages[activeImageIndex];

  // Handle manual file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomImages(prev => ({
        ...prev,
        [activeImageIndex]: objectUrl
      }));
      // Clear error for this index
      setImgErrors(prev => ({
        ...prev,
        [activeImageIndex]: false
      }));
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Hidden File Input for Manual Override */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 bg-[#1a1a1a]">
          {!hasError ? (
            <img 
                key={currentBgSrc} // Key change triggers fade animation
                src={currentBgSrc}
                alt={`Background for page ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-[2000ms] ease-in-out animate-kenburns opacity-60"
                onError={() => {
                    console.error(`FAILED TO LOAD IMAGE: ${currentBgSrc}`);
                    setImgErrors(prev => ({ ...prev, [activeImageIndex]: true }));
                }}
            />
          ) : (
             // Interactive Fallback if image fails
             <div 
                className="w-full h-full flex flex-col items-center justify-center text-white/60 bg-gray-900 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={triggerFileSelect}
                title="Click to load image"
             >
                <div className="border-2 border-dashed border-white/30 p-8 rounded-xl flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="font-cinematic text-xl mb-2 text-yellow-400">Image Not Found</p>
                    <p className="font-mono text-sm bg-black/0 px-2 py-1 rounded mb-4">Missing: {DEFAULT_IMAGES[activeImageIndex]}</p>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold transition">
                        Tap to Select Photo
                    </button>
                </div>
             </div>
          )}
          
          {/* Dark Overlay for Text Readability */}
          <div className="absolute " />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full">
        {view === 'start' && (
          <StartScreen onStart={handleStart} />
        )}

        {view === 'content' && data && data.pages[currentPageIndex] && (
          <ContentScreen 
            key={currentPageIndex} 
            data={data.pages[currentPageIndex]} 
            onNext={handleNextPage}
            isActive={view === 'content'}
          />
        )}

        {view === 'end' && data && (
          <EndScreen 
            quotePairs={data.pages} 
            onReplay={handleReplay} 
          />
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes kenburns {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.0); }
        }
        .animate-kenburns {
          animation: kenburns 10s ease-out forwards;
        }
      `}} />
    </div>
  );
}
