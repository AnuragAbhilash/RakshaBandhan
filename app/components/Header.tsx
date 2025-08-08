'use client';

import Image from 'next/image';
import { useState, useEffect, memo } from 'react';

interface HeaderProps {
  theme: any;
  onThemeChange: () => void;
  isAnimating: boolean;
}

function Header({ theme, onThemeChange, isAnimating }: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="relative z-20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Centered Happy Raksha Bandhan Title with aligned logo and button */}
        <div className="flex flex-col items-center relative">
          <div className="flex justify-between items-center w-full px-4 md:px-8">
            {/* Logo with Image - same width as title for alignment */}
            <div className="w-20 h-12 md:w-24 md:h-16 flex items-center justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden border border-white/30">
                <Image 
                  src="/logo.png" 
                  alt="Raksha Bandhan Logo"
                  width={64}
                  height={64}
                  className="object-contain p-1.5"
                />
              </div>
            </div>
            
            {/* Title positioned absolutely in center */}
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl md:text-6xl font-bold text-center text-white font-['Montserrat'] tracking-wide whitespace-nowrap">
              Happy Raksha Bandhan
            </h1>
            
            {/* Theme Changer Button - same width as logo for symmetry */}
            <div className="w-20 h-12 md:w-24 md:h-16 flex items-center justify-end">
              <button
                onClick={onThemeChange}
                className={`group relative w-14 h-14 md:w-16 md:h-16 rounded-full transition-all duration-300 hover:scale-110 ${isAnimating ? 'animate-spin' : ''}`}
                title="Change Theme"
                aria-label="Change Rakhi Theme"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              >
                <div className="absolute inset-2 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
                  }}
                >
                  <span className="text-xl md:text-2xl">🎀</span>
                </div>
                
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/50 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    animation: isAnimating ? 'spin-slow 3s linear infinite' : 'none'
                  }}
                ></div>
                
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: '0 0 20px rgba(236, 72, 153, 0.7)'
                  }}
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-weight: 700;
          src: url('/fonts/Montserrat-Bold.ttf') format('truetype');
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </header>
  );
}

export default memo(Header);