'use client';

import { useState } from 'react';

interface SurpriseSectionProps {
  theme: any;
}

export default function SurpriseSection({ theme }: SurpriseSectionProps) {
  const [showLetter, setShowLetter] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);

  const revealSurprise = (type: 'letter' | 'photos') => {
    if (type === 'letter') {
      setShowLetter(true);
      setCurrentPoemIndex(0);
    } else {
      setShowPhotos(true);
    }
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const memoryPhotos = [
    {
      url: "https://readdy.ai/api/search-image?query=happy%20sisters%20laughing%20together%20in%20a%20beautiful%20garden%20with%20flowers%2C%20Indian%20family%20celebration%2C%20warm%20golden%20sunlight%2C%20traditional%20colorful%20dresses%2C%20joyful%20expressions%2C%20sisterly%20bond%2C%20candid%20photography%20style%2C%20natural%20poses%2C%20beautiful%20background&width=400&height=300&seq=memory-001&orientation=landscape",
      caption: "Our Garden Adventures"
    },
    {
      url: "https://readdy.ai/api/search-image?query=two%20sisters%20sharing%20sweets%20during%20festival%20celebration%2C%20traditional%20Indian%20sweets%20and%20decorations%2C%20colorful%20rangoli%20in%20background%2C%20festive%20atmosphere%2C%20sister%20love%20and%20bonding%2C%20warm%20lighting%2C%20beautiful%20traditional%20outfits%2C%20happy%20faces&width=400&height=300&seq=memory-002&orientation=landscape",
      caption: "Festival Sweet Moments"
    },
    {
      url: "https://readdy.ai/api/search-image?query=sisters%20playing%20games%20together%20indoors%2C%20cozy%20home%20environment%2C%20board%20games%20and%20books%20around%2C%20comfortable%20casual%20clothes%2C%20laughing%20and%20having%20fun%2C%20warm%20indoor%20lighting%2C%20sibling%20bonding%20time%2C%20playful%20atmosphere&width=400&height=300&seq=memory-003&orientation=landscape",
      caption: "Game Night Fun"
    },
    {
      url: "https://readdy.ai/api/search-image?query=sisters%20studying%20together%20with%20books%20and%20notebooks%2C%20helping%20each%20other%20with%20homework%2C%20warm%20study%20room%20lighting%2C%20educational%20materials%20around%2C%20supportive%20sibling%20relationship%2C%20focused%20yet%20happy%20expressions%2C%20academic%20achievement&width=400&height=300&seq=memory-004&orientation=landscape",
      caption: "Study Sessions"
    }
  ];

  const brotherPoems = [
    {
      name: "Baru",
      poem: `Two stars that light my sky so wide,
One with wisdom, one with pride.
Sumi guides with steady grace,
Fuchi brings joy in every space.
Through every storm, you both remain,
My shelter in laughter, balm in pain.
Different notes in the same sweet song,
With you two, I feel strong.
Sisters by blood, but more by soul,
Together you make my spirit whole.`
    },
    {
      name: "Chhotu",
      poem: `We’ve built a world of silly talks,
Of quiet tears and midnight walks.
Sumi, you lead with thoughtful might,
Fuchi, you dance in colors bright.
You're my chaos, you're my calm,
My push ahead, my healing balm.
The world may turn a thousand ways,
But your love steadies all my days.
A trio bound, no end, no start—
Two pieces stitched into my heart.`
    },
    {
      name: "Ramu",
      poem: `Like threads of Rakhi wrapped in gold,
You both are stories I've been told.
Of care that shields, of fights that teach,
Of dreams that always felt in reach.
Sumi, you’re my northern light,
Fuchi, you’re my morning bright.
Together you make life feel new,
Old scars heal when I'm with you.
A brother’s heart, proud and true—
Beats stronger just because of you.`
    },
    {
      name: "Sofu",
      poem: `In every chapter of my days,
You’ve been my strength in countless ways.
Sumi, with calm and wisdom deep,
Fuchi, with laughter you always keep.
You held my hands when I felt lost,
No matter the storm, you bore the cost.
We grew in love, in fights, in fun,
Three souls orbiting the same sun.
No gift on Earth, no grander feat—
Than calling you both my heartbeat`
    },
    {
      name: "Jhamku",
      poem: `Between your words, I find my peace,
A kind of magic that doesn't cease.
Sumi speaks truth like a guiding flame,
Fuchi sparks joy like a wild game.
In your eyes, I see my home,
A place where I can safely roam.
Through silly fights and honest care,
I’ve found my heaven, always there.
You two are mirrors, stars, and skies—
My sisters, my truth, my sweetest ties.`
    },
    {
      name: "Piku",
      poem: `My Sumi Didi is very kind,
She helps me when I fall behind.
Fuchi Didi plays with me,
She laughs so much and climbs the tree!
They both give me lots of love,
Like angels sent from up above.
We eat, we talk, we sing and play,
They make me smile every day.
I love my Didis big and small,
They’re the best sisters of them all!`
    }
  ];

  const nextPoem = () => {
    setCurrentPoemIndex((prev) => (prev + 1) % brotherPoems.length);
  };

  const prevPoem = () => {
    setCurrentPoemIndex((prev) => (prev - 1 + brotherPoems.length) % brotherPoems.length);
  };

  return (
    <section className="py-12 md:py-20 px-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`
            }}
          >
            {['🌸', '✨', '💖', '🎀', '🦋'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-['Pacifico'] text-white mb-4 animate-bounce">
            Brothers' Special Surprises 🎁
          </h2>
          <p className="text-lg md:text-xl text-white/80">
            We've prepared something special just for you...
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Poem Letter */}
          <div className={`bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 transition-all duration-500 hover:bg-white/20 ${showLetter ? 'ring-4 ring-white/30' : ''}`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-3xl">💌</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Poems From Your Brothers
              </h3>
              {!showLetter ? (
                <button
                  onClick={() => revealSurprise('letter')}
                  className={`px-6 py-3 bg-${theme.accent} text-white rounded-full hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl`}
                >
                  Read Our Letters 💕
                </button>
              ) : (
                <div className="text-center bg-white/20 rounded-2xl p-6 animate-fade-in">
                  <div className="text-white space-y-6">
                    <div className="min-h-[200px] flex flex-col justify-center">
                      <p className="font-medium text-lg mb-2">{brotherPoems[currentPoemIndex].name}</p>
                      <p className="text-sm text-gray-300 mb-4 underline">
                        A heartfelt message from your brother
                      </p>
                      <p className="whitespace-pre-line italic text-lg">
                        {brotherPoems[currentPoemIndex].poem}
                      </p>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button 
                        onClick={prevPoem}
                        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        &larr;
                      </button>
                      <span className="flex items-center">
                        {currentPoemIndex + 1} / {brotherPoems.length}
                      </span>
                      <button 
                        onClick={nextPoem}
                        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Photo Album */}
          <div className={`bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 transition-all duration-500 hover:bg-white/20 ${showPhotos ? 'ring-4 ring-white/30' : ''}`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Our Virtual Memory Album
              </h3>
              {!showPhotos ? (
                <button
                  onClick={() => revealSurprise('photos')}
                  className={`px-6 py-3 bg-${theme.accent} text-white rounded-full hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl`}
                >
                  See Our Memories 📷
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:gap-4 animate-fade-in">
                  {memoryPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative group overflow-hidden rounded-xl aspect-square"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <div className="text-white text-sm font-medium">
                          {photo.caption}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(100)].map((_, i) => {
            const startX = Math.random() > 0.5 ? -50 : window.innerWidth + 50;
            const startY = Math.random() > 0.5 ? -50 : window.innerHeight + 50;
            const endX = Math.random() * window.innerWidth;
            const endY = Math.random() * window.innerHeight;
            
            return (
              <div
                key={i}
                className="absolute animate-emoji-storm"
                style={{
                  left: `${startX}px`,
                  top: `${startY}px`,
                  fontSize: `${12 + Math.random() * 24}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 3}s`,
                  // @ts-ignore - temporary ignore for custom properties
                  '--endX': `${endX}px`,
                  '--endY': `${endY}px`,
                }}
              >
                {['🎊', '💖', '⭐', '🌸', '💕', '🎉', '🌈', '🎀', '🦋', '🌟'][Math.floor(Math.random() * 10)]}
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes emoji-storm {
          0% { 
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% { 
            transform: translate(var(--endX), var(--endY)) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .animate-emoji-storm {
          animation: emoji-storm linear forwards;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}