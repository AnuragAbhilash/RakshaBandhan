
'use client';

import { useState, useEffect } from 'react';

interface GameSystemProps {
  achievements: string[];
  theme: any;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  requirement: string;
}

export default function GameSystem({ achievements, theme }: GameSystemProps) {
  const [showAchievements, setShowAchievements] = useState(false);
  const [newAchievement, setNewAchievement] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const allBadges: Badge[] = [
    { id: 'first-visit', name: 'Welcome!', description: 'Visited the website for the first time', emoji: '👋', unlocked: false, requirement: 'First Visit' },
    { id: 'celebration', name: 'Party Starter', description: 'Triggered a celebration animation', emoji: '🎉', unlocked: false, requirement: 'Celebration Master' },
    { id: 'letter-reader', name: 'Dear Sister', description: 'Read the heartfelt letter', emoji: '💌', unlocked: false, requirement: 'Letter Reader' },
    { id: 'memory-explorer', name: 'Memory Lane', description: 'Viewed the photo memories', emoji: '📸', unlocked: false, requirement: 'Memory Explorer' },
    { id: 'photo-uploader', name: 'Photo Artist', description: 'Uploaded photos to the shape creator', emoji: '🖼️', unlocked: false, requirement: 'Photo Uploader' },
    { id: 'shape-designer', name: 'Shape Master', description: 'Arranged photos in a beautiful shape', emoji: '✨', unlocked: false, requirement: 'Shape Designer' },
    { id: 'task-creator', name: 'Goal Setter', description: 'Added tasks to the todo manager', emoji: '📝', unlocked: false, requirement: 'Task Creator' },
    { id: 'task-completer', name: 'Achiever', description: 'Completed tasks successfully', emoji: '✅', unlocked: false, requirement: 'Task Completer' },
    { id: 'message-writer', name: 'Note Taker', description: 'Left messages on the wall', emoji: '📮', unlocked: false, requirement: 'Message Writer' },
    { id: 'mood-tracker', name: 'Self Aware', description: 'Tracked daily mood', emoji: '😊', unlocked: false, requirement: 'Mood Tracker' },
    { id: 'journal-writer', name: 'Storyteller', description: 'Wrote in the creative journal', emoji: '📔', unlocked: false, requirement: 'Journal Writer' },
    { id: 'creative-thinker', name: 'Creative Mind', description: 'Started a new journal entry', emoji: '💭', unlocked: false, requirement: 'Creative Thinker' }
  ];

  const [badges, setBadges] = useState<Badge[]>(allBadges);

  // Update badges when achievements change
  useEffect(() => {
    const updatedBadges = badges.map(badge => ({
      ...badge,
      unlocked: achievements.includes(badge.requirement)
    }));
    
    setBadges(updatedBadges);
    
    // Check for new achievements
    const newlyUnlocked = updatedBadges.filter(badge => 
      badge.unlocked && !badges.find(b => b.id === badge.id)?.unlocked
    );
    
    if (newlyUnlocked.length > 0) {
      setNewAchievement(newlyUnlocked[0].name);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setNewAchievement('');
      }, 3000);
    }
  }, [achievements]);

  const unlockedCount = badges.filter(badge => badge.unlocked).length;
  const progressPercentage = (unlockedCount / badges.length) * 100;

  return (
    <>
      {/* Achievement Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className={`relative w-16 h-16 bg-${theme.accent} rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer`}
        >
          <span className="text-2xl">🏆</span>
          
          {/* Badge Counter */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-gray-800">{unlockedCount}</span>
          </div>

          {/* Glow effect for new achievements */}
          {newAchievement && (
            <div className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-60"></div>
          )}
        </button>
      </div>

      {/* Achievement Panel */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-['Pacifico'] text-white">
                Achievements 🏆
              </h2>
              <button
                onClick={() => setShowAchievements(false)}
                className="text-white/70 hover:text-white text-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-white/80 mb-2">
                <span>Progress</span>
                <span>{unlockedCount}/{badges.length}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className={`bg-gradient-to-r from-${theme.accent} to-${theme.secondary} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-center mt-2">
                <span className="text-lg font-semibold text-white">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400/50'
                      : 'bg-white/10 border-2 border-white/20 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-3xl mb-2 ${badge.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                      {badge.emoji}
                    </div>
                    <h3 className={`font-semibold mb-1 ${badge.unlocked ? 'text-yellow-300' : 'text-white/60'}`}>
                      {badge.name}
                    </h3>
                    <p className="text-xs text-white/70 leading-tight">
                      {badge.description}
                    </p>
                    {badge.unlocked && (
                      <div className="mt-2 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                        Unlocked!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Motivational Message */}
            <div className="mt-8 text-center">
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-2xl mb-2">💕</div>
                <p className="text-white/80">
                  {unlockedCount === badges.length
                    ? "Amazing! You've unlocked everything! You're the best sister ever! 🌟"
                    : `You're doing great! ${badges.length - unlockedCount} more achievements to unlock!`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Achievement Celebration */}
      {showCelebration && newAchievement && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce">
            <div className="text-center">
              <div className="text-3xl mb-2">🎉</div>
              <div className="text-xl font-bold">Achievement Unlocked!</div>
              <div className="text-lg">{newAchievement}</div>
            </div>
          </div>
          
          {/* Confetti */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: `${12 + Math.random() * 8}px`
                }}
              >
                {['🎊', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall 3s linear forwards;
        }
      `}</style>
    </>
  );
}
