'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  color: string;
  message: string;
  date: string;
  createdAt: Date;
  intensity?: number;
}

interface MoodTrackerProps {
  theme?: any;
  onAchievement?: (achievement: string) => void;
}

export default function MoodTracker({ theme, onAchievement }: MoodTrackerProps) {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [showMessage, setShowMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today');
  const [intensity, setIntensity] = useState(5);
  const [showIntensitySlider, setShowIntensitySlider] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const moodOptions = [
    { name: 'Amazing', emoji: '🌟', color: 'bg-yellow-400', 
      message: "You're shining bright today! Keep spreading that positive energy!", value: 10 },
    { name: 'Happy', emoji: '😊', color: 'bg-green-400', 
      message: "Your smile is contagious! What a wonderful day to be you!", value: 8 },
    { name: 'Good', emoji: '😌', color: 'bg-blue-400', 
      message: "You're doing great! Every step forward is progress!", value: 6 },
    { name: 'Okay', emoji: '😐', color: 'bg-gray-400', 
      message: "It's okay to have neutral days. Tomorrow brings new possibilities!", value: 4 },
    { name: 'Tired', emoji: '😴', color: 'bg-purple-400', 
      message: "Rest is important. Take care of yourself, you deserve it!", value: 3 },
    { name: 'Sad', emoji: '😔', color: 'bg-blue-500', 
      message: "It's okay to feel sad sometimes. You're stronger than you know!", value: 2 },
    { name: 'Stressed', emoji: '😰', color: 'bg-orange-400', 
      message: "Take a deep breath. You've overcome challenges before, and you will again!", value: 1 },
    { name: 'Excited', emoji: '🤩', color: 'bg-pink-400', 
      message: "Your excitement is infectious! Channel that energy into something amazing!", value: 9 }
  ];

  // Type guard for MoodEntry
  function isMoodEntry(mood: any): mood is MoodEntry {
    return mood && 
           typeof mood.id === 'string' && 
           typeof mood.mood === 'string' &&
           typeof mood.emoji === 'string';
  }

  // Load moods from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rakhi-moods');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMoods(parsed.filter(isMoodEntry));
        }
      } catch (e) {
        console.error('Failed to parse moods', e);
      }
    }
  }, []);

  // Save moods to localStorage
  useEffect(() => {
    localStorage.setItem('rakhi-moods', JSON.stringify(moods));
  }, [moods]);

  const selectMood = (moodOption: typeof moodOptions[0]) => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = moods.find(mood => mood.date === today);
    
    const moodEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: moodOption.name,
      emoji: moodOption.emoji,
      color: moodOption.color,
      message: moodOption.message,
      date: today,
      createdAt: new Date(),
      intensity: intensity
    };

    if (existingEntry) {
      setMoods(prev => prev.map(mood => 
        mood.date === today ? { ...moodEntry, id: mood.id } : mood
      ));
    } else {
      setMoods(prev => [...prev, moodEntry]);
    }
    
    setSelectedMood(moodOption.name);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
    setShowIntensitySlider(false);
    onAchievement?.('Mood Tracker');
  };

  const getTodaysMood = (): MoodEntry | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return moods.find(mood => mood.date === today);
  };

  const getWeeklyMoods = (): MoodEntry[] => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate >= weekAgo && moodDate <= today;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getMonthlyMoods = (): MoodEntry[] => {
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate >= monthAgo && moodDate <= today;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getMoodSummary = () => {
    const data = activeTab === 'today' 
      ? [getTodaysMood()].filter(isMoodEntry) 
      : activeTab === 'week' 
        ? getWeeklyMoods() 
        : getMonthlyMoods();
    
    if (data.length === 0) return null;

    const average = data.reduce((sum, mood) => {
      const moodValue = moodOptions.find(m => m.name === mood.mood)?.value || 5;
      return sum + (moodValue * (mood.intensity || 5));
    }, 0) / data.length;

    if (average >= 7) {
      return { 
        message: "You're doing amazing! Keep up the positive vibes! 🌈", 
        color: "bg-gradient-to-r from-green-400 to-blue-500",
        emoji: "😊"
      };
    } else if (average >= 5) {
      return { 
        message: "You're doing well overall! Some ups and downs are normal. 🌤️", 
        color: "bg-gradient-to-r from-yellow-400 to-orange-400",
        emoji: "🙂"
      };
    } else {
      return { 
        message: "It's been a tough period. Remember, better days are ahead! 💪", 
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
        emoji: "🤗"
      };
    }
  };

  const todaysMood = getTodaysMood();
  const weeklyMoods = getWeeklyMoods();
  const monthlyMoods = getMonthlyMoods();
  const moodSummary = getMoodSummary();

  const getActiveMoods = (): MoodEntry[] => {
    switch (activeTab) {
      case 'today': 
        const today = getTodaysMood();
        return today ? [today] : [];
      case 'week': 
        return weeklyMoods;
      case 'month': 
        return monthlyMoods;
      default: 
        return [];
    }
  };

  const getMoodValue = (moodName: string): number => {
    return moodOptions.find(m => m.name === moodName)?.value || 5;
  };

  return (
    <section className="py-12 md:py-20 px-4 min-h-screen" ref={containerRef}>
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-4">
            Mood Tracker
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Track your emotions, understand your patterns, and celebrate your growth
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Mood Selection */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl"
          >
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              How are you feeling today?
            </h3>
            
            <AnimatePresence>
              {todaysMood && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-6 p-4 bg-white/20 rounded-2xl text-center"
                >
                  <p className="text-white/80 mb-2">Today you're feeling:</p>
                  <div className="text-4xl mb-2 animate-bounce">{todaysMood.emoji}</div>
                  <p className="text-xl font-semibold text-white">{todaysMood.mood}</p>
                  {todaysMood.intensity && (
                    <div className="mt-2">
                      <div className="text-xs text-white/60 mb-1">Intensity: {todaysMood.intensity}/10</div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className={`${todaysMood.color} h-2 rounded-full`} 
                          style={{ width: `${todaysMood.intensity * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedMood(mood.name);
                    setShowIntensitySlider(true);
                  }}
                  className={`p-3 md:p-4 rounded-xl transition-all duration-300 ${mood.color} hover:shadow-lg cursor-pointer flex flex-col items-center`}
                >
                  <div className="text-2xl md:text-3xl mb-1 md:mb-2">
                    {mood.emoji}
                  </div>
                  <div className="text-xs md:text-sm font-semibold text-white">
                    {mood.name}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Intensity Slider */}
            {showIntensitySlider && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-white/20 rounded-2xl"
              >
                <h4 className="text-white text-center mb-3">How intense is this feeling?</h4>
                <div className="flex items-center gap-4">
                  <span className="text-white/60 text-sm">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="flex-1 accent-pink-500"
                  />
                  <span className="text-white/60 text-sm">10</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-white/60">Mild</span>
                  <span className="text-xs text-white/60">Very Strong</span>
                </div>
                <div className="flex justify-center mt-4 gap-3">
                  <button
                    onClick={() => setShowIntensitySlider(false)}
                    className="px-4 py-2 text-sm bg-white/20 text-white rounded-lg hover:bg-white/30"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const selected = moodOptions.find(m => m.name === selectedMood);
                      if (selected) selectMood(selected);
                    }}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            )}

            {/* Encouraging Message */}
            <AnimatePresence>
              {showMessage && todaysMood && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 p-4 bg-white/20 rounded-2xl"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2 animate-pulse">💕</div>
                    <p className="text-white font-medium">
                      {todaysMood.message}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mood History */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">
                Your Mood History
              </h3>
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`px-3 py-1 text-sm rounded-md ${activeTab === 'today' ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveTab('week')}
                  className={`px-3 py-1 text-sm rounded-md ${activeTab === 'week' ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setActiveTab('month')}
                  className={`px-3 py-1 text-sm rounded-md ${activeTab === 'month' ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                  Month
                </button>
              </div>
            </div>
            
            {moodSummary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mb-6 p-4 ${moodSummary.color} rounded-2xl text-white`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{moodSummary.emoji}</div>
                  <div>
                    <h4 className="font-bold">Mood Summary</h4>
                    <p className="text-sm">{moodSummary.message}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {getActiveMoods().length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 md:py-12"
              >
                <div className="text-5xl md:text-6xl mb-4">📊</div>
                <p className="text-white/60">
                  {activeTab === 'today' 
                    ? "Track your mood today to get started!" 
                    : "No mood data available for this period"}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3 md:space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {getActiveMoods().map((mood) => {
                  const moodValue = getMoodValue(mood.mood) * (mood.intensity || 5) / 10;
                  const moodColor = moodOptions.find(m => m.name === mood.mood)?.color || 'bg-gray-400';
                  
                  return (
                    <motion.div
                      key={mood.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-3 md:p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`${moodColor} w-10 h-10 rounded-full flex items-center justify-center text-xl`}>
                          {mood.emoji}
                        </div>
                        <div>
                          <div className="text-white font-medium">{mood.mood}</div>
                          <div className="text-white/60 text-xs md:text-sm">
                            {new Date(mood.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {mood.date === new Date().toISOString().split('T')[0] && (
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/80 hidden sm:inline">
                            Today
                          </span>
                        )}
                        <div className="w-16 bg-white/20 rounded-full h-2">
                          <div 
                            className={`${moodColor} h-2 rounded-full`} 
                            style={{ width: `${moodValue * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Stats Section */}
            {getActiveMoods().length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 grid grid-cols-3 gap-3 text-center"
              >
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-xl font-bold text-white">{getActiveMoods().length}</div>
                  <div className="text-xs text-white/60">Entries</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-xl font-bold text-white">
                    {new Set(getActiveMoods().map(m => m.mood)).size}
                  </div>
                  <div className="text-xs text-white/60">Unique Moods</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-xl font-bold text-white">
                    {Math.round(getActiveMoods().reduce((sum, mood) => {
                      const moodValue = getMoodValue(mood.mood) * (mood.intensity || 5) / 10;
                      return sum + moodValue;
                    }, 0) / getActiveMoods().length * 10)}%
                  </div>
                  <div className="text-xs text-white/60">Average</div>
                </div>
              </motion.div>
            )}

            {/* Mood Chart Placeholder */}
            {getActiveMoods().length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-white/10 rounded-xl"
              >
                <div className="text-center text-white/80 mb-2">Mood Trend</div>
                <div className="h-32 flex items-end gap-1">
                  {getActiveMoods().map((mood, index) => {
                    const moodValue = getMoodValue(mood.mood) * (mood.intensity || 5) / 10;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className={`w-full ${moodOptions.find(m => m.name === mood.mood)?.color || 'bg-gray-400'} rounded-t-sm`}
                          style={{ height: `${moodValue * 10}%` }}
                        ></div>
                        <div className="text-xs text-white/50 mt-1">
                          {new Date(mood.date).getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
