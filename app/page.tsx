
'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import RakhiBandhanWebsite from './components/RakhiBandhanWebsite';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate actual loading progress instead of fixed time
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingScreen progress={progress} />;
  }

  return <RakhiBandhanWebsite />;
}