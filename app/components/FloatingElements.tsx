
'use client';

import { useEffect, useState, useMemo, memo } from 'react';

interface FloatingElementsProps {
  theme: any;
}

function FloatingElements({ theme }: FloatingElementsProps) {
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, delay: number, duration: number}>>([]);
  const [hearts, setHearts] = useState<Array<{id: number, x: number, y: number, delay: number, duration: number}>>([]);

  useEffect(() => {
    // Generate stars - reduced from 100 to 50 for better performance
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3
    }));
    setStars(newStars);

    // Generate hearts - reduced from 30 to 15 for better performance
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Twinkling Stars */}
      {useMemo(() => stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute text-white/40 animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            fontSize: `${8 + Math.random() * 6}px`
          }}
        >
          ⭐
        </div>
      )), [stars])}

      {/* Floating Hearts */}
      {useMemo(() => hearts.map((heart) => (
        <div
          key={`heart-${heart.id}`}
          className="absolute text-white/30 animate-bounce"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            fontSize: `${12 + Math.random() * 8}px`
          }}
        >
          💖
        </div>
      )), [hearts])}

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {useMemo(() => [...Array(10)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className={`absolute w-2 h-2 bg-white/20 rounded-full animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          ></div>
        )), [])}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          75% { transform: translateY(-10px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default memo(FloatingElements);
