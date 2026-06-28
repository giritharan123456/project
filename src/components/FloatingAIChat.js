import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Minus, X, Send, Bot } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const FloatingAIChat = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Business Advisor. How can I help you analyze the market today?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (isHidden) return null;

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const newMsg = { id: Date.now(), text: inputValue, isUser: true };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "I've analyzed that request against the current market data. Here's a brief insight: that area shows high potential for your selected industry, primarily due to recent population growth.", 
        isUser: false 
      }]);
    }, 2000);
  };

  const handleSuggestion = (text) => {
    setInputValue(text);
  };

  const glassStyle = {
    background: isDarkMode 
      ? 'rgba(30, 41, 59, 0.9)' 
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    boxShadow: '0 0 30px rgba(37,99,235,0.15)',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30"
            style={{ background: 'var(--primary-gradient)' }}
          >
            <Sparkles size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={glassStyle}
            className={`w-96 h-[600px] rounded-2xl flex flex-col overflow-hidden origin-bottom-right ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}
          >
            {/* Header Bar */}
            <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
              <div className="flex items-center gap-2">
                <Sparkles size={20} style={{ color: 'var(--primary-blue)' }} />
                <span className="font-bold">AI Advisor</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-md hover:bg-black/5 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
                >
                  <Minus size={18} />
                </button>
                <button 
                  onClick={() => setIsHidden(true)}
                  className={`p-1.5 rounded-md hover:bg-black/5 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Thread Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                  {!msg.isUser && (
                    <div className="flex items-center gap-2 mb-1 pl-1">
                      <Bot size={14} className="opacity-70" />
                      <span className="text-xs font-semibold opacity-70">AI</span>
                    </div>
                  )}
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.isUser 
                        ? 'rounded-tr-sm text-white' 
                        : 'rounded-tl-sm'
                    }`}
                    style={
                      msg.isUser 
                        ? { background: 'var(--primary-gradient)' }
                        : { 
                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` 
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1 pl-1">
                    <Bot size={14} className="opacity-70" />
                    <span className="text-xs font-semibold opacity-70">AI</span>
                  </div>
                  <div className={`p-4 rounded-2xl rounded-tl-sm w-16 flex items-center justify-center gap-1`}
                       style={{ 
                          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` 
                        }}>
                    <motion.div 
                      className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'} opacity-60`}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'} opacity-60`}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'} opacity-60`}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Sticky Input Bar */}
            <div className={`p-4 border-t ${isDarkMode ? 'bg-bg-dark/80 border-white/10' : 'bg-bg-light/80 border-black/10'}`}>
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                <button 
                  onClick={() => handleSuggestion('Analyze Dashboard')}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    isDarkMode 
                      ? 'border-white/10 bg-white/5 hover:bg-white/10' 
                      : 'border-black/10 bg-black/5 hover:bg-black/10'
                  }`}
                >
                  Analyze Dashboard
                </button>
                <button 
                  onClick={() => handleSuggestion('Find highest ROI')}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    isDarkMode 
                      ? 'border-white/10 bg-white/5 hover:bg-white/10' 
                      : 'border-black/10 bg-black/5 hover:bg-black/10'
                  }`}
                >
                  Find highest ROI
                </button>
              </div>
              <div className="flex gap-2 items-end">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask AI anything..."
                  className={`flex-1 max-h-32 min-h-[44px] p-3 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
                    isDarkMode 
                      ? 'bg-card-dark border border-white/10 text-white placeholder-white/40' 
                      : 'bg-white border border-black/10 text-black placeholder-black/40'
                  }`}
                  rows={1}
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="w-[44px] h-[44px] shrink-0 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: 'var(--primary-blue)' }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingAIChat;
