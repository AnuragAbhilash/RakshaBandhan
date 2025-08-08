'use client';

import { useState, useEffect } from 'react';

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  message: string;
  date: string;
  note: string;
  createdAt: Date;
}

interface EnhancedMoodTrackerProps {
  theme: any;
  onAchievement: (achievement: string) => void;
}

export default function EnhancedMoodTracker({ theme, onAchievement }: EnhancedMoodTrackerProps) {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [showMessage, setShowMessage] = useState(false);
  const [currentJoke, setCurrentJoke] = useState('');
  const [weeklyFeedback, setWeeklyFeedback] = useState('');
  const [showJoke, setShowJoke] = useState(false);
  const [personalNote, setPersonalNote] = useState('');

  const moodOptions = [
    { 
      name: 'Ecstatic', 
      emoji: '🤩', 
      color: 'from-yellow-400 to-orange-500', 
      message: "You're absolutely radiant today! Your energy is contagious and inspiring! ✨🌟",
      encouragement: "Channel this amazing energy into something creative today!"
    },
    { 
      name: 'Happy', 
      emoji: '😊', 
      color: 'from-green-400 to-emerald-500', 
      message: "Your beautiful smile lights up the world! Keep spreading that joy! 💖😊",
      encouragement: "Your happiness is a gift to everyone around you!"
    },
    { 
      name: 'Content', 
      emoji: '😌', 
      color: 'from-blue-400 to-cyan-500', 
      message: "Inner peace suits you perfectly! You're in such a wonderful place right now! 🕊️💙",
      encouragement: "This peaceful energy is exactly what you need. Enjoy this moment!"
    },
    { 
      name: 'Okay', 
      emoji: '😐', 
      color: 'from-gray-400 to-slate-500', 
      message: "Every day doesn't have to be extraordinary, and that's perfectly okay! 🤗💝",
      encouragement: "Tomorrow brings new possibilities. Be gentle with yourself!"
    },
    { 
      name: 'Tired', 
      emoji: '😴', 
      color: 'from-purple-400 to-indigo-500', 
      message: "Rest is not weakness, it's wisdom! Take the break you deserve! 💤🌙",
      encouragement: "Listen to your body. Self-care is the best care!"
    },
    { 
      name: 'Stressed', 
      emoji: '😰', 
      color: 'from-orange-500 to-red-500', 
      message: "Take a deep breath, beautiful soul. This too shall pass! 🫧💪",
      encouragement: "You've overcome every challenge before. You're stronger than you know!"
    },
    { 
      name: 'Sad', 
      emoji: '😔', 
      color: 'from-blue-500 to-indigo-600', 
      message: "It's okay to feel sad sometimes. Your feelings are valid and you're not alone! 🤗💙",
      encouragement: "Sadness is just a visitor, not a permanent resident. Better days are coming!",
      joke: true
    },
    { 
      name: 'Anxious', 
      emoji: '😨', 
      color: 'from-yellow-500 to-orange-600', 
      message: "You're braver than you believe and stronger than you seem! 🦋💛",
      encouragement: "Anxiety is just excitement without breath. Let's breathe together!",
      joke: true
    }
  ];

  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything! 😄 Just like how you make up my world with happiness!",
    "What do you call a bear with no teeth? A gummy bear! 🐻 Sweet just like you!",
    "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾 Just like how you're outstanding in life!",
    "What do you call a sleeping bull? A bulldozer! 😴 Time to rest like a champion!",
    "Why don't eggs tell jokes? They'd crack each other up! 🥚 But you never fail to crack me up with joy!",
    "What's orange and sounds like a parrot? A carrot! 🥕 Silly, but it made you smile, right?",
    "Why did the math book look so sad? Because it had too many problems! 📚 Unlike you, who solves problems with grace!",
    "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks! 🦕 But you always drive through life successfully!"
  ];

  // Load moods from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rakhi-enhanced-moods');
    if (saved) {
      setMoods(JSON.parse(saved));
    }
  }, []);

  // Save moods to localStorage
  useEffect(() => {
    localStorage.setItem('rakhi-enhanced-moods', JSON.stringify(moods));
  }, [moods]);

  // Generate weekly feedback
  useEffect(() => {
    if (moods.length > 0) {
      generateWeeklyFeedback();
    }
  }, [moods]);

  const selectMood = (moodOption: any) => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = moods.find(mood => mood.date === today);
    
    const moodEntry = {
      id: existingEntry?.id || Date.now().toString(),
      mood: moodOption.name,
      emoji: moodOption.emoji,
      message: moodOption.message,
      date: today,
      note: personalNote,
      createdAt: existingEntry?.createdAt || new Date()
    };

    if (existingEntry) {
      setMoods(prev => prev.map(mood => 
        mood.date === today ? moodEntry : mood
      ));
    } else {
      setMoods(prev => [...prev, moodEntry]);
    }
    
    setSelectedMood(moodOption.name);
    setShowMessage(true);
    
    // Show joke for sad/anxious moods
    if (moodOption.joke) {
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      setCurrentJoke(randomJoke);
      setShowJoke(true);
    }
    
    setTimeout(() => {
      setShowMessage(false);
      setShowJoke(false);
    }, 8000);
    
    setPersonalNote('');
    onAchievement('Mood Tracker Master');
  };

  const generateWeeklyFeedback = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyMoods = moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate >= weekAgo && moodDate <= today;
    });

    if (weeklyMoods.length === 0) return;

    const moodCounts = weeklyMoods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    const positiveCount = weeklyMoods.filter(mood => 
      ['Ecstatic', 'Happy', 'Content'].includes(mood.mood)
    ).length;

    const percentage = Math.round((positiveCount / weeklyMoods.length) * 100);

    let feedback = '';
    if (percentage >= 80) {
      feedback = `🌟 Amazing week! You've been radiating positivity ${percentage}% of the time! Your dominant mood was "${dominantMood}" - keep shining, beautiful!`;
    } else if (percentage >= 60) {
      feedback = `💖 Great week! You maintained positive energy ${percentage}% of the time. Your most common mood was "${dominantMood}". You're doing wonderfully!`;
    } else if (percentage >= 40) {
      feedback = `🌈 Balanced week! You experienced "${dominantMood}" most often. Remember, it's okay to have ups and downs - that's what makes us human!`;
    } else {
      feedback = `🤗 Challenging week with "${dominantMood}" being most common. Remember, tough times don't last, but tough people like you do! You're amazing!`;
    }

    setWeeklyFeedback(feedback);
  };

  const getTodaysMood = () => {
    const today = new Date().toISOString().split('T')[0];
    return moods.find(mood => mood.date === today);
  };

  const getWeeklyMoods = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate >= weekAgo && moodDate <= today;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const todaysMood = getTodaysMood();
  const weeklyMoods = getWeeklyMoods();

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {['😊', '💖', '🌟', '✨', '🎉'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-['Dancing_Script'] text-transparent bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text font-bold mb-6 animate-pulse">
            Mood Tracker 🌈
          </h2>
          <p className="text-2xl text-white font-['Quicksand'] font-medium">
            Track your emotions and get personalized support! 💝
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mood Selection */}
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h3 className="text-3xl font-['Dancing_Script'] text-white mb-6 text-center font-bold">
              How are you feeling today? 💭
            </h3>
            
            {todaysMood && (
              <div className="mb-8 p-6 bg-white/20 rounded-2xl text-center animate-pulse-gentle">
                <p className="text-white/90 mb-3 font-['Quicksand']">Today you're feeling:</p>
                <div className="text-6xl mb-3">{todaysMood.emoji}</div>
                <p className="text-2xl font-bold text-white mb-2 font-['Dancing_Script']">{todaysMood.mood}</p>
                {todaysMood.note && (
                  <p className="text-white/80 italic font-['Quicksand']">"{todaysMood.note}"</p>
                )}
              </div>
            )}

            {/* Personal Note */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2 font-['Quicksand']">
                Add a personal note (optional):
              </label>
              <input
                type="text"
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                placeholder="What's happening today?"
                className="w-full px-4 py-3 bg-white/20 rounded-xl text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                maxLength={100}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => selectMood(mood)}
                  className={`p-6 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-br ${mood.color} hover:shadow-2xl group cursor-pointer border-2 border-white/20`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3 group-hover:animate-bounce">
                      {mood.emoji}
                    </div>
                    <div className="text-lg font-bold text-white font-['Quicksand']">
                      {mood.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Encouraging Message */}
            {showMessage && todaysMood && (
              <div className="mt-6 p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl animate-fade-in border border-pink-300/30">
                <div className="text-center">
                  <div className="text-4xl mb-3 animate-bounce">💕</div>
                  <p className="text-white font-medium font-['Quicksand'] text-lg leading-relaxed">
                    {todaysMood.message}
                  </p>
                </div>
              </div>
            )}

            {/* Joke Section */}
            {showJoke && currentJoke && (
              <div className="mt-6 p-6 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl animate-bounce-in border border-yellow-300/30">
                <div className="text-center">
                  <div className="text-4xl mb-3">😄</div>
                  <h4 className="text-xl font-bold text-white mb-3 font-['Dancing_Script']">
                    Here's a joke to brighten your day!
                  </h4>
                  <p className="text-white font-['Quicksand'] leading-relaxed">
                    {currentJoke}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mood History & Weekly Feedback */}
          <div className="space-y-8">
            {/* Weekly Feedback */}
            {weeklyFeedback && (
              <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-3xl font-['Dancing_Script'] text-white mb-6 text-center font-bold">
                  Weekly Reflection 📊
                </h3>
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-300/30">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📈</div>
                    <p className="text-white font-['Quicksand'] text-lg leading-relaxed">
                      {weeklyFeedback}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mood History */}
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h3 className="text-3xl font-['Dancing_Script'] text-white mb-6 text-center font-bold">
                Your Mood Journey 📖
              </h3>
              
              {weeklyMoods.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-4 animate-bounce">📊</div>
                  <p className="text-white/60 text-xl font-['Quicksand']">
                    Start tracking your mood to see your progress!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {weeklyMoods.map((mood) => (
                    <div
                      key={mood.id}
                      className="flex items-start gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300"
                    >
                      <div className="text-3xl">{mood.emoji}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-white font-semibold font-['Quicksand']">{mood.mood}</div>
                          <div className="text-white/60 text-sm font-['Quicksand']">
                            {new Date(mood.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        {mood.note && (
                          <p className="text-white/80 text-sm italic font-['Quicksand']">
                            "{mood.note}"
                          </p>
                        )}
                        {mood.date === new Date().toISOString().split('T')[0] && (
                          <span className="inline-block mt-2 text-xs bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 rounded-full text-white">
                            Today
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mood Stats */}
              {weeklyMoods.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-white">{weeklyMoods.length}</div>
                    <div className="text-white/80 text-sm font-['Quicksand']">Days Tracked</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-white">
                      {Math.round((weeklyMoods.filter(m => ['Ecstatic', 'Happy', 'Content'].includes(m.mood)).length / weeklyMoods.length) * 100) || 0}%
                    </div>
                    <div className="text-white/80 text-sm font-['Quicksand']">Positive Days</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}