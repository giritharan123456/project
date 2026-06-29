import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingAIChat = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I\'m your AI assistant. How can I help you find market opportunities today?', isBot: true }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: message, isBot: false }]);
      setMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: prev.length + 1, 
          text: 'I\'m analyzing market data for you. This feature will be connected to backend AI when ready.', 
          isBot: true 
        }]);
      }, 1000);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-lg z-50 transition-all bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white`}
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-24 right-8 w-96 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl z-50 ${
              isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'
            } border`}
          >
            <div className={`p-4 border-b flex items-center justify-between ${
              isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  isDarkMode ? 'bg-[#2563eb]/20' : 'bg-[#2563eb]/10'
                }`}>
                  <Bot size={20} className="text-[#2563eb]" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    AI Assistant
                  </h3>
                  <p className="text-xs opacity-70">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-white/10 text-[#f1f5f9]' 
                    : 'hover:bg-black/10 text-[#1e293b]'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.isBot
                      ? isDarkMode 
                        ? 'bg-white/10 text-[#f1f5f9]' 
                        : 'bg-black/5 text-[#1e293b]'
                      : 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={`p-4 border-t flex gap-2 ${
              isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'
            }`}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about market opportunities..."
                className={`flex-1 px-4 py-2 rounded-xl outline-none transition-colors ${
                  isDarkMode 
                    ? 'bg-white/5 text-[#f1f5f9] placeholder:text-white/50 border border-white/10 focus:border-[#2563eb]' 
                    : 'bg-black/5 text-[#1e293b] placeholder:text-black/50 border border-black/10 focus:border-[#2563eb]'
                }`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`p-2 rounded-xl transition-all ${
                  message.trim()
                    ? 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white'
                    : isDarkMode
                      ? 'bg-white/10 text-white/50'
                      : 'bg-black/10 text-black/50'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAIChat;
