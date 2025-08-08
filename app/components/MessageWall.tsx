'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  author: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  createdAt: Date;
  isDragging?: boolean;
}

export default function MessageWall() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const wallRef = useRef<HTMLDivElement>(null);

  const brothers = ['Baru', 'Chhotu', 'Ramu', 'Sofu', 'Piku'];
  const sisters = ['Fuchi', 'Sumi'];
  const allFamily = [...brothers, ...sisters];

  const stickyColors = [
    'bg-gradient-to-br from-pink-300 to-pink-400',
    'bg-gradient-to-br from-purple-300 to-purple-400',
    'bg-gradient-to-br from-blue-300 to-blue-400',
    'bg-gradient-to-br from-green-300 to-green-400',
    'bg-gradient-to-br from-yellow-300 to-yellow-400',
    'bg-gradient-to-br from-orange-300 to-orange-400',
    'bg-gradient-to-br from-red-300 to-red-400',
    'bg-gradient-to-br from-indigo-300 to-indigo-400',
    'bg-gradient-to-br from-teal-300 to-teal-400',
    'bg-gradient-to-br from-rose-300 to-rose-400'
  ];

  // Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rakhi-family-messages');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // Add some default messages
      const defaultMessages = brothers.map((brother, index) => ({
        id: `default-${index}`,
        text: `Dear Fuchi, you're the best sister in the world! Love from ${brother} 💖`,
        author: brother,
        color: stickyColors[index % stickyColors.length],
        x: Math.random() * 60 + 10,
        y: Math.random() * 50 + 10,
        rotation: Math.random() * 20 - 10,
        createdAt: new Date()
      }));
      setMessages(defaultMessages);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('rakhi-family-messages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = () => {
    if (!newMessage.trim() || !selectedAuthor) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      author: selectedAuthor,
      color: stickyColors[Math.floor(Math.random() * stickyColors.length)],
      x: Math.random() * 60 + 10,
      y: Math.random() * 50 + 10,
      rotation: Math.random() * 20 - 10,
      createdAt: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setSelectedAuthor('');
    setShowForm(false);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;

    const rect = wallRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, x, y, isDragging: false } : msg
    ));
  };

  const generateShareLink = () => {
    const message = encodeURIComponent("Check out our family love notes ! 💖");
    const url = encodeURIComponent(window.location.href);
    setShareLink(`https://wa.me/?text=${message}%0A%0A${url}`);
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <section className="min-h-screen py-12 px-4 relative overflow-hidden bg-gradient-to-br from-pink-900/50 via-purple-900/50 to-indigo-900/50">
      {/* Floating love elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 10}s`
            }}
          >
            {['💖', '🌸', '✨', '🎀', '🦋', '💝', '🌹', '🥀', '💐', '🌺'][Math.floor(Math.random() * 10)]}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300 mb-4 font-['Dancing_Script']">
            Family Love Wall 💌
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto">
            Share your love and blessings for Raksha Bandhan!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 shadow-xl border border-white/20">
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-3 mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              ✍️ Add Message
            </button>
            <button
              onClick={generateShareLink}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              💌 Share Love
            </button>
          </div>

          {/* Message Form */}
          {showForm && (
            <div className="mb-6 bg-white/20 rounded-xl p-6 backdrop-blur-sm transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-4">Write Your Message</h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-white/80 mb-2">From:</label>
                  <div className="flex flex-wrap gap-2">
                    {allFamily.map(name => (
                      <button
                        key={name}
                        onClick={() => setSelectedAuthor(name)}
                        className={`px-4 py-2 rounded-lg transition-all hover:scale-105 ${
                          selectedAuthor === name
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {brothers.includes(name) ? '👨' : '👩'} {name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Your Message:</label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write your loving message..."
                    className="w-full p-4 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:scale-105 transition-transform"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addMessage}
                    disabled={!newMessage.trim() || !selectedAuthor}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    Post Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Message Wall */}
          <div
            ref={wallRef}
            className={`relative w-full min-h-[500px] bg-gradient-to-br from-white/10 to-white/5 rounded-xl overflow-hidden border-2 border-dashed ${
              isDraggingOver ? 'border-pink-400 bg-pink-500/20' : 'border-white/30'
            } transition-all duration-300`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {messages.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="text-6xl mb-4 animate-bounce">💌</div>
                <h4 className="text-xl font-bold mb-2">No messages yet</h4>
                <p className="text-white/80">
                  Add your first message to start the love wall!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`absolute w-60 h-60 ${message.color} rounded-2xl shadow-xl cursor-move group hover:z-50 border-2 border-white/30 transition-transform duration-300 hover:scale-110 hover:rotate-0`}
                  style={{
                    left: `${message.x}%`,
                    top: `${message.y}%`,
                    transform: `rotate(${message.rotation}deg)`,
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, message.id)}
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-125 flex items-center justify-center shadow-lg font-bold"
                  >
                    ×
                  </button>
                  
                  {/* Author Badge */}
                  <div className="absolute -top-2 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    {brothers.includes(message.author) ? '👨' : '👩'} {message.author}
                  </div>
                  
                  {/* Message Content */}
                  <div className="p-6 h-full flex flex-col justify-center">
                    <div className="text-gray-800 text-base font-medium overflow-y-auto text-center leading-relaxed">
                      {message.text}
                    </div>
                    <div className="text-xs text-gray-600 mt-4 border-t border-gray-400 pt-3 text-center font-medium">
                      📅 {new Date(message.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stats */}
          {messages.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="bg-pink-500/20 p-3 rounded-lg">
                <div className="text-xl font-bold text-white">{messages.length}</div>
                <div className="text-xs text-pink-200">Messages</div>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <div className="text-xl font-bold text-white">
                  {new Set(messages.map(m => m.author)).size}
                </div>
                <div className="text-xs text-purple-200">Family Members</div>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <div className="text-xl font-bold text-white">
                  {messages.filter(m => brothers.includes(m.author)).length}
                </div>
                <div className="text-xs text-blue-200">Brother Messages</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Share Love Wall</h3>
            <p className="text-white/90 mb-6">
              Send this love wall to your family group on WhatsApp or copy the link to share elsewhere!
            </p>
            <div className="grid gap-3">
              <a
                href={shareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold text-center shadow-lg hover:scale-105 transition-transform"
              >
                📱 Share on WhatsApp
              </a>
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                📋 Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform mt-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}