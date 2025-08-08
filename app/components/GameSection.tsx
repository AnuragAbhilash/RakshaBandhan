'use client';

import { useState, useEffect, memo } from 'react';

interface GameSectionProps {
  theme: any;
  onAchievement: (achievement: string) => void;
}

export default function GameSection({ theme, onAchievement }: GameSectionProps) {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [gameStats, setGameStats] = useState<Record<string, number>>({});

  const games = [
    {
      id: 'memory',
      name: 'Sister Memory Match',
      emoji: '🧠',
      description: 'Match the sister-themed pairs!',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'quiz',
      name: 'Family Love Quiz',
      emoji: '🤔',
      description: 'Test your family knowledge!',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'rapidtap',
      name: 'Rakhi Rapid Tap',
      emoji: '👆',
      description: 'Tap the rakhi as fast as you can!',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'wishcollector',
      name: 'Wish Collector',
      emoji: '✨',
      description: 'Collect blessings for your sister!',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('rakhi-game-stats');
    if (saved) {
      setGameStats(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rakhi-game-stats', JSON.stringify(gameStats));
  }, [gameStats]);

  const updateGameStats = (gameId: string, score: number) => {
    setGameStats(prev => ({
      ...prev,
      [gameId]: Math.max(prev[gameId] || 0, score)
    }));
    onAchievement('Game Master');
  };

  const closeGame = () => {
    setCurrentGame(null);
  };

  return (
    <section className="py-12 px-4 relative overflow-hidden min-h-screen">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['💖', '🎀', '🌸', '🦋', '💝', '🌟', '💕', '🎁'][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Dancing_Script']">
            Fun Zone 🎮
          </h2>
          <p className="text-xl text-white/90">
            Play these special games made with love for you!
          </p>
        </div>

        {!currentGame ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className={`bg-gradient-to-br ${game.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
                onClick={() => {
                  setCurrentGame(game.id);
                  onAchievement('Game Explorer');
                }}
              >
                <div className="flex flex-col items-center text-center text-white">
                  <div className="text-5xl mb-4">{game.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                  <p className="mb-4">{game.description}</p>
                  {gameStats[game.id] && (
                    <div className="bg-white/20 rounded-full px-4 py-1 text-sm">
                      🏆 High Score: {gameStats[game.id]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
            <button
              onClick={closeGame}
              className="mb-4 px-4 py-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              ← Back to Games
            </button>
            
            <div className="mt-4">
              {currentGame === 'memory' && (
                <MemoryGame 
                  onScore={(score) => updateGameStats('memory', score)} 
                  theme={theme}
                />
              )}
              {currentGame === 'quiz' && (
                <FamilyQuiz 
                  onScore={(score) => updateGameStats('quiz', score)} 
                  theme={theme}
                />
              )}
              {currentGame === 'rapidtap' && (
                <RapidTapGame 
                  onScore={(score) => updateGameStats('rapidtap', score)} 
                  theme={theme}
                />
              )}
              {currentGame === 'wishcollector' && (
                <WishCollector 
                  onScore={(score) => updateGameStats('wishcollector', score)} 
                  theme={theme}
                />
              )}
            </div>
          </div>
        )}

        {/* Game Stats */}
        {Object.keys(gameStats).length > 0 && !currentGame && (
          <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Your Game Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                <div className="text-2xl">🎮</div>
                <div>{Object.keys(gameStats).length} Games Played</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-3 text-center">
                <div className="text-2xl">⭐</div>
                <div>Total Score: {Object.values(gameStats).reduce((a, b) => a + b, 0)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

// Enhanced Memory Game Component
const MemoryGame = memo(function MemoryGame({ onScore, theme }: { onScore: (score: number) => void; theme: any }) {
  const [cards, setCards] = useState<{emoji: string, id: number}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(60);

  const sisterEmojis = ['💖', '🎀', '👭', '🌸', '🦋', '💝', '🌟', '💕'];

  useEffect(() => {
    // Initialize game
    const gameCards = [...sisterEmojis, ...sisterEmojis]
      .map((emoji, i) => ({ emoji, id: i }))
      .sort(() => Math.random() - 0.5);
    setCards(gameCards);

    // Start timer
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const flipCard = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index) || timer === 0) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      setTimeout(() => {
        if (cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji) {
          const newMatched = [...matched, ...newFlipped];
          setMatched(newMatched);
          if (newMatched.length === cards.length) {
            setGameComplete(true);
            const score = Math.max(100 - moves + timer * 2, 10);
            onScore(score);
          }
        }
        setFlipped([]);
      }, 500);
    }
  };

  const restartGame = () => {
    setCards([...sisterEmojis, ...sisterEmojis]
      .map((emoji, i) => ({ emoji, id: i }))
      .sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameComplete(false);
    setTimer(60);
  };

  return (
    <div className="text-center">
      <div className="flex justify-center gap-4 mb-6">
        <div className={`${theme.cardBg} px-4 py-2 rounded-lg`}>
          ⏳ Time: {timer}s
        </div>
        <div className={`${theme.cardBg} px-4 py-2 rounded-lg`}>
          🎯 Moves: {moves}
        </div>
        <div className={`${theme.cardBg} px-4 py-2 rounded-lg`}>
          ❤️ Matched: {matched.length / 2}/{sisterEmojis.length}
        </div>
      </div>

      {gameComplete ? (
        <div className={`${theme.cardBg} p-6 rounded-2xl mb-6`}>
          <div className="text-5xl mb-4 animate-bounce">🎉</div>
          <h3 className="text-2xl font-bold mb-2">You Won!</h3>
          <p className="mb-4">You matched all pairs in {moves} moves with {timer} seconds left!</p>
          <button
            onClick={restartGame}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full font-bold"
          >
            Play Again
          </button>
        </div>
      ) : timer === 0 ? (
        <div className={`${theme.cardBg} p-6 rounded-2xl mb-6`}>
          <div className="text-5xl mb-4">⏰</div>
          <h3 className="text-2xl font-bold mb-2">Time's Up!</h3>
          <p className="mb-4">You matched {matched.length / 2} out of {sisterEmojis.length} pairs.</p>
          <button
            onClick={restartGame}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full font-bold"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => flipCard(index)}
              className={`aspect-square flex items-center justify-center text-3xl rounded-lg transition-all duration-300 ${
                flipped.includes(index) || matched.includes(index)
                  ? 'bg-white text-gray-800'
                  : 'bg-gradient-to-br from-purple-500/40 to-pink-500/40 text-white/90 hover:bg-gradient-to-br from-purple-500/60 to-pink-500/60'
              } ${
                matched.includes(index) ? 'animate-pulse' : ''
              }`}
            >
              {flipped.includes(index) || matched.includes(index) ? card.emoji : '?'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// Enhanced Family Quiz Component
const FamilyQuiz = memo(function FamilyQuiz({ onScore, theme }: { onScore: (score: number) => void; theme: any }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = [
    {
      question: "What makes sisters so special?",
      answers: [
        "Their unconditional love",
        "Their caring nature",
        "Their ability to always cheer you up",
        "All of the above!"
      ],
      correct: 3
    },
    {
      question: "What's the best Raksha Bandhan gift?",
      answers: [
        "Expensive presents",
        "Handmade rakhi",
        "Quality time together",
        "A heartfelt promise to always protect"
      ],
      correct: 3
    },
    {
      question: "When you feel sad, what should you remember?",
      answers: [
        "Your brothers are always there for you",
        "You're stronger than you think",
        "This too shall pass",
        "All of these comforting thoughts"
      ],
      correct: 3
    }
  ];

  const answerQuestion = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    setTimeout(() => {
      if (answerIndex === questions[currentQuestion].correct) {
        setScore(score + 1);
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizComplete(true);
        onScore(Math.floor((score + (answerIndex === questions[currentQuestion].correct ? 1 : 0)) / questions.length * 100));
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
  };

  return (
    <div className="text-center">
      {quizComplete ? (
        <div className={`${theme.cardBg} p-6 rounded-2xl mb-6`}>
          <div className="text-5xl mb-4 animate-bounce">🏆</div>
          <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
          <p className="text-xl mb-4">You scored {score} out of {questions.length}!</p>
          <p className="mb-6">
            {score === questions.length ? "Perfect! You know what makes sisters special!" :
             score >= questions.length / 2 ? "Great job! You understand sisterly love!" :
             "Keep learning about the beautiful bond between siblings!"}
          </p>
          <button
            onClick={restartQuiz}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <div className={`${theme.cardBg} px-4 py-2 rounded-lg`}>
              Question {currentQuestion + 1}/{questions.length}
            </div>
            <div className={`${theme.cardBg} px-4 py-2 rounded-lg ml-4`}>
              Score: {score}
            </div>
          </div>

          <div className={`${theme.cardBg} p-6 rounded-2xl mb-6`}>
            <h3 className="text-xl font-bold mb-6">{questions[currentQuestion].question}</h3>
            
            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
              {questions[currentQuestion].answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && answerQuestion(index)}
                  disabled={showResult}
                  className={`p-3 rounded-lg transition-all ${
                    showResult
                      ? index === questions[currentQuestion].correct
                        ? 'bg-green-500 text-white'
                        : index === selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white/80'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

// Rapid Tap Game - Fun and simple
const RapidTapGame = memo(function RapidTapGame({ onScore, theme }: { onScore: (score: number) => void; theme: any }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [taps, setTaps] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setGameComplete(true);
      onScore(taps);
    }
    return () => clearInterval(interval);
  }, [gameActive, timeLeft]);

  const handleTap = () => {
    if (!gameActive && timeLeft === 10) {
      setGameActive(true);
    }
    if (gameActive) {
      setTaps(prev => prev + 1);
    }
  };

  const restartGame = () => {
    setTimeLeft(10);
    setTaps(0);
    setGameActive(false);
    setGameComplete(false);
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-6">Rakhi Rapid Tap</h3>
      
      {gameComplete ? (
        <div className={`${theme.cardBg} p-6 rounded-2xl mb-6`}>
          <div className="text-5xl mb-4">🎀</div>
          <p className="text-xl mb-2">You tapped {taps} times in 10 seconds!</p>
          <p className="mb-4">That's {Math.floor(taps / 10)} taps per second!</p>
          <button
            onClick={restartGame}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-bold"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-4 mb-6">
            <div className={`${theme.cardBg} px-4 py-2 rounded-lg`}>
              ⏱️ Time: {timeLeft}s
            </div>
            <div className={`${theme.cardBg} px-4 py-2 rounded-lg`}>
              👆 Taps: {taps}
            </div>
          </div>

          <div
            onClick={handleTap}
            className={`mx-auto w-48 h-48 rounded-full flex items-center justify-center text-5xl cursor-pointer transition-all ${
              gameActive
                ? 'bg-gradient-to-br from-pink-500 to-rose-500 animate-pulse'
                : 'bg-gradient-to-br from-purple-500 to-indigo-500'
            }`}
          >
            {gameActive ? 'TAP!' : 'Start!'}
          </div>

          <p className="mt-4 text-sm text-white/80">
            {!gameActive && timeLeft === 10 ? 'Tap the circle to start!' : 'Tap as fast as you can!'}
          </p>
        </>
      )}
    </div>
  );
});

// Wish Collector Game - Collect blessings for sister
const WishCollector = memo(function WishCollector({ onScore, theme }: { onScore: (score: number) => void; theme: any }) {
  const [wishes, setWishes] = useState<string[]>([]);
  const [collected, setCollected] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const blessings = [
    "💖 Happiness", "🌟 Success", "🌈 Joy", "🌺 Health",
    "✨ Prosperity", "🎯 Achievements", "🌸 Love", "🦋 Peace"
  ];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      const wishInterval = setInterval(() => {
        if (wishes.length < 8) {
          const randomBlessing = blessings[Math.floor(Math.random() * blessings.length)];
          setWishes(prev => [...prev, randomBlessing]);
        }
      }, 1500);

      return () => {
        clearInterval(timer);
        clearInterval(wishInterval);
      };
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setGameComplete(true);
      onScore(collected * 10);
    }
  }, [gameActive, timeLeft, wishes.length]);

  const collectWish = (index: number) => {
    setCollected(prev => prev + 1);
    setWishes(prev => prev.filter((_, i) => i !== index));
  };

  const startGame = () => {
    setWishes([]);
    setCollected(0);
    setTimeLeft(30);
    setGameActive(true);
    setGameComplete(false);
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-6">Collect Blessings for Your Sister</h3>
      
      {gameComplete ? (
        <div className={`${theme.cardBg} p-6 rounded-2xl mb-6`}>
          <div className="text-5xl mb-4">✨</div>
          <p className="text-xl mb-2">You collected {collected} blessings!</p>
          <p className="mb-4">Your sister will be so happy with all these good wishes!</p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full font-bold"
          >
            Collect More
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-4 mb-6">
            <div className={`${theme.cardBg} px-4 py-2 rounded-lg`}>
              ⏱️ Time: {timeLeft}s
            </div>
            <div className={`${theme.cardBg} px-4 py-2 rounded-lg`}>
              ✨ Collected: {collected}
            </div>
          </div>

          {!gameActive ? (
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-lg"
            >
              Start Collecting Blessings
            </button>
          ) : (
            <div className="min-h-40">
              {wishes.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {wishes.map((wish, index) => (
                    <button
                      key={index}
                      onClick={() => collectWish(index)}
                      className="p-3 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-lg hover:scale-105 transition-all"
                    >
                      {wish}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-white/70">Waiting for blessings to appear...</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
});
