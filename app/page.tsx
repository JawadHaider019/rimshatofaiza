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
    await new Promise(resolve => setTimeout(resolve, 800)); // Wait for transition
    setView('content');
    setCurrentPageIndex(0);
    setIsTransitioning(false);
  };

  const handleNextPage = async () => {
    console.log('Next page called, current index:', currentPageIndex);
    
    if (data && currentPageIndex < data.pages.length - 1) {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Wait for transition
      const nextIndex = currentPageIndex + 1;
      console.log('Moving to next page:', nextIndex);
      setCurrentPageIndex(nextIndex);
      setIsTransitioning(false);
    } else {
      console.log('All pages completed, moving to end screen');
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Wait for transition
      setView('end');
      setIsTransitioning(false);
    }
  };

  const handleReplay = async () => {
    console.log('Replay clicked, resetting to start');
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Wait for transition
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

  // Logic to determine which background to show
  let activeImageIndex = 0;

  if (view === 'start') {
    activeImageIndex = 0;
  } else if (view === 'content') {
    activeImageIndex = currentPageIndex + 1;
  } else if (view === 'end') {
    activeImageIndex = 10;
  }

  // Ensure activeImageIndex doesn't exceed available images
  activeImageIndex = Math.min(activeImageIndex, DEFAULT_IMAGES.length - 1);

  // Get the source for images
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="text-white text-xl font-cinematic animate-pulse">
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

      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Image background for all screens */}
        <div className="absolute inset-0 bg-[#1a1a1a]">
          {!hasError && (
            <img 
              key={currentBgSrc}
              src={currentBgSrc}
              alt={`Background for ${view} view`}
              className={`w-full h-full object-cover transition-all duration-1000 ease-in-out opacity-60 ${
                isTransitioning ? 'scale-110 blur-sm' : 'scale-100 blur-0'
              }`}
              onError={() => {
                console.error(`Failed to load image: ${currentBgSrc}`);
                setImgErrors(prev => ({ ...prev, [activeImageIndex]: true }));
              }}
            />
          ) }
          {/* Dark overlay for text readability */}
          <div className="absolute " />
        </div>
      </div>

      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 z-20 bg-black/30 transition-opacity duration-800 ease-in-out" />
      )}

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full">
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
          />
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src="/background-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

    </div>
  );
}