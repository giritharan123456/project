import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI } from '../services/api';

const FloatingAIChat = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m your MarketVision AI assistant. I can help you discover business opportunities, analyze market data, and explore trends across 38 districts in Tamil Nadu.\n\nAsk me anything about market opportunities, competition, or demographics.', isBot: true }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const mountedRef = useRef(true);
  const abortRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    const msg = message.trim();
    if (!msg || loading) return;

    const userMsg = { id: Date.now(), text: msg, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await aiAPI.chat(msg, { signal: controller.signal });
      if (!mountedRef.current || controller.signal.aborted) return;
      const reply = res.data?.response || 'Sorry, I could not process that request.';
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
    } catch (err) {
      if (!mountedRef.current || err.name === 'AbortError') return;
      setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Connection error. Please try again.', isBot: true }]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [message, loading]);

  const suggestions = ['Which area is best for business?', 'Show top 5 opportunities', 'Chennai market data', 'Competition analysis', 'Population demographics', 'Investment guidance'];

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Chat"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 p-3.5 rounded-full shadow-lg z-50 bg-gradient-to-r from-blue-600 to-violet-600 text-white"
      >
        <MessageCircle size={22} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-16 right-4 sm:bottom-20 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border ${
              isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'
            }`}
            style={{ maxHeight: 'calc(100dvh - 140px)' }}
          >
            {/* Header */}
            <div className={`px-4 py-3 flex items-center justify-between border-b ${isDarkMode ? 'border-[#475569]' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50'}`}>
                  <Bot size={16} className="text-blue-600" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>AI Assistant</h3>
                  <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ask anything about market data</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close chat" className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5" style={{ maxHeight: 'min(320px, 60vh)' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex items-start gap-1.5 max-w-[85%] ${msg.isBot ? '' : 'flex-row-reverse'}`}>
                    <div className={`p-1 rounded-md flex-shrink-0 mt-0.5 ${msg.isBot ? (isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50') : (isDarkMode ? 'bg-violet-900/40' : 'bg-violet-50')}`}>
                      {msg.isBot ? <Bot size={12} className="text-blue-500" /> : <User size={12} className="text-violet-500" />}
                    </div>
                    <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.isBot
                        ? isDarkMode ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-100 text-slate-700'
                        : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={`px-3 py-2 rounded-xl text-xs ${isDarkMode ? 'bg-[#0f172a] text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {suggestions.map(s => (
                  <button key={s} onClick={() => { setMessage(s); }}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-colors ${
                      isDarkMode ? 'bg-[#0f172a] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className={`px-3 pb-3 flex gap-2`}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about market opportunities..."
                disabled={loading}
                className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none transition-colors ${
                  isDarkMode ? 'bg-[#0f172a] text-white placeholder:text-slate-500 border border-[#475569] focus:border-blue-500' : 'bg-slate-50 text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500'
                }`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || loading}
                className={`p-2 rounded-xl transition-all ${
                  message.trim() && !loading
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white'
                    : isDarkMode ? 'bg-[#0f172a] text-slate-600' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAIChat;
