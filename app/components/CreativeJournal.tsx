
'use client';

import { useState, useEffect } from 'react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreativeJournalProps {
  theme: any;
  onAchievement: (achievement: string) => void;
}

export default function CreativeJournal({ theme, onAchievement }: CreativeJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊');
  const [isEditing, setIsEditing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  const moodEmojis = ['😊', '😔', '😍', '🤔', '😴', '🌟', '🔥', '🌈'];

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rakhi-journal');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('rakhi-journal', JSON.stringify(entries));
    }
  }, [entries]);

  // Auto-save effect
  useEffect(() => {
    if (isEditing && (title || content)) {
      const timer = setTimeout(() => {
        autoSave();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [title, content, isEditing]);

  const autoSave = () => {
    if (!title && !content) return;

    if (currentEntry) {
      // Update existing entry
      setEntries(prev => prev.map(entry => 
        entry.id === currentEntry.id
          ? { ...entry, title: title || 'Untitled', content, mood: selectedMood, updatedAt: new Date() }
          : entry
      ));
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: title || 'Untitled',
        content,
        mood: selectedMood,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setEntries(prev => [...prev, newEntry]);
      setCurrentEntry(newEntry);
    }

    setAutoSaveStatus('Auto-saved ✓');
    setTimeout(() => setAutoSaveStatus(''), 2000);
    onAchievement('Journal Writer');
  };

  const startNewEntry = () => {
    setCurrentEntry(null);
    setTitle('');
    setContent('');
    setSelectedMood('😊');
    setIsEditing(true);
    onAchievement('Creative Thinker');
  };

  const editEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setSelectedMood(entry.mood);
    setIsEditing(true);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    if (currentEntry && currentEntry.id === id) {
      setCurrentEntry(null);
      setTitle('');
      setContent('');
      setIsEditing(false);
    }
  };

  const finishEditing = () => {
    if (title || content) {
      autoSave();
    }
    setIsEditing(false);
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-['Pacifico'] text-white mb-4">
            Creative Journal 📔
          </h2>
          <p className="text-xl text-white/80">
            Your private space for thoughts and creativity
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Journal Entries List */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Entries</h3>
                <button
                  onClick={startNewEntry}
                  className={`px-4 py-2 bg-${theme.accent} text-white rounded-xl hover:scale-105 transition-all duration-300 text-sm whitespace-nowrap cursor-pointer`}
                >
                  ✨ New Entry
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {entries.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="text-white/60 text-sm">No entries yet</p>
                    <p className="text-white/40 text-xs">Start writing!</p>
                  </div>
                ) : (
                  entries.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                        currentEntry && currentEntry.id === entry.id
                          ? 'bg-white/30 ring-2 ring-white/50'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      onClick={() => editEntry(entry)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{entry.mood}</span>
                            <h4 className="font-semibold text-white truncate text-sm">
                              {entry.title}
                            </h4>
                          </div>
                          <p className="text-white/70 text-xs line-clamp-2">
                            {entry.content.substring(0, 60)}...
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEntry(entry.id);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors duration-300 ml-2 cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="text-xs text-white/50">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {entries.length > 0 && (
                <div className="mt-4 p-3 bg-white/10 rounded-xl text-center">
                  <div className="text-sm text-white/70">
                    📊 {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Writing Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
              {!isEditing ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">✍️</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Start Writing
                  </h3>
                  <p className="text-white/70 mb-8">
                    Click "New Entry" or select an existing entry to start writing
                  </p>
                  <button
                    onClick={startNewEntry}
                    className={`px-8 py-4 bg-${theme.accent} text-white rounded-2xl hover:scale-105 transition-all duration-300 text-lg whitespace-nowrap cursor-pointer`}
                  >
                    🌟 Begin Your Journey
                  </button>
                </div>
              ) : (
                <div>
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <select
                        value={selectedMood}
                        onChange={(e) => setSelectedMood(e.target.value)}
                        className="text-2xl bg-transparent border-none outline-none cursor-pointer pr-8"
                      >
                        {moodEmojis.map(emoji => (
                          <option key={emoji} value={emoji} className="text-black">
                            {emoji}
                          </option>
                        ))}
                      </select>
                      
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Entry title..."
                        className="flex-1 text-xl font-semibold bg-transparent text-white placeholder-white/50 border-none outline-none focus:border-b-2 focus:border-white/50 pb-1"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {autoSaveStatus && (
                        <span className="text-sm text-green-300">{autoSaveStatus}</span>
                      )}
                      <button
                        onClick={finishEditing}
                        className={`px-4 py-2 bg-${theme.secondary} text-white rounded-lg hover:scale-105 transition-all duration-300 text-sm whitespace-nowrap cursor-pointer`}
                      >
                        Done
                      </button>
                    </div>
                  </div>

                  {/* Writing Area */}
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your thoughts..."
                    className="w-full h-80 p-4 bg-white/10 rounded-2xl text-white placeholder-white/50 resize-none border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />

                  {/* Stats */}
                  <div className="mt-4 flex justify-between text-sm text-white/70">
                    <span>Words: {wordCount}</span>
                    <span>Characters: {content.length}</span>
                    <span>
                      {currentEntry ? 'Editing' : 'New entry'} • Auto-saves every 2 seconds
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
