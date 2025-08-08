'use client';

import { useState, useEffect, useRef } from 'react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  reminderTime: string;
  proof: string[];
  completedAt?: Date;
  createdAt: Date;
}

interface EnhancedTodoManagerProps {
  theme: any;
}

export default function EnhancedTodoManager({ theme }: EnhancedTodoManagerProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDeadline, setNewDeadline] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [uploadingProof, setUploadingProof] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const appreciationMessages = [
    "🌟 Incredible! You're absolutely amazing!",
    "🎉 Wow! Look at you achieving your goals!",
    "✨ You're doing phenomenally well!",
    "💫 Outstanding work! Keep shining!",
    "🏆 You're a true champion!",
    "🎊 Spectacular job! So proud of you!",
    "💖 You're absolutely wonderful!",
    "🌈 Fantastic! Dreams becoming reality!",
    "⭐ Marvelous! Dedication pays off!",
    "💝 You're simply the best!"
  ];

  // Load todos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rakhi-todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('rakhi-todos', JSON.stringify(todos));
  }, [todos]);

  // Check for reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      todos.forEach(todo => {
        if (!todo.completed && todo.reminderTime) {
          const [hours, minutes] = todo.reminderTime.split(':').map(Number);
          const reminderTime = hours * 60 + minutes;
          
          if (Math.abs(currentTime - reminderTime) < 1) {
            showNotification(todo);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [todos]);

  const showNotification = (todo: TodoItem) => {
    if (Notification.permission === 'granted') {
      new Notification(`📋 Reminder: ${todo.text}`, {
        body: `It's time to work on your goal! 💪`,
        icon: '🎀'
      });
    }
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      priority: newPriority,
      deadline: newDeadline,
      reminderTime: newReminderTime,
      proof: [],
      createdAt: new Date()
    };
    
    setTodos(prev => [...prev, todo]);
    setNewTodo('');
    setNewDeadline('');
    setNewReminderTime('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, todoId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadProof(todoId, e.dataTransfer.files);
    }
  };

  const uploadProof = (todoId: string, files: FileList) => {
    setUploadingProof(todoId);
    
    // Simulate file upload
    setTimeout(() => {
      const fileNames = Array.from(files).map(file => file.name);
      setTodos(prev => prev.map(todo => 
        todo.id === todoId 
          ? { ...todo, proof: [...todo.proof, ...fileNames] }
          : todo
      ));
      setUploadingProof(null);
    }, 1000);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const updated = { ...todo, completed: !todo.completed, completedAt: !todo.completed ? new Date() : undefined };
        if (updated.completed) {
          triggerCelebration();
        }
        return updated;
      }
      return todo;
    }));
  };

  const triggerCelebration = () => {
    const randomMessage = appreciationMessages[Math.floor(Math.random() * appreciationMessages.length)];
    setCelebrationMessage(randomMessage);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active': return !todo.completed;
      case 'completed': return todo.completed;
      default: return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-400 to-red-600';
      case 'medium': return 'bg-gradient-to-r from-orange-400 to-yellow-500';
      case 'low': return 'bg-gradient-to-r from-green-400 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
      default: return '📝';
    }
  };

  return (
    <section className="py-12 md:py-20 px-4 relative overflow-hidden bg-gradient-to-br from-indigo-900/80 to-purple-900/80">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text mb-4">
            Goal Achiever 🎯
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-2">
            Track your dreams, celebrate your wins!
          </p>
          <p className="text-sm md:text-base text-white/60">
            Add goals, set priorities, and mark them achieved with proof!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 shadow-lg border border-white/20">
          {/* Add New Todo */}
          <div className="mb-6 bg-white/10 rounded-xl p-4 md:p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Add New Goal</h3>
            <div className="grid gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What goal do you want to achieve?"
                className="w-full px-4 py-3 bg-white/20 rounded-lg text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="px-4 py-3 bg-white/20 rounded-lg text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="low" className="bg-gray-800">🌱 Low Priority</option>
                  <option value="medium" className="bg-gray-800">⚡ Medium Priority</option>
                  <option value="high" className="bg-gray-800">🔥 High Priority</option>
                </select>
                
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="px-4 py-3 bg-white/20 rounded-lg text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                
                <input
                  type="time"
                  value={newReminderTime}
                  onChange={(e) => setNewReminderTime(e.target.value)}
                  placeholder="Reminder time"
                  className="px-4 py-3 bg-white/20 rounded-lg text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              
              <button
                onClick={addTodo}
                disabled={!newTodo.trim()}
                className="mt-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md"
              >
                ✨ Add Goal
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {(['all', 'active', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-full transition-all duration-200 text-sm md:text-base ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                <span className="ml-1">
                  ({filterType === 'all' ? todos.length : 
                   filterType === 'active' ? todos.filter(t => !t.completed).length : 
                   todos.filter(t => t.completed).length})
                </span>
              </button>
            ))}
          </div>

          {/* Todo List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4 animate-bounce">🎯</div>
                <p className="text-white/70">
                  {filter === 'all' ? 'No goals yet. Add your first goal above!' : `No ${filter} goals.`}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`bg-white/10 rounded-xl p-4 transition-all duration-200 hover:bg-white/20 border ${
                    todo.completed ? 'border-green-500/30' : 'border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-all duration-200 ${
                        todo.completed
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400'
                          : 'border-white/50 hover:border-white'
                      }`}
                    >
                      {todo.completed && <span className="text-white text-sm">✓</span>}
                    </button>
                    
                    {/* Todo Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center gap-2 ${todo.completed ? 'opacity-80' : ''}`}>
                        <span className={`w-3 h-3 rounded-full ${getPriorityColor(todo.priority)}`}></span>
                        <p className={`text-white ${todo.completed ? 'line-through' : 'font-medium'}`}>
                          {todo.text}
                        </p>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {todo.deadline && (
                          <span className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded">
                            📅 {new Date(todo.deadline).toLocaleDateString()}
                          </span>
                        )}
                        {todo.reminderTime && (
                          <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded">
                            ⏰ {todo.reminderTime}
                          </span>
                        )}
                        {todo.proof.length > 0 && (
                          <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded">
                            📎 {todo.proof.length} proof{todo.proof.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {/* Proof Upload Section */}
                      {!todo.completed && (
                        <div className="mt-3">
                          <div 
                            className={`relative border-2 border-dashed rounded-lg p-3 text-center ${
                              dragActive ? 'border-pink-400 bg-pink-500/10' : 'border-white/30'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={(e) => handleDrop(e, todo.id)}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              multiple
                              className="hidden"
                              onChange={(e) => e.target.files && uploadProof(todo.id, e.target.files)}
                            />
                            <p className="text-sm text-white/80">
                              {dragActive ? 'Drop files here' : 'Drag & drop proof or click to browse'}
                            </p>
                            <p className="text-xs text-white/60 mt-1">
                              (Images, PDFs, or documents)
                            </p>
                          </div>
                          {uploadingProof === todo.id && (
                            <div className="mt-2 text-center text-yellow-300 text-sm animate-pulse">
                              Uploading proof...
                            </div>
                          )}
                        </div>
                      )}

                      {/* Proof Display */}
                      {todo.proof.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-white/70 mb-1">Proofs:</div>
                          <div className="flex flex-wrap gap-1">
                            {todo.proof.map((proof, index) => (
                              <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs text-white">
                                📄 {proof}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-400 hover:text-red-300 transition-all p-1 hover:scale-110"
                      aria-label="Delete goal"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stats */}
          {todos.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <div className="font-bold text-white">{todos.length}</div>
                <div className="text-xs text-blue-200">Total</div>
              </div>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <div className="font-bold text-white">{todos.filter(t => t.completed).length}</div>
                <div className="text-xs text-green-200">Done</div>
              </div>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <div className="font-bold text-white">
                  {todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0}%
                </div>
                <div className="text-xs text-purple-200">Progress</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-xl shadow-2xl max-w-xs mx-4 animate-bounce">
            <div className="text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-bold mb-1">Goal Achieved!</h3>
              <p className="text-sm">{celebrationMessage}</p>
            </div>
          </div>
          
          {/* Confetti */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-celebration-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  fontSize: `${14 + Math.random() * 10}px`
                }}
              >
                {['✨', '🌟', '🎊', '💖', '🏆'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes celebration-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-celebration-float {
          animation: celebration-float 2s ease-out forwards;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}