import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertTriangle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const barData = [
  { name: 'Your Business', 'Market Share': 45, 'Digital Presence': 80 },
  { name: 'Competitor A', 'Market Share': 30, 'Digital Presence': 60 },
  { name: 'Competitor B', 'Market Share': 25, 'Digital Presence': 40 },
];

const radarData = [
  { subject: 'Pricing', A: 80, B: 60, fullMark: 100 },
  { subject: 'Location', A: 90, B: 70, fullMark: 100 },
  { subject: 'Quality', A: 75, B: 85, fullMark: 100 },
  { subject: 'Speed', A: 85, B: 65, fullMark: 100 },
  { subject: 'Support', A: 95, B: 50, fullMark: 100 },
];

const Competitors = () => {
  const { isDarkMode } = useTheme();
  const [expandedInsight, setExpandedInsight] = useState(null);

  const toggleInsight = (id) => {
    setExpandedInsight(expandedInsight === id ? null : id);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent">
          Competitor Intelligence
        </h2>
        <p className={`text-base opacity-80 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
          AI-driven analysis of your top competitors and market positioning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
        >
          <h3 className="text-xl font-semibold mb-6">Market Share vs Engagement</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} vertical={false} />
                <XAxis dataKey="name" stroke={isDarkMode ? '#f1f5f9' : '#1e293b'} />
                <YAxis stroke={isDarkMode ? '#f1f5f9' : '#1e293b'} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    color: isDarkMode ? '#f1f5f9' : '#1e293b',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="Market Share" fill="var(--primary-blue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Digital Presence" fill="var(--primary-purple)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
        >
          <h3 className="text-xl font-semibold mb-6">Competitive Strengths Matrix</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke={isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} />
                <PolarAngleAxis dataKey="subject" stroke={isDarkMode ? '#f1f5f9' : '#1e293b'} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} />
                <Radar name="Your Business" dataKey="A" stroke="var(--primary-blue)" fill="var(--primary-blue)" fillOpacity={0.5} />
                <Radar name="Competitor A" dataKey="B" stroke="var(--warning)" fill="var(--warning)" fillOpacity={0.5} />
                <Legend />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    color: isDarkMode ? '#f1f5f9' : '#1e293b',
                    borderRadius: '8px'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:border-primary-blue' : 'bg-card-light border-border-light hover:border-primary-blue'}`}
          onClick={() => toggleInsight(1)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Competitor A has Low Customer Satisfaction</h4>
                <p className="text-sm opacity-70 mt-1">Exploit weakness with premium service</p>
              </div>
            </div>
            {expandedInsight === 1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <AnimatePresence>
            {expandedInsight === 1 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-4 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                  <h5 className="font-semibold mb-2">AI Rationale & Action Plan:</h5>
                  <p className="text-sm opacity-80 leading-relaxed">
                    Recent sentiment analysis across Google Reviews and Yelp indicates that Competitor A struggles with post-sale support and overall service quality. Their average rating has dropped by 0.6 stars in the last quarter.
                    <br/><br/>
                    <strong>Recommended Action:</strong> Launch a targeted marketing campaign highlighting your premium customer support tiers. Introduce a "Switch & Save" offer combined with a "Satisfaction Guarantee" to capture their frustrated customer base.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:border-primary-blue' : 'bg-card-light border-border-light hover:border-primary-blue'}`}
          onClick={() => toggleInsight(2)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <TrendingUp size={24} style={{ color: 'var(--success)' }} />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Dominant Digital Presence</h4>
                <p className="text-sm opacity-70 mt-1">Leverage social channels to siphon traffic</p>
              </div>
            </div>
            {expandedInsight === 2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <AnimatePresence>
            {expandedInsight === 2 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-4 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                  <h5 className="font-semibold mb-2">AI Rationale & Action Plan:</h5>
                  <p className="text-sm opacity-80 leading-relaxed">
                    Your business currently holds an 80% engagement rate on digital platforms compared to Competitor B's 40%. You have a strong visual brand that resonates well with the local demographic.
                    <br/><br/>
                    <strong>Recommended Action:</strong> Initiate hyper-local geofenced social media ads around Competitor B's physical locations. Use dynamic content that showcases your superior digital booking experience and exclusive online discounts to redirect foot traffic to your channels.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Competitors;
