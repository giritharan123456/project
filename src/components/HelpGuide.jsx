import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, MapPin, Search, Filter, TrendingUp, Download } from 'lucide-react';

const HelpGuide = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      icon: MapPin,
      title: 'Select District',
      description: 'Choose the district you want to analyze'
    },
    {
      icon: Search,
      title: 'Search Pincode',
      description: 'Enter a specific pincode or use autocomplete to find areas'
    },
    {
      icon: Filter,
      title: 'Filter by Category',
      description: 'Select business categories to focus on specific opportunities'
    },
    {
      icon: TrendingUp,
      title: 'Analyze Data',
      description: 'Review charts, maps, KPIs, and insights to make decisions'
    },
    {
      icon: Download,
      title: 'Export Reports',
      description: 'Download detailed reports for offline analysis'
    }
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-8 p-3 rounded-full shadow-lg z-40 transition-all bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white`}
        aria-label="Help"
      >
        <HelpCircle size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl p-6 ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  How to Use MarketVision AI
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-[#f1f5f9] hover:bg-white/10' : 'text-[#1e293b] hover:bg-black/5'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start gap-4 p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}
                    >
                      <div className={`p-3 rounded-full ${isDarkMode ? 'bg-[#2563eb]/20' : 'bg-[#2563eb]/10'}`}>
                        <Icon className="text-[#2563eb]" size={24} />
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold"
              >
                Got it!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpGuide;
