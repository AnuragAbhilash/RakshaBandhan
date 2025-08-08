'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface PhotoItem {
  id: string;
  url: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  isFlying: boolean;
  targetX?: number;
  targetY?: number;
  zIndex: number;
}

interface ShapePoint {
  x: number;
  y: number;
  rotation: number;
}

export default function PhotoShapeCreator() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedShape, setSelectedShape] = useState<
    'heart' | 'star' | 'flower' | 'circle' | 'butterfly' | 'infinity' | 'rakhi'
  >('heart');
  const [isArranging, setIsArranging] = useState(false);
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced shapes with rotation for each point
  const shapes: Record<string, ShapePoint[]> = {
    heart: Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(angle), 3);
      const y = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
      return { 
        x: 50 + x * 1.5, 
        y: 50 + y * 1.5,
        rotation: angle * (180 / Math.PI)
      };
    }),
    star: Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const radius = i % 2 === 0 ? 20 : 10;
      return {
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        rotation: angle * (180 / Math.PI) + 18
      };
    }),
    flower: Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      const petalSize = 15 + 5 * Math.sin(angle * 5);
      return {
        x: 50 + Math.cos(angle) * petalSize,
        y: 50 + Math.sin(angle) * petalSize,
        rotation: angle * (180 / Math.PI)
      };
    }),
    circle: Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      return {
        x: 50 + Math.cos(angle) * 20,
        y: 50 + Math.sin(angle) * 20,
        rotation: angle * (180 / Math.PI)
      };
    }),
    butterfly: Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * Math.PI * 2;
      const wingX = Math.abs(Math.cos(angle)) * 20;
      const wingY = Math.sin(angle) * 15;
      return {
        x: 50 + (i < 10 ? -wingX : wingX),
        y: 50 + wingY,
        rotation: i < 10 ? -15 : 15
      };
    }),
    infinity: Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const x = 8 * Math.sin(angle);
      const y = 8 * Math.sin(2 * angle);
      return {
        x: 50 + x * 2,
        y: 50 + y * 2,
        rotation: angle * (180 / Math.PI)
      };
    }),
    rakhi: Array.from({ length: 12 }, (_, i) => ({
      x: [50, 40, 60, 35, 65, 30, 70, 35, 65, 40, 60, 50][i],
      y: [20, 25, 25, 35, 35, 50, 50, 65, 65, 75, 75, 80][i],
      rotation: i * 30
    }))
  };

  // Handle file processing
  const processFiles = useCallback((files: FileList) => {
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setTimeout(() => {
            const newPhoto: PhotoItem = {
              id: Date.now().toString() + index,
              url: e.target?.result as string,
              x: Math.random() * 80 + 10,
              y: Math.random() * 80 + 10,
              rotation: Math.random() * 360,
              scale: 0.7 + Math.random() * 0.6,
              isFlying: true,
              zIndex: 10
            };
            
            setPhotos(prev => {
              const updated = [...prev, newPhoto];
              setTimeout(() => {
                setPhotos(current => current.map(p => 
                  p.id === newPhoto.id ? { ...p, isFlying: false, zIndex: 1 } : p
                ));
              }, 100);
              return updated;
            });
          }, index * 150);
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  // File input handler
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) processFiles(files);
  }, [processFiles]);

  // Auto-arrange when shape is selected
  useEffect(() => {
    if (photos.length > 0 && !isArranging) {
      const timer = setTimeout(() => {
        arrangeInShape();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedShape]);

  const arrangeInShape = useCallback(() => {
    if (photos.length === 0 || isArranging) return;
    
    setIsArranging(true);
    const shapePoints = shapes[selectedShape];
    
    // First scatter photos with dramatic animation
    setPhotos(prev => prev.map(photo => ({
      ...photo,
      isFlying: true,
      zIndex: 20,
      targetX: Math.random() * 100,
      targetY: Math.random() * 100,
      rotation: photo.rotation + (Math.random() * 720 - 360),
      scale: 0.5 + Math.random() * 0.5
    })));

    // Then arrange in selected shape with orbiting animation
    setTimeout(() => {
      setPhotos(prev => prev.map((photo, index) => {
        const point = shapePoints[index % shapePoints.length];
        const orbitRadius = 5 + Math.random() * 10;
        const orbitAngle = Math.random() * Math.PI * 2;
        
        return {
          ...photo,
          targetX: point.x + Math.cos(orbitAngle) * orbitRadius,
          targetY: point.y + Math.sin(orbitAngle) * orbitRadius,
          rotation: point.rotation,
          scale: 0.8 + Math.random() * 0.4,
          zIndex: 5
        };
      }));

      // Final positioning with continuous subtle movement
      setTimeout(() => {
        setIsArranging(false);
        startContinuousMotion();
      }, 1200);
    }, 800);
  }, [isArranging, photos.length, selectedShape]);

  const startContinuousMotion = useCallback(() => {
    const interval = setInterval(() => {
      setPhotos(prev => prev.map(photo => {
        if (photo.isFlying || hoveredPhoto === photo.id) return photo;
        
        const subtleMove = Math.random() > 0.7;
        if (subtleMove) {
          return {
            ...photo,
            targetX: photo.x + (Math.random() * 4 - 2),
            targetY: photo.y + (Math.random() * 4 - 2),
            rotation: photo.rotation + (Math.random() * 10 - 5),
            isFlying: true
          };
        }
        return photo;
      }));

      setTimeout(() => {
        setPhotos(prev => prev.map(photo => 
          photo.isFlying && !hoveredPhoto ? { ...photo, isFlying: false } : photo
        ));
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [hoveredPhoto]);

  const handlePhotoHover = useCallback((photoId: string, isHovering: boolean) => {
    setHoveredPhoto(isHovering ? photoId : null);
    if (isHovering) {
      setPhotos(prev => prev.map(photo => {
        if (photo.id === photoId) {
          return {
            ...photo,
            isFlying: true,
            zIndex: 30,
            targetX: photo.x + (Math.random() * 40 - 20),
            targetY: photo.y - 10 - Math.random() * 10,
            rotation: photo.rotation + (Math.random() * 60 - 30),
            scale: photo.scale * 1.3
          };
        }
        return photo;
      }));
    } else {
      setPhotos(prev => prev.map(photo => 
        photo.id === photoId ? { ...photo, isFlying: true, zIndex: 5 } : photo
      ));
      
      // Return to shape position
      const shapePoints = shapes[selectedShape];
      setTimeout(() => {
        setPhotos(prev => prev.map((photo, index) => {
          if (photo.id === photoId) {
            const point = shapePoints[index % shapePoints.length];
            return {
              ...photo,
              targetX: point.x,
              targetY: point.y,
              rotation: point.rotation,
              scale: 0.9,
              isFlying: false
            };
          }
          return photo;
        }));
      }, 200);
    }
  }, [selectedShape]);

  const handleCanvasScroll = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    // Make all photos fly dramatically on scroll
    setPhotos(prev => prev.map(photo => ({
      ...photo,
      isFlying: true,
      zIndex: 20,
      targetX: photo.x + (event.deltaY > 0 ? -50 : 50),
      targetY: photo.y + (Math.random() * 100 - 50),
      rotation: photo.rotation + (event.deltaY > 0 ? 180 : -180),
      scale: Math.max(0.3, Math.min(1.5, photo.scale + (Math.random() * 0.6 - 0.3)))
    })));

    setTimeout(() => {
      setPhotos(prev => prev.map(photo => ({ 
        ...photo, 
        isFlying: false,
        zIndex: 1
      })));
      arrangeInShape();
    }, 1000);
  }, [arrangeInShape]);

  const clearCanvas = useCallback(() => {
    // Animate photos flying away before clearing
    setPhotos(prev => prev.map(photo => ({
      ...photo,
      isFlying: true,
      zIndex: 40,
      targetX: photo.x + (Math.random() > 0.5 ? -200 : 200),
      targetY: photo.y + (Math.random() * 200 - 100),
      rotation: photo.rotation + (Math.random() * 360 - 180),
      scale: 0.1
    })));

    setTimeout(() => {
      setPhotos([]);
    }, 800);
  }, []);

  // Love-themed colors
  const themeColors = {
    primary: 'bg-gradient-to-r from-pink-500 to-rose-500',
    secondary: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    accent: 'bg-gradient-to-r from-rose-400 to-pink-400',
    card: 'bg-gradient-to-br from-pink-500/20 to-purple-500/20',
    button: 'bg-gradient-to-r from-rose-500 to-pink-500'
  };

  return (
    <section className="min-h-screen py-12 px-4 relative overflow-hidden bg-gradient-to-br from-rose-900/50 via-purple-900/50 to-indigo-900/50">
      {/* Floating love-themed elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-love-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              filter: `hue-rotate(${Math.random() * 360}deg)`
            }}
          >
            {['💖', '🌸', '✨', '🎀', '🦋', '💝', '🌹', '🥀', '💐', '🌺'][Math.floor(Math.random() * 10)]}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300 mb-4 font-['Dancing_Script']">
             Photo Magic ✨
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto">
            Create beautiful photo arrangements with your loving brothers!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="space-y-6">
            <div className={`${themeColors.card} backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20`}>
              <h3 className="text-2xl font-bold text-white mb-6 text-center font-['Pacifico']">
                ✨ Create Magic
              </h3>
              
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full px-6 py-4 ${themeColors.button} text-white rounded-xl hover:scale-105 transition-all duration-300 mb-6 font-bold text-lg shadow-lg hover:shadow-xl`}
              >
                📸 Upload Photos
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Shape Selection */}
              <div className="mb-6">
                <h4 className="text-white text-lg font-semibold mb-3 text-center">
                  Choose a Shape:
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {Object.keys(shapes).map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(shape as any)}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        selectedShape === shape 
                          ? `${themeColors.button} text-white scale-105 shadow-md`
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <div className="text-2xl">
                        {shape === 'heart' && '💖'}
                        {shape === 'star' && '⭐'}
                        {shape === 'flower' && '🌸'}
                        {shape === 'circle' && '🔵'}
                        {shape === 'butterfly' && '🦋'}
                        {shape === 'infinity' && '∞'}
                        {shape === 'rakhi' && '🎀'}
                      </div>
                      <div className="text-xs mt-1 capitalize">
                        {shape}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={arrangeInShape}
                  disabled={photos.length === 0 || isArranging}
                  className={`w-full px-4 py-3 ${themeColors.accent} text-white rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 font-medium shadow-md ${
                    isArranging ? 'animate-pulse' : ''
                  }`}
                >
                  {isArranging ? 'Creating Magic...' : 'Arrange Photos'}
                </button>
                
                <button
                  onClick={clearCanvas}
                  disabled={photos.length === 0}
                  className="w-full px-4 py-3 bg-gradient-to-r from-rose-600 to-red-500 text-white rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 font-medium shadow-md"
                >
                  Clear All
                </button>
              </div>

              {/* Stats */}
              <div className="mt-6 text-center">
                <div className="inline-block bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
                  <span className="text-white font-medium">
                    📸 {photos.length} Photo{photos.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className={`${themeColors.card} backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20`}>
              <h3 className="text-xl font-bold text-white mb-4 text-center font-['Pacifico']">
                💖 How To Use
              </h3>
              <ul className="space-y-3 text-white/90 text-sm">
                <li className="flex items-start gap-2">
                  <span>1.</span> Upload photos by clicking or drag & drop
                </li>
                <li className="flex items-start gap-2">
                  <span>2.</span> Choose a magical shape
                </li>
                <li className="flex items-start gap-2">
                  <span>3.</span> Click "Arrange Photos"
                </li>
                <li className="flex items-start gap-2">
                  <span>4.</span> Hover photos to make them fly!
                </li>
                <li className="flex items-start gap-2">
                  <span>5.</span> Scroll on canvas for special effects
                </li>
              </ul>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <div className={`${themeColors.card} backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 h-full`}>
              <h3 className="text-2xl font-bold text-white mb-4 text-center font-['Pacifico']">
                🎨 Your Photo Creation
              </h3>
              
              <div
                ref={canvasRef}
                className={`relative w-full h-[500px] bg-gradient-to-br from-white/10 to-white/5 rounded-xl overflow-hidden border-2 border-dashed ${
                  isDraggingOver ? 'border-pink-400 bg-pink-500/20' : 'border-white/30'
                } cursor-grab active:cursor-grabbing transition-all duration-300`}
                onWheel={handleCanvasScroll}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {photos.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <div className="text-6xl mb-4 animate-bounce">
                      {isDraggingOver ? '🔼 Drop Here 🔼' : '🖼️'}
                    </div>
                    <h4 className="text-xl font-bold mb-2">
                      {isDraggingOver ? 'Drop your photos here!' : 'Your canvas is empty'}
                    </h4>
                    <p className="text-white/80 max-w-md">
                      {isDraggingOver ? '' : 'Upload photos or drag & drop to create beautiful arrangements!'}
                    </p>
                  </div>
                ) : (
                  photos.map((photo) => (
                    <div
                      key={photo.id}
                      className={`absolute w-24 h-24 cursor-pointer transition-all duration-700 ease-out ${
                        photo.isFlying ? 'z-20' : 'z-10'
                      }`}
                      style={{
                        left: `${photo.targetX || photo.x}%`,
                        top: `${photo.targetY || photo.y}%`,
                        transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`,
                        transition: photo.isFlying 
                          ? 'all 1s cubic-bezier(0.68, -0.6, 0.32, 1.6)' 
                          : 'all 0.5s ease-out',
                        zIndex: photo.zIndex
                      }}
                      onMouseEnter={() => handlePhotoHover(photo.id, true)}
                      onMouseLeave={() => handlePhotoHover(photo.id, false)}
                    >
                      <img
                        src={photo.url}
                        alt="Uploaded memory"
                        className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-white/80 hover:border-white transition-all duration-300"
                        draggable={false}
                      />
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-pink-400/20 via-rose-400/20 to-purple-400/20 pointer-events-none"></div>
                    </div>
                  ))
                )}

                {/* Decorative elements */}
                {photos.length > 0 && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={`sparkle-${i}`}
                        className="absolute w-2 h-2 bg-white rounded-full animate-sparkle opacity-80 pointer-events-none"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random() * 2}s`
                        }}
                      ></div>
                    ))}
                  </>
                )}
              </div>

              {/* Quick Tips */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-white/10 rounded-lg p-2 text-center text-white/90 text-xs">
                  ✨ Hover photos to animate
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center text-white/90 text-xs">
                  🎯 Scroll for special effects
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center text-white/90 text-xs">
                  💖 Choose different shapes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes love-float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg) scale(1); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-30px) rotate(180deg) scale(1.2); 
            opacity: 1;
          }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1); opacity: 1; }
        }
        .animate-love-float {
          animation: love-float 8s ease-in-out infinite;
        }
        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}