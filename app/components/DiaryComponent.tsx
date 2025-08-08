'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  weather: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface DiaryComponentProps {
  theme: {
    text: string;
    cardBg: string;
    accent: string;
    secondary: string;
  };
}

export default function DiaryComponent({ theme }: DiaryComponentProps) {
  const [diaryName, setDiaryName] = useState('My Beautiful Diary');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊');
  const [selectedWeather, setSelectedWeather] = useState('☀️');
  const [tags, setTags] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);

  // Memoized constants
  const moods = useMemo(() => ['😊', '😍', '😔', '😴', '🤔', '🥰', '😤', '🌟', '💖', '🎉'], []);
  const weathers = useMemo(() => ['☀️', '⛅', '🌤️', '🌦️', '🌧️', '⛈️', '🌨️', '🌈', '🌙', '⭐'], []);

  // Load data from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('rakhi-diary-name');
    const savedEntries = localStorage.getItem('rakhi-diary-entries');
    
    if (savedName) setDiaryName(savedName);
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        if (Array.isArray(parsed)) {
          setEntries(parsed);
        }
      } catch (e) {
        console.error('Failed to parse diary entries', e);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('rakhi-diary-name', diaryName);
    localStorage.setItem('rakhi-diary-entries', JSON.stringify(entries));
  }, [diaryName, entries]);

  const startNewEntry = useCallback(() => {
    setCurrentEntry(null);
    setTitle('');
    setContent('');
    setSelectedMood('😊');
    setSelectedWeather('☀️');
    setTags('');
    setIsFlipping(true);
    setTimeout(() => {
      setIsWriting(true);
      setIsFlipping(false);
    }, 300);
  }, []);

  const saveEntry = useCallback(() => {
    if (!title.trim() && !content.trim()) return;

    const entryData: DiaryEntry = {
      id: currentEntry?.id || Date.now().toString(),
      title: title || `Entry from ${new Date().toLocaleDateString()}`,
      content,
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      weather: selectedWeather,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: currentEntry?.createdAt || new Date(),
      updatedAt: new Date()
    };

    setEntries(prev => currentEntry 
      ? prev.map(entry => entry.id === currentEntry.id ? entryData : entry)
      : [...prev, entryData]
    );

    setIsFlipping(true);
    setTimeout(() => {
      setIsWriting(false);
      setCurrentEntry(null);
      setIsFlipping(false);
    }, 300);
  }, [title, content, selectedMood, selectedWeather, tags, currentEntry]);

  const editEntry = useCallback((entry: DiaryEntry) => {
    setCurrentEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setSelectedMood(entry.mood);
    setSelectedWeather(entry.weather);
    setTags(entry.tags.join(', '));
    setIsFlipping(true);
    setTimeout(() => {
      setIsWriting(true);
      setIsFlipping(false);
    }, 300);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  // Memoized sorted entries
  const sortedEntries = useMemo(() => 
    [...entries].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  , [entries]);

  return (
    <section className="py-12 md:py-20 px-4 relative overflow-hidden">
      {/* Optimized Animated Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-4xl md:text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              willChange: 'transform'
            }}
          >
            📖
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <input
            type="text"
            value={diaryName}
            onChange={(e) => setDiaryName(e.target.value)}
            className="text-4xl md:text-6xl font-['Dancing_Script'] text-transparent bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text font-bold text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-4 py-2 mb-4 w-full max-w-lg mx-auto"
            placeholder="Name your diary..."
            aria-label="Diary name"
          />
          <p className="text-xl md:text-2xl text-white font-['Quicksand'] font-medium">
            Your personal space for thoughts and memories 📖✨
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Diary Book - Responsive Layout */}
          <div className="lg:col-span-8">
            <div className={`relative ${isFlipping ? 'animate-flip' : ''}`}>
              {/* Book Cover/Spine - Hidden on mobile */}
              <div className="hidden md:block absolute -left-4 top-0 w-4 md:w-8 h-full bg-gradient-to-b from-amber-600 to-amber-800 rounded-l-lg shadow-lg z-10"></div>
              
              {/* Main Book */}
              <div className={`${theme.cardBg} rounded-lg md:rounded-r-2xl shadow-xl md:border-l-4 border-amber-600 min-h-[500px] md:min-h-[600px] relative overflow-hidden`}>
                {/* Book Binding Holes - Hidden on mobile */}
                <div className="hidden md:flex absolute left-2 top-0 h-full flex-col justify-center space-y-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                  ))}
                </div>

                {/* Lined Paper Effect */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={i}
                      className="border-b border-blue-300/50"
                      style={{ height: '24px', marginTop: `${i * 24}px` }}
                    ></div>
                  ))}
                </div>

                {/* Red Margin Line - Hidden on mobile */}
                <div className="hidden md:block absolute left-12 md:left-16 top-0 h-full w-px bg-red-300/50"></div>

                <div className="relative z-10 p-4 md:p-8 md:pl-16 lg:pl-20">
                  {!isWriting ? (
                    // Cover Page
                    <div className="text-center pt-12 md:pt-20">
                      <div className="text-6xl md:text-8xl mb-6 md:mb-8 animate-bounce">📖</div>
                      <h2 className="text-2xl md:text-4xl font-['Dancing_Script'] text-white mb-4 md:mb-6 font-bold">
                        {diaryName}
                      </h2>
                      <div className="text-white/80 mb-6 md:mb-8">
                        <p className="text-base md:text-lg font-['Quicksand']">
                          This diary belongs to my amazing sister
                        </p>
                        <p className="text-sm mt-2">
                          Created with love 💕
                        </p>
                      </div>
                      
                      <button
                        onClick={startNewEntry}
                        className={`px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-${theme.accent} to-${theme.secondary} text-white rounded-full hover:scale-105 transition-transform duration-300 font-['Quicksand'] font-semibold shadow-lg whitespace-nowrap cursor-pointer`}
                      >
                        ✍️ Start Writing
                      </button>

                      <div className="mt-8 md:mt-12 text-white/60 text-sm">
                        <p>📊 Total entries: {entries.length}</p>
                        <p>📅 Started: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  ) : (
                    // Writing Page
                    <div className="h-full flex flex-col">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4 md:mb-6 pb-2 md:pb-4 border-b border-gray-300/50">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Entry title..."
                          className="text-xl md:text-2xl font-['Dancing_Script'] font-bold text-white bg-transparent border-none outline-none flex-1 placeholder-white/60"
                          aria-label="Entry title"
                        />
                        <div className="text-white/70 font-['Quicksand'] text-sm md:text-base">
                          {new Date().toLocaleDateString()}
                        </div>
                      </div>

                      {/* Mood and Weather */}
                      <div className="flex gap-4 md:gap-6 mb-4 md:mb-6">
                        <div>
                          <label className="block text-white/80 text-xs md:text-sm font-semibold mb-1 md:mb-2">Mood:</label>
                          <select
                            value={selectedMood}
                            onChange={(e) => setSelectedMood(e.target.value)}
                            className="text-xl md:text-2xl bg-transparent border-none outline-none cursor-pointer text-white"
                            aria-label="Select mood"
                          >
                            {moods.map(mood => (
                              <option key={mood} value={mood}>{mood}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-white/80 text-xs md:text-sm font-semibold mb-1 md:mb-2">Weather:</label>
                          <select
                            value={selectedWeather}
                            onChange={(e) => setSelectedWeather(e.target.value)}
                            className="text-xl md:text-2xl bg-transparent border-none outline-none cursor-pointer text-white"
                            aria-label="Select weather"
                          >
                            {weathers.map(weather => (
                              <option key={weather} value={weather}>{weather}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Writing Area */}
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Dear diary, today..."
                        className="w-full flex-1 min-h-[200px] md:min-h-[300px] bg-transparent resize-none border-none outline-none text-white font-['Quicksand'] text-base md:text-lg leading-6 placeholder-white/60"
                        style={{ fontFamily: 'Dancing Script, cursive' }}
                        aria-label="Diary content"
                      />

                      {/* Tags */}
                      <div className="mt-3 md:mt-4">
                        <label className="block text-white/80 text-xs md:text-sm font-semibold mb-1 md:mb-2">Tags (comma separated):</label>
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="family, happy, memories..."
                          className="w-full bg-transparent border-b border-gray-400/50 outline-none text-white pb-1 placeholder-white/60"
                          aria-label="Entry tags"
                        />
                      </div>

                      {/* Save Button */}
                      <div className="mt-4 md:absolute md:bottom-8 md:right-8">
                        <button
                          onClick={saveEntry}
                          className={`w-full md:w-auto px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:scale-105 transition-transform duration-300 font-['Quicksand'] font-semibold shadow-lg whitespace-nowrap cursor-pointer`}
                        >
                          💾 Save Entry
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Entries List - Responsive Layout */}
          <div className="lg:col-span-4 mt-6 lg:mt-0">
            <div className={`${theme.cardBg} backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 sticky top-4`}>
              <h3 className="text-xl md:text-2xl font-['Dancing_Script'] text-white mb-4 md:mb-6 font-bold">
                My Entries 📚
              </h3>
              
              <div className="space-y-2 md:space-y-3 max-h-[400px] overflow-y-auto">
                {sortedEntries.length === 0 ? (
                  <div className="text-center py-6 md:py-8">
                    <div className="text-3xl md:text-4xl mb-2">📝</div>
                    <p className="text-white/60 text-sm">No entries yet</p>
                  </div>
                ) : (
                  sortedEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-white/20 transition-colors duration-200 cursor-pointer group"
                      onClick={() => editEntry(entry)}
                      aria-label={`Edit entry: ${entry.title}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 md:gap-2 mb-1">
                            <span className="text-base md:text-lg">{entry.mood}</span>
                            <span className="text-base md:text-lg">{entry.weather}</span>
                            <h4 className="font-semibold text-white text-xs md:text-sm truncate">
                              {entry.title}
                            </h4>
                          </div>
                          <p className="text-white/70 text-xs line-clamp-2">
                            {entry.content.substring(0, 80)}...
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEntry(entry.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity duration-200 cursor-pointer text-sm md:text-base"
                          aria-label="Delete entry"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 md:mt-2">
                          {entry.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] md:text-xs bg-white/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-white/80">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-[10px] md:text-xs text-white/50 mt-1">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes flip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(-90deg); }
          100% { transform: rotateY(0deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-flip {
          animation: flip 0.3s ease-in-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}