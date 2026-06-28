import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from './AnimatedCard';
import { Sparkles, Map, Target, TrendingUp, DollarSign, Activity } from 'lucide-react';

const Recommendations = () => {
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode ? 'text-text-dark' : 'text-text-light';

  return (
    <div className={`w-full ${textColor}`}>
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent" style={{ backgroundImage: 'var(--primary-gradient)' }}>
            AI Business Recommendations
          </h2>
          <p className="text-base opacity-80">
            Data-driven suggestions for the highest probability of business success in your selected area.
          </p>
        </div>
        <div>
          <select className={`p-2 px-4 font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
            <option>Coimbatore North (641001)</option>
            <option>Chennai Central (600001)</option>
            <option>Madurai South (625001)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Top Opportunities Found */}
        <AnimatedCard>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
                #1 RECOMMENDATION
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${isDarkMode ? 'border-border-dark' : 'border-border-light'}`}>
                Retail & FMCG
              </span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black" style={{ color: 'var(--success)' }}>94%</div>
              <div className="text-xs font-bold opacity-70 tracking-wider">AI MATCH</div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <Sparkles size={24} style={{ color: 'var(--primary-blue)' }} />
            Organic Grocery Store
          </h3>
          <p className="opacity-80 mb-6 leading-relaxed">
            High demand for organic, locally sourced produce in this area with significantly low supply. The demographic shift towards health-conscious living coupled with upper-middle-class income levels makes this the perfect location for a premium organic grocery outlet.
          </p>

          {/* Metrics Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl mb-8 ${isDarkMode ? 'bg-bg-dark/50' : 'bg-bg-light/50'}`}>
            <div className="flex flex-col">
              <span className="text-xs opacity-60 mb-1 flex items-center gap-1"><Target size={14} /> Demand</span>
              <span className="font-bold">High</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs opacity-60 mb-1 flex items-center gap-1"><Activity size={14} /> Competition</span>
              <span className="font-bold" style={{ color: 'var(--primary-blue)' }}>Very Low</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs opacity-60 mb-1 flex items-center gap-1"><DollarSign size={14} /> Est. Investment</span>
              <span className="font-bold" style={{ color: 'var(--warning)' }}>₹20L - ₹30L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs opacity-60 mb-1 flex items-center gap-1"><TrendingUp size={14} /> Expected ROI</span>
              <span className="font-bold" style={{ color: 'var(--success)' }}>18-24 Mos</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button 
              className="flex-1 py-3 px-6 rounded-lg font-bold text-white transition-transform hover:scale-105 shadow-lg shadow-blue-500/20"
              style={{ background: 'var(--primary-gradient)' }}
            >
              Generate Business Plan
            </button>
            <button 
              className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}
            >
              <Map size={18} />
              View Competitors
            </button>
          </div>
        </AnimatedCard>

        {/* Right Column: Demand vs Supply Gap */}
        <AnimatedCard hoverEffect={false}>
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-1">Demand vs Supply Gap</h3>
            <p className="text-sm opacity-70">Comparative analysis of market needs versus existing businesses.</p>
          </div>

          <div className="space-y-7">
            {/* Industry 1 */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm">Organic Groceries</span>
                <span className="text-xs font-bold opacity-80" style={{ color: 'var(--success)' }}>Severe Shortage</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: '92%', backgroundColor: 'var(--primary-blue)' }}></div>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: '25%', backgroundColor: 'var(--danger)' }}></div>
                </div>
              </div>
            </div>

            {/* Industry 2 */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm">Fitness Centers</span>
                <span className="text-xs font-bold opacity-80" style={{ color: 'var(--success)' }}>High Opportunity</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: '85%', backgroundColor: 'var(--primary-blue)' }}></div>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: '40%', backgroundColor: 'var(--danger)' }}></div>
                </div>
              </div>
            </div>

            {/* Industry 3 */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm">Co-working Spaces</span>
                <span className="text-xs font-bold opacity-80" style={{ color: 'var(--warning)' }}>Moderate Gap</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: '70%', backgroundColor: 'var(--primary-blue)' }}></div>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: '45%', backgroundColor: 'var(--danger)' }}></div>
                </div>
              </div>
            </div>
            
            {/* Industry 4 */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm">Standard Pharmacies</span>
                <span className="text-xs font-bold opacity-80" style={{ color: 'var(--danger)' }}>Saturated</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: '60%', backgroundColor: 'var(--primary-blue)' }}></div>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: '85%', backgroundColor: 'var(--danger)' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-8 pt-4 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--primary-blue)' }}></div>
              <span className="text-xs font-medium opacity-80">Demand</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--danger)' }}></div>
              <span className="text-xs font-medium opacity-80">Supply</span>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default Recommendations;
