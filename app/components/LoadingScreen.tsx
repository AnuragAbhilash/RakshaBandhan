'use client';

import { useEffect, useState, useMemo, memo } from 'react';

function RakshaBandhanLoader({ progress = 0 }: { progress?: number }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => prev + 0.05);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Memoize background circles to prevent unnecessary recalculations
  const circles = useMemo(() => Array.from({ length: 20 }).map((_, i) => {
    const hue = Math.floor(Math.random() * 360); // Random hue between 0-359
    const opacity = Number((Math.random() * 0.3 + 0.1).toFixed(2)); // Opacity between 0.1-0.4
    const size = 2 + Math.random() * 3; // Size between 2-5
    
    return (
      <circle
        key={i}
        cx={`${Math.random() * 100}%`}
        cy={`${Math.random() * 100}%`}
        r={size}
        fill={`hsl(${hue}, 70%, 60%)`}
        opacity={opacity}
        className="floating-shape"
      />
    );
  }), []);

  // Rakhi center design - main circular pattern
  const rakhiPattern = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 + phase;
    const radius = 40 + Math.sin(phase * 2) * 8;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      color: `hsl(${(i * 30 + phase * 50) % 360}, 85%, 65%)`,
      size: 3 + Math.sin(phase + i) * 1
    };
  }), [phase]);

  // Decorative petals around rakhi
  const petals = useMemo(() => Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 + phase * 0.5;
    const radius = 25;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      rotation: angle * (180 / Math.PI) + phase * 20,
      color: `hsl(${(i * 45 + phase * 30) % 360}, 90%, 70%)`
    };
  }), [phase]);

  // Floating sacred threads
  const threads = useMemo(() => Array.from({ length: 20 }, (_, i) => {
    const x = (i * 5 + phase * 10) % 100;
    const y = 20 + Math.sin(phase + i * 0.5) * 15;
    return {
      x1: x,
      y1: y,
      x2: x + 8,
      y2: y + Math.sin(phase * 2 + i) * 5,
      color: `hsl(${(30 + i * 10) % 60 + 300}, 70%, 60%)` // Gold/orange threads
    };
  }), [phase]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 flex items-center justify-center overflow-hidden">
      {/* Background mandala pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          {useMemo(() => Array.from({ length: 50 }, (_, i) => {
            const x = (i * 13 + phase * 20) % 100;
            const y = (i * 7 + phase * 15) % 100;
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r={2}
                fill={`hsl(${(i * 20 + phase * 40) % 360}, 60%, 70%)`}
                opacity={0.3 + Math.sin(phase + i) * 0.2}
                
              />
            );
          }), [phase])}
        </svg>
      </div>

      {/* Main loader container */}
      <div className="relative w-96 h-96">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Sacred threads animation */}
          {threads.map((thread, i) => (
            <line
              key={`thread-${i}`}
              x1={`${thread.x1}%`}
              y1={`${thread.y1}%`}
              x2={`${thread.x2}%`}
              y2={`${thread.y2}%`}
              stroke={thread.color}
              strokeWidth="0.5"
              opacity="0.6"
              strokeLinecap="round"
            />
          ))}

          {/* Outer decorative ring */}
          <circle
            cx="50%"
            cy="50%"
            r={35 + Math.sin(phase) * 3}
            fill="none"
            stroke={`hsl(${(phase * 100) % 360}, 80%, 60%)`}
            strokeWidth="0.8"
            strokeDasharray="2,2"
            strokeDashoffset={-phase * 10}
            opacity="0.7"
          />

          {/* Rakhi petals */}
          {petals.map((petal, i) => (
            <g key={`petal-${i}`} transform={`translate(${petal.x}, ${petal.y}) rotate(${petal.rotation})`}>
              <ellipse
                cx="0"
                cy="0"
                rx="3"
                ry="8"
                fill={petal.color}
                opacity="0.8"
              />
            </g>
          ))}

          {/* Main Rakhi pattern */}
          {rakhiPattern.map((dot, i) => (
            <circle
              key={`rakhi-${i}`}
              cx={`${dot.x}%`}
              cy={`${dot.y}%`}
              r={dot.size}
              fill={dot.color}
              opacity="0.9"
            />
          ))}

          {/* Center sacred symbol */}
          <circle
            cx="50%"
            cy="50%"
            r={8 + Math.sin(phase * 3) * 2}
            fill={`hsl(${(phase * 80 + 30) % 360}, 90%, 65%)`}
            opacity="0.9"
          />
          
          {/* Inner decorative dots */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2 + phase * 2;
            const radius = 12;
            return (
              <circle
                key={`inner-${i}`}
                cx={`${50 + Math.cos(angle) * radius}%`}
                cy={`${50 + Math.sin(angle) * radius}%`}
                r="2"
                fill={`hsl(${(i * 60 + phase * 100) % 360}, 85%, 70%)`}
                opacity="0.8"
              />
            );
          })}
        </svg>

        {/* Loading text with Indian touch */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
              राखी
            </h2>
            <h3 className="text-xl font-semibold text-orange-700 tracking-wide">
              RAKSHA BANDHAN
            </h3>
          </div>
          
          {/* Progress bar */}
          <div className="w-48 h-2 bg-orange-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-sm text-orange-600 mt-3 opacity-70">
            Loading Festival of Love...
          </p>
        </div>

        {/* Floating blessing particles */}
        <div className="absolute inset-0 pointer-events-none">
          {useMemo(() => Array.from({ length: 15 }, (_, i) => (
            <div
              key={`blessing-${i}`}
              className="absolute w-2 h-2 rounded-full opacity-60"
              style={{
                background: `hsl(${(i * 24 + phase * 50) % 360}, 70%, 65%)`,
                left: `${(i * 6.67 + Math.sin(phase + i) * 10) % 100}%`,
                top: `${(i * 4 + Math.cos(phase * 0.8 + i) * 15) % 100}%`,
                transform: `scale(${0.5 + Math.sin(phase * 2 + i) * 0.5})`,
                animation: `float ${2 + i * 0.1}s ease-in-out infinite alternate`
              }}
            />
          )), [phase])}
        </div>
      </div>

      {/* Sacred Om symbol in corner */}
      <div className="absolute top-8 right-8 text-4xl text-orange-400 opacity-30 animate-pulse">
        ॐ
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(0.5); }
          100% { transform: translateY(-20px) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default memo(RakshaBandhanLoader);