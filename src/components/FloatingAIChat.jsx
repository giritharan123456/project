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
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-lg z-50 transition-all ${
          isDarkMode 
            ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white' 
            : 'bg-gradient-to-r from-primary-blue to-primary-purple text-white'
        }`}
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
              isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'
            } border`}
          >
            <div className={`p-4 border-b flex items-center justify-between ${
              isDarkMode ? 'border-border-dark' : 'border-border-light'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  isDarkMode ? 'bg-primary-blue/20' : 'bg-primary-blue/10'
                }`}>
                  <Bot size={20} className="text-primary-blue" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                    AI Assistant
                  </h3>
                  <p className="text-xs opacity-70">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-white/10 text-text-dark' 
                    : 'hover:bg-black/10 text-text-light'
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
                        ? 'bg-white/10 text-text-dark' 
                        : 'bg-black/5 text-text-light'
                      : 'bg-gradient-to-r from-primary-blue to-primary-purple text-white'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={`p-4 border-t flex gap-2 ${
              isDarkMode ? 'border-border-dark' : 'border-border-light'
            }`}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about market opportunities..."
                className={`flex-1 px-4 py-2 rounded-xl outline-none transition-colors ${
                  isDarkMode 
                    ? 'bg-white/5 text-text-dark placeholder:text-white/50 border border-white/10 focus:border-primary-blue' 
                    : 'bg-black/5 text-text-light placeholder:text-black/50 border border-black/10 focus:border-primary-blue'
                }`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`p-2 rounded-xl transition-all ${
                  message.trim()
                    ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white'
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
