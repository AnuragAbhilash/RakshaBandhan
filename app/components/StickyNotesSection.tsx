'use client';

import { useState, useEffect, useRef } from 'react';

interface StickyNote {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  size: 'small' | 'medium' | 'large';
  createdAt: Date;
}

interface StickyNotesSectionProps {
  theme: any;
  onAchievement: (achievement: string) => void;
}

export default function StickyNotesSection({ theme, onAchievement }: StickyNotesSectionProps) {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-yellow-300');
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const noteColors = [
    'bg-yellow-300', 'bg-pink-300', 'bg-blue-300', 'bg-green-300',
    'bg-purple-300', 'bg-orange-300', 'bg-red-300', 'bg-indigo-300',
    'bg-teal-300', 'bg-lime-300', 'bg-rose-300', 'bg-cyan-300'
  ];

  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-40 h-40',
    large: 'w-48 h-48'
  };

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rakhi-sticky-notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('rakhi-sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    if (!newNoteText.trim()) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const note: StickyNote = {
      id: Date.now().toString(),
      text: newNoteText.trim(),
      color: selectedColor,
      x: Math.random() * 60 + 10, // 10-70% from left
      y: Math.random() * 50 + 10, // 10-60% from top
      rotation: Math.random() * 20 - 10, // -10 to +10 degrees
      size: selectedSize,
      createdAt: new Date()
    };

    setNotes(prev => [...prev, note]);
    setNewNoteText('');
    setIsCreating(false);
    onAchievement('Sticky Note Creator');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleMouseDown = (noteId: string) => {
    setDraggedNote(noteId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNote || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const y = ((e.clientY - containerRect.top) / containerRect.height) * 100;

    setNotes(prev => prev.map(note => 
      note.id === draggedNote 
        ? { ...note, x: Math.max(0, Math.min(85, x)), y: Math.max(0, Math.min(75, y)) }
        : note
    ));
  };

  const handleMouseUp = () => {
    setDraggedNote(null);
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-5xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            📝
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-['Dancing_Script'] text-transparent bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text font-bold mb-6 animate-pulse">
            Sticky Notes Wall 📝✨
          </h2>
          <p className="text-2xl text-white font-['Quicksand'] font-medium">
            Stick your thoughts, reminders, and happy moments! 🌈
          </p>
        </div>

        {/* Control Panel */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full hover:scale-105 transition-all duration-300 font-['Quicksand'] font-bold shadow-xl whitespace-nowrap cursor-pointer"
          >
            {isCreating ? '✕ Cancel' : '✨ Add New Sticky Note'}
          </button>
        </div>

        {/* Note Creation Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-bounce-in">
              <h3 className="text-2xl font-['Dancing_Script'] text-gray-800 mb-6 font-bold text-center">
                Create Your Sticky Note 📝
              </h3>
              
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="What's on your mind?"
                maxLength={200}
                className="w-full h-32 p-4 border-2 border-yellow-300 rounded-xl resize-none focus:outline-none focus:border-orange-400 text-gray-800 font-['Quicksand'] shadow-inner"
              />
              
              <div className="text-right text-sm text-gray-500 mb-4">
                {newNoteText.length}/200
              </div>

              {/* Color Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Choose Color:</label>
                <div className="flex flex-wrap gap-2">
                  {noteColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full ${color} border-2 transition-all duration-300 cursor-pointer hover:scale-110 ${
                        selectedColor === color ? 'border-gray-800 ring-2 ring-gray-400' : 'border-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Size:</label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer font-['Quicksand'] ${
                        selectedSize === size
                          ? 'bg-orange-500 text-white scale-105'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={createNote}
                  disabled={!newNoteText.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-['Quicksand'] font-semibold whitespace-nowrap cursor-pointer"
                >
                  🎉 Create Note
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewNoteText('');
                  }}
                  className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:scale-105 transition-all duration-300 font-['Quicksand'] font-semibold whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Notes Wall */}
        <div 
          ref={containerRef}
          className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl min-h-96 relative border border-white/20 shadow-2xl overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {notes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4 animate-bounce">📝</div>
                <p className="text-white/60 text-xl font-['Quicksand']">Your sticky wall is empty</p>
                <p className="text-white/40 font-['Quicksand']">Add your first note to get started!</p>
              </div>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`absolute ${sizeClasses[note.size]} ${note.color} rounded-lg shadow-lg cursor-move group hover:scale-105 hover:z-10 transition-all duration-300 border-b-4 border-r-4 border-black/20`}
                style={{
                  left: `${note.x}%`,
                  top: `${note.y}%`,
                  transform: `rotate(${note.rotation}deg)`,
                }}
                onMouseDown={() => handleMouseDown(note.id)}
              >
                {/* Delete Button */}
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 flex items-center justify-center cursor-pointer shadow-lg"
                >
                  ×
                </button>
                
                {/* Note Content */}
                <div className="p-4 h-full flex flex-col">
                  <div className="flex-1 text-gray-800 text-sm overflow-y-auto font-['Quicksand'] font-medium leading-relaxed">
                    {note.text}
                  </div>
                  <div className="text-xs text-gray-600 mt-2 border-t border-gray-400/50 pt-2 text-center">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Sticky Tape Effect */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-md opacity-80 shadow-md"></div>
                
                {/* Pin Effect */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
              </div>
            ))
          )}

          {/* Wall Texture */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.1) 2px,
                rgba(255,255,255,0.1) 4px
              )`,
            }}></div>
          </div>
        </div>

        {/* Stats */}
        {notes.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-full px-8 py-4">
              <span className="text-white/90 font-['Quicksand'] font-semibold">
                📊 {notes.length} sticky note{notes.length !== 1 ? 's' : ''} on your wall
              </span>
              <div className="w-px h-6 bg-white/30"></div>
              <span className="text-white/70 font-['Quicksand']">
                Keep adding your thoughts! 💭
              </span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}