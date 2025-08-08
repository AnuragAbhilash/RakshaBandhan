'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import SurpriseSection from './SurpriseSection';
import PhotoShapeCreator from './PhotoShapeCreator';
import EnhancedTodoManager from './EnhancedTodoManager';
import StickyNotesSection from './StickyNotesSection';
import EnhancedMoodTracker from './EnhancedMoodTracker';
import DiaryComponent from './DiaryComponent';
import GameSection from './GameSection';
import GameSystem from './GameSystem';
import FloatingElements from './FloatingElements';
import MessageWall from './MessageWall';

interface Theme {
  name: string;
  gradient: string;
  accent: string;
  secondary: string;
  text: string;
  cardBg: string;
}

interface AchievementProps {
  onAchievement?: (achievement: string) => void;
}

interface ThemeProps {
  theme: Theme;
}

interface HeaderProps extends ThemeProps {
  onThemeChange: () => void;
  isAnimating: boolean;
}

interface GameSystemProps extends ThemeProps {
  achievements: string[];
}

const themes: Theme[] = [
  {
    name: 'Rainbow Pink',
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    accent: 'pink-700',
    secondary: 'rose-600',
    text: 'text-white drop-shadow-lg',
    cardBg: 'bg-white/25 backdrop-blur-xl border-2 border-white/40'
  },
  {
    name: 'Rainbow Purple',
    gradient: 'from-purple-500 via-violet-500 to-indigo-600',
    accent: 'purple-700',
    secondary: 'violet-600',
    text: 'text-white drop-shadow-lg',
    cardBg: 'bg-white/25 backdrop-blur-xl border-2 border-white/40'
  },
  {
    name: 'Rainbow Orange',
    gradient: 'from-orange-500 via-red-500 to-pink-600',
    accent: 'orange-700',
    secondary: 'red-600',
    text: 'text-white drop-shadow-lg',
    cardBg: 'bg-white/25 backdrop-blur-xl border-2 border-white/40'
  },
  {
    name: 'Rainbow Blue',
    gradient: 'from-cyan-500 via-blue-500 to-purple-600',
    accent: 'cyan-700',
    secondary: 'blue-600',
    text: 'text-white drop-shadow-lg',
    cardBg: 'bg-white/25 backdrop-blur-xl border-2 border-white/40'
  },
  {
    name: 'Rainbow Green',
    gradient: 'from-green-500 via-emerald-500 to-cyan-600',
    accent: 'green-700',
    secondary: 'emerald-600',
    text: 'text-white drop-shadow-lg',
    cardBg: 'bg-white/25 backdrop-blur-xl border-2 border-white/40'
  },
  {
    name: 'Rainbow Gold',
    gradient: 'from-yellow-500 via-orange-500 to-red-600',
    accent: 'yellow-700',
    secondary: 'orange-600',
    text: 'text-white drop-shadow-lg',
    cardBg: 'bg-white/25 backdrop-blur-xl border-2 border-white/40'
  },
  {
    name: 'Rainbow Sunset',
    gradient: 'from-pink-500 via-orange-500 to-yellow-600',
    accent: 'pink-700',
    secondary: 'orange-600',
    text: 'text-white drop-shadow-lg',
    cardBg: 'bg-white/25 backdrop-blur-xl border-2 border-white/40'
  }
];

export default function RakhiBandhanWebsite() {
  const [currentTheme, setCurrentTheme] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [themeChangeTimeout, setThemeChangeTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const hasVisited = localStorage.getItem('rakhi-visited');
    if (!hasVisited && isMounted) {
      localStorage.setItem('rakhi-visited', 'true');
      addAchievement('First Visit');
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isMounted) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      isMounted = false;
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Cleanup theme change timeout on unmount
  useEffect(() => {
    return () => {
      if (themeChangeTimeout) {
        clearTimeout(themeChangeTimeout);
      }
    };
  }, [themeChangeTimeout]);

  const changeTheme = () => {
    // Clear any existing timeout
    if (themeChangeTimeout) {
      clearTimeout(themeChangeTimeout);
    }
    
    setIsAnimating(true);
    const newTimeout = setTimeout(() => {
      setCurrentTheme((prev) => (prev + 1) % themes.length);
      setIsAnimating(false);
      setThemeChangeTimeout(null);
    }, 600);
    
    setThemeChangeTimeout(newTimeout);
    addAchievement('Theme Changer');
  };

  const addAchievement = (achievement: string) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
    }
  };

  const theme = themes[currentTheme];

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${theme.gradient} transition-all duration-1000 ${isAnimating ? 'scale-105 opacity-90 rotate-2' : ''} relative overflow-hidden`}
    >
      {/* Rainbow animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 via-purple-500 to-pink-500 animate-rainbow"></div>
      </div>

      {/* Mouse follower effect */}
      <div 
        className="fixed w-8 h-8 bg-white/30 rounded-full pointer-events-none z-50 transition-all duration-75 ease-out animate-pulse"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          transform: 'scale(1.2)',
        }}
      ></div>

      <FloatingElements theme={theme} />
      
      <Header theme={theme} onThemeChange={changeTheme} isAnimating={isAnimating} />
      
      <main className="relative z-10">
        <HeroSection  />
        <SurpriseSection theme={theme}  />
        <EnhancedTodoManager theme={theme}  />
        <PhotoShapeCreator   />
        <MessageWall   />
        <StickyNotesSection theme={theme} onAchievement={addAchievement} />
        <EnhancedMoodTracker theme={theme} onAchievement={addAchievement} />
        <DiaryComponent theme={theme} onAchievement={addAchievement} />
        <GameSection theme={theme} onAchievement={addAchievement} />
      </main>
      
      <GameSystem achievements={achievements} theme={theme} />

      <style jsx>{`
        @keyframes rainbow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-rainbow {
          animation: rainbow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}