'use client';

import React, { useState, useEffect, useRef } from 'react';
import { generateCinematicQuotes } from '../services/geminiService';
import StartScreen from '../components/StartScreen';
import ContentScreen from '../components/ContentScreen';
import EndScreen from '../components/EndScreen';
import { BirthdayData } from '../types';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [customImages, setCustomImages] = useState<Record<number, string>>({});
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preload data with loading state
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const quotesData = await generateCinematicQuotes();
        setData(quotesData);
        console.log('Data loaded successfully:', quotesData);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Set fallback data if API fails
        setData({
          pages: [
            { quote1: "سالگرہ مبارک", quote2: "فائزہ جانِ من" },
            { quote1: "تمہاری دوستی میرے لئے انمول ہے", quote2: "ہمیشہ خوش رہو" }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Audio control
  useEffect(() => {
    if (view === 'end' && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [view]);

  const handleStart = async () => {
    console.log('Start clicked, moving to content view');
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setView('content');
    setCurrentPageIndex(0);
    setIsTransitioning(false);
  };

  const handleNextPage = async () => {
    console.log('Next page called, current index:', currentPageIndex);
    
    if (data && currentPageIndex < data.pages.length - 1) {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const nextIndex = currentPageIndex + 1;
      console.log('Moving to next page:', nextIndex);
      setCurrentPageIndex(nextIndex);
      setIsTransitioning(false);
    } else {
      console.log('All pages completed, moving to end screen');
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setView('end');
      setIsTransitioning(false);
    }
  };

  const handleReplay = async () => {
    console.log('Replay clicked, resetting to start');
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setCurrentPageIndex(0);
    setView('start');
    setIsTransitioning(false);
  };

  // Debug current state
  useEffect(() => {
    console.log('Current State:', {
      view,
      currentPageIndex,
      totalPages: data?.pages?.length || 0,
      isLoading,
      isTransitioning
    });
  }, [view, currentPageIndex, data, isLoading, isTransitioning]);

  // Get current background image source
  const getCurrentBgSrc = () => {
    let activeImageIndex = 0;

    if (view === 'start') {
      activeImageIndex = 0;
    } else if (view === 'content') {
      activeImageIndex = currentPageIndex + 1;
    } else if (view === 'end') {
      activeImageIndex = 10;
    }

    activeImageIndex = Math.min(activeImageIndex, DEFAULT_IMAGES.length - 1);
    return customImages[activeImageIndex] || DEFAULT_IMAGES[activeImageIndex];
  };

  const currentBgSrc = getCurrentBgSrc();
  const hasError = imgErrors[0] && !customImages[0];

  // Handle manual file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomImages(prev => ({
        ...prev,
        [0]: objectUrl
      }));
      setImgErrors(prev => ({
        ...prev,
        [0]: false
      }));
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center p-4">
        <div className="text-white text-lg sm:text-xl md:text-2xl font-cinematic animate-pulse text-center px-4">
          Loading your special birthday message...
        </div>
      </div>
    );
  }

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

      {/* Background Layer - Fixed position without space */}
      <div className="absolute inset-0 z-0">
        {view !== 'end' ? (
          <div className="absolute inset-0">
            {!hasError ? (
              <img 
                key={currentBgSrc}
                src={currentBgSrc}
                alt="Background"
                className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                  isTransitioning ? 'scale-110 blur-sm' : 'scale-100 blur-0'
                }`}
                style={{ objectFit: 'cover' }}
                onError={() => {
                  console.error(`Failed to load image: ${currentBgSrc}`);
                  setImgErrors(prev => ({ ...prev, [0]: true }));
                }}
              />
            ) : (
              <div 
                className="w-full h-full flex flex-col items-center justify-center text-white/60 bg-gray-900 cursor-pointer hover:bg-gray-800 transition-colors p-4"
                onClick={triggerFileSelect}
                title="Click to load image"
              >
                <div className="border-2 border-dashed border-white/30 p-4 sm:p-6 md:p-8 rounded-xl flex flex-col items-center max-w-md w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mb-3 sm:mb-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-cinematic text-base sm:text-lg md:text-xl mb-2 text-yellow-400 text-center">Image Not Found</p>
                  <p className="font-mono text-xs sm:text-sm bg-black/0 px-2 py-1 rounded mb-3 sm:mb-4 text-center break-all">Missing: {currentBgSrc}</p>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition w-full max-w-xs">
                    Tap to Select Photo
                  </button>
                </div>
              </div>
            )}
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        ) : (
          // Black background for end screen (images handled in EndScreen)
          <div className="absolute inset-0 bg-black" />
        )}
      </div>

      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 z-20 bg-black/30 transition-opacity duration-800 ease-in-out" />
      )}

      {/* Main Content Area with Safe Padding */}
      <div className="relative z-10 w-full h-full safe-area-padding">
        {view === 'start' && (
          <StartScreen onStart={handleStart} />
        )}

        {view === 'content' && data && data.pages.map((page, index) => (
          <ContentScreen 
            key={index}
            data={page} 
            onNext={handleNextPage}
            isActive={index === currentPageIndex && !isTransitioning}
          />
        ))}

        {view === 'end' && data && (
          <EndScreen 
            quotePairs={data.pages} 
            onReplay={handleReplay}
            images={DEFAULT_IMAGES.slice(1)} // Pass all content images (1-10)
            customImages={customImages}
          />
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src="/background-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

  

      <style jsx>{`
        .safe-area-padding {
          padding-left: env(safe-area-inset-left, 1rem);
          padding-right: env(safe-area-inset-right, 1rem);
          padding-top: env(safe-area-inset-top, 1rem);
          padding-bottom: env(safe-area-inset-bottom, 1rem);
        }
        
        @media (max-width: 640px) {
          .safe-area-padding {
            padding-left: env(safe-area-inset-left, 0.5rem);
            padding-right: env(safe-area-inset-right, 0.5rem);
            padding-top: env(safe-area-inset-top, 0.5rem);
            padding-bottom: env(safe-area-inset-bottom, 0.5rem);
          }
        }
        
        @media (min-width: 1024px) {
          .safe-area-padding {
            padding-left: env(safe-area-inset-left, 2rem);
            padding-right: env(safe-area-inset-right, 2rem);
            padding-top: env(safe-area-inset-top, 2rem);
            padding-bottom: env(safe-area-inset-bottom, 2rem);
          }
        }
      `}</style>
    </div>
  );
}