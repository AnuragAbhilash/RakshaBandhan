'use client';

import { useState, useEffect, useRef } from 'react';

export default function HeroSection() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showZoomed, setShowZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [celebrationIntensity, setCelebrationIntensity] = useState(1);

  // Sample photos - replace with your actual image paths
  const photos = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    src: `/images/image${i + 1}.jpg`,
    caption: `Beautiful Memory #${i + 1}`,
    date: `${2010 + i}`,
  }));

  const messages = [
    "Happy Raksha Bandhan, Dearest Sisters (Sumi & Fuchi)! 💕✨",
    "From all your loving brothers - Baru, Chhotu, Ramu, Sofu, Jhamku & Piku! 🎀👨‍👦‍👦",
    "You light up our world, beautiful sisters! 🌟💖",
    "Our bond is stronger than any rainbow! 🌈💪",
    "You make every day magical, dear Sisters! ⭐🦋",
    "All brothers love you endlessly! 👭💝"
  ];

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      nextPhoto();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      prevPhoto();
    }
  };

  // Photo navigation
  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Auto-rotate photos
  useEffect(() => {
  if (isPlaying) {
    intervalRef.current = setInterval(() => {
      nextPhoto();
    }, 3000);
  } else if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [isPlaying]);

  // Handle music playback
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume;
    
    if (isPlaying) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.log("Auto-play prevented:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, volume]);

  // Rotating messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      fullscreenRef.current?.requestFullscreen().catch(e => console.log(e));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const triggerCelebration = () => {
    setShowConfetti(true);
    setCelebrationIntensity(prev => Math.min(prev + 1, 5)); // Max 5 intensity levels
    setTimeout(() => setShowConfetti(false), 5000);
    
    if (audioRef.current) {
      const celebrationAudio = new Audio('/celebration-sound.mp3');
      celebrationAudio.volume = volume * celebrationIntensity * 0.3;
      celebrationAudio.play().catch(e => console.log("Sound prevented:", e));
    }
  };

  // Progress calculation
  const progress = ((currentPhotoIndex + 1) / photos.length) * 100;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background Music (hidden) */}
      <audio ref={audioRef} src="/music.mp4" />

      {/* Floating magical elements */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-magical text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          >
            {['✨', '🌟', '💫', '⭐', '🌈', '💖', '🎀', '🦋', '🌸', '💝'][Math.floor(Math.random() * 10)]}
          </div>
        ))}
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto w-full">
        {/* Main Title with enhanced typography */}
        <div className="mb-8 md:mb-12 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 font-['Montserrat'] tracking-tight">
            <span className="block text-3xl sm:text-4xl md:text-5xl mb-2 font-['Dancing_Script'] text-pink-300">
              Celebrating Sisterhood
            </span>
            <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Raksha Bandhan
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-pink-100 max-w-2xl mx-auto">
            A timeless bond of love, protection, and beautiful memories
          </p>
        </div>

        {/* Memory Timeline Section */}
        <div className="mb-8 md:mb-12 w-full px-4">
          <div 
            ref={fullscreenRef}
            className="relative w-full max-w-2xl mx-auto aspect-square overflow-hidden rounded-xl md:rounded-2xl shadow-xl border-4 border-white/20 bg-black/20"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Main Photo Display */}
            <img
              src={photos[currentPhotoIndex].src}
              alt={photos[currentPhotoIndex].caption}
              className={`w-full h-full object-cover transition-transform duration-1000 cursor-pointer ${
                isPlaying ? 'scale-105' : 'scale-100'
              } ${showZoomed ? 'scale-150' : ''}`}
              onClick={() => setShowZoomed(!showZoomed)}
            />

            {/* Photo Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 text-white">
              <h3 className="text-lg md:text-2xl font-bold">{photos[currentPhotoIndex].caption}</h3>
              <p className="text-pink-300 text-sm md:text-base">{photos[currentPhotoIndex].date}</p>
            </div>

            {/* Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
              <button
                onClick={toggleFullscreen}
                className="bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all"
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? '⤵️' : '⤴️'}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all"
                  aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 md:w-24 h-2 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  aria-label="Volume control"
                />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div 
                className="h-full bg-pink-500 transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all"
              aria-label="Previous photo"
            >
              &larr;
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all"
              aria-label="Next photo"
            >
              &rarr;
            </button>
          </div>

          {/* Thumbnail Scroller */}
          <div className="mt-4 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2 justify-center min-w-max">
              {photos.map((photo, index) => (
                <div 
                  key={photo.id}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                    currentPhotoIndex === index
                      ? 'border-pink-400 transform -translate-y-1 scale-110'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  onClick={() => setCurrentPhotoIndex(index)}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 transition-all ${
                    currentPhotoIndex === index
                      ? 'bg-pink-500/30'
                      : 'bg-black/20 hover:bg-pink-500/10'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rotating Messages */}
        <div className="mb-8 md:mb-12 h-24 md:h-32 flex items-center justify-center px-4">
          <div className="bg-white/10 rounded-xl md:rounded-2xl px-6 py-4 md:px-8 md:py-6 backdrop-blur-lg border border-white/20 shadow-lg w-full max-w-2xl mx-auto">
            <p className="text-lg md:text-xl lg:text-2xl font-medium transition-all duration-1000">
              {messages[currentMessage]}
            </p>
          </div>
        </div>

        {/* Celebration Button */}
        <div className="mb-8 md:mb-12 px-4">
          <button
            onClick={triggerCelebration}
            className="group px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-base md:text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 border-2 border-white/30 shadow-lg whitespace-nowrap"
          >
            <span className="inline-block group-hover:animate-spin mr-2">🎉</span>
            Start the Celebration!
            <span className="inline-block group-hover:animate-spin ml-2">🎊</span>
          </button>
        </div>

        {/* Family Members */}
        <div className="mt-6 md:mt-8 bg-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 backdrop-blur-lg inline-block border border-white/20 max-w-full">
          <p className="text-sm md:text-base lg:text-lg font-medium text-pink-100 mb-2 md:mb-3">With love from your brothers</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {['Piku', 'Sofu', 'Jhamku', 'Ramu', 'Chhotu', 'Baru'].map((name) => (
              <span
                key={name}
                className="bg-white/20 px-2 py-1 text-xs md:text-sm rounded-full font-medium"
              >
                👨 {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Background flash effect */}
          <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ${
            celebrationIntensity > 2 ? 'from-yellow-200/20 via-pink-300/30 to-purple-400/20' : 'from-yellow-100/10 via-pink-200/20 to-purple-300/10'
          }`}></div>

          {/* Multiple layers of emojis with different animations */}
          {[...Array(100 * celebrationIntensity)].map((_, i) => {
            // Random properties based on intensity
            const size = 12 + Math.random() * (12 * celebrationIntensity);
            const duration = 2 + Math.random() * (1 + celebrationIntensity);
            const delay = Math.random() * 2;
            
            // Different animation types
            const animationType = i % 3;
            
            // Different starting positions
            const startX = Math.random() * window.innerWidth;
            const startY = -50 - (Math.random() * 100);
            
            const emojis = [
              '🎉', '🎊', '💖', '⭐', '🌸', '💕', '✨', '🌈', '🎀', 
              '💝', '🦋', '🌟', '🥳', '🎈', '🎁', '🍭', '❤️', '🧡',
              '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '🎂', '🍰'
            ];
            
            return (
              <div
                key={i}
                className="absolute animate-celebration"
                style={{
                  left: `${startX}px`,
                  top: `${startY}px`,
                  fontSize: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  animationName: animationType === 0 ? 'float-down' : 
                              animationType === 1 ? 'swirl-fall' : 'zigzag-fall',
                  opacity: 0,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  filter: celebrationIntensity > 3 ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none'
                }}
              >
                {emojis[Math.floor(Math.random() * emojis.length)]}
              </div>
            );
          })}

          {/* Additional effects for higher intensity */}
          {celebrationIntensity > 2 && (
            <div className="absolute inset-0 animate-pulse opacity-70" style={{
              animationDuration: `${1 + Math.random()}s`,
              background: `radial-gradient(circle, rgba(255,${Math.floor(200 * celebrationIntensity / 5)},${Math.floor(200 * celebrationIntensity / 5)},0.3) 0% 0% / 200% 200%`
            }}></div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes float-magical {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.6; }
          50% { transform: translateY(-30px) rotate(180deg) scale(1.2); opacity: 1; }
        }
        @keyframes confetti {
          0% { 
            transform: translateY(-100px) rotate(0deg); 
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(720deg); 
            opacity: 0;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float-magical {
          animation: float-magical 6s ease-in-out infinite;
        }
        .animate-confetti {
          animation: confetti 3s linear forwards;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes emoji-storm {
          0% { 
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% { 
            transform: translate(var(--endX), var(--endY)) rotate(var(--rotateEnd));
            opacity: 0;
          }
        }
        .animate-emoji-storm {
          animation: emoji-storm linear forwards;
          will-change: transform;
        }
        @keyframes float-down {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

        @keyframes swirl-fall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(calc(100px * ${celebrationIntensity}), 100vh) rotate(720deg); opacity: 0; }
        }

        @keyframes zigzag-fall {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          30% { transform: translateX(50px) translateY(30vh) rotate(120deg); }
          60% { transform: translateX(-50px) translateY(60vh) rotate(240deg); }
          90% { opacity: 1; }
          100% { transform: translateX(0) translateY(100vh) rotate(360deg); opacity: 0; }
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.7; }
          100% { transform: scale(1); opacity: 0.3; }
        }

        .animate-celebration {
          will-change: transform, opacity;
        }

        .animate-pulse {
          animation: pulse ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}