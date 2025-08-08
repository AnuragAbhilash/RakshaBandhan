
'use client';

import { useState, useEffect } from 'react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  createdAt: Date;
}

interface TodoManagerProps {
  theme: any;
  onAchievement: (achievement: string) => void;
}

export default function TodoManager({ theme, onAchievement }: TodoManagerProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDeadline, setNewDeadline] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showCelebration, setShowCelebration] = useState(false);

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

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      priority: newPriority,
      deadline: newDeadline,
      createdAt: new Date()
    };
    
    setTodos(prev => [...prev, todo]);
    setNewTodo('');
    setNewDeadline('');
    onAchievement('Task Creator');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const updated = { ...todo, completed: !todo.completed };
        if (updated.completed) {
          triggerCelebration();
          onAchievement('Task Completer');
        }
        return updated;
      }
      return todo;
    }));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
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
      case 'high': return 'bg-red-500';
      case 'medium': return `bg-${theme.accent}`;
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-['Pacifico'] text-white mb-4">
            Smart Todo Manager ✅
          </h2>
          <p className="text-xl text-white/80">
            Stay organized and achieve your goals!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
          {/* Add New Todo */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 bg-white/20 rounded-xl text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="px-4 py-3 bg-white/20 rounded-xl text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 pr-8"
              >
                <option value="low" className="text-black">🌱 Low</option>
                <option value="medium" className="text-black">⚡ Medium</option>
                <option value="high" className="text-black">🔥 High</option>
              </select>
              
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="px-4 py-3 bg-white/20 rounded-xl text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              
              <button
                onClick={addTodo}
                className={`px-6 py-3 bg-${theme.accent} text-white rounded-xl hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer`}
              >
                ➕ Add
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-2 mb-8">
            {(['all', 'active', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-2 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  filter === filterType
                    ? `bg-${theme.accent} text-white`
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType === 'all' && ` (${todos.length})`}
                {filterType === 'active' && ` (${todos.filter(t => !t.completed).length})`}
                {filterType === 'completed' && ` (${todos.filter(t => t.completed).length})`}
              </button>
            ))}
          </div>

          {/* Todo List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-white/60 text-lg">
                  {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks.`}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-4 p-4 bg-white/10 rounded-xl transition-all duration-300 ${
                    todo.completed ? 'opacity-75' : 'hover:bg-white/20'
                  }`}
                >
                  {/* Priority Indicator */}
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(todo.priority)}`}></div>
                  
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      todo.completed
                        ? `bg-${theme.accent} border-${theme.accent}`
                        : 'border-white/50 hover:border-white'
                    }`}
                  >
                    {todo.completed && <span className="text-white text-sm">✓</span>}
                  </button>
                  
                  {/* Todo Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-white ${todo.completed ? 'line-through opacity-60' : ''}`}>
                      <span className="mr-2">{getPriorityEmoji(todo.priority)}</span>
                      {todo.text}
                    </div>
                    {todo.deadline && (
                      <div className="text-sm text-white/60 mt-1">
                        📅 Due: {new Date(todo.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-300 p-2 cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Stats */}
          {todos.length > 0 && (
            <div className="mt-8 p-4 bg-white/10 rounded-xl">
              <div className="flex justify-between text-sm text-white/70">
                <span>Total: {todos.length}</span>
                <span>Completed: {todos.filter(t => t.completed).length}</span>
                <span>Progress: {Math.round((todos.filter(t => t.completed).length / todos.length) * 100)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉 Great Job! 🎉</div>
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-celebration-float"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 1}s`,
                  fontSize: `${12 + Math.random() * 8}px`
                }}
              >
                {['⭐', '🎊', '💖', '✨'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes celebration-float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        .animate-celebration-float {
          animation: celebration-float 2s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
