import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

function getScoreClass(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

function BusinessInsights({ pincodeData }) {
  const { isDarkMode } = useTheme();
  const [selectedView, setSelectedView] = useState('opportunity');

  const COLORS = ['#4a6fa5', '#6b5b95', '#a85d6b', '#b8703a', '#4a8b5a', '#4a7a8a'];

  const generateOpportunityData = () => {
    if (!pincodeData || pincodeData.length === 0) return [];

    const categoryOpportunities = {};
    
    pincodeData.forEach(pincode => {
      Object.entries(pincode.marketGapScores).forEach(([category, score]) => {
        if (!categoryOpportunities[category]) {
          categoryOpportunities[category] = {
            totalGap: 0,
            count: 0,
            avgDemand: 0,
            totalCompetitors: 0
          };
        }
        categoryOpportunities[category].totalGap += score;
        categoryOpportunities[category].count += 1;
        categoryOpportunities[category].avgDemand += pincode.demandScores[category] || 0;
        categoryOpportunities[category].totalCompetitors += pincode.competitors[category] || 0;
      });
    });

    return Object.entries(categoryOpportunities).map(([category, data]) => ({
      category,
      avgGap: (data.totalGap / data.count).toFixed(1),
      avgDemand: (data.avgDemand / data.count).toFixed(1),
      avgCompetitors: (data.totalCompetitors / data.count).toFixed(1),
      opportunityScore: ((data.totalGap / data.count) * 0.6 + (data.avgDemand / data.count) * 0.4).toFixed(1)
    })).sort((a, b) => b.opportunityScore - a.opportunityScore);
  };

  const generateCompetitionData = () => {
    if (!pincodeData || pincodeData.length === 0) return [];

    const areaCompetition = pincodeData.map(pincode => {
      const totalCompetitors = Object.values(pincode.competitors).reduce((sum, val) => sum + val, 0);
      const avgGap = Object.values(pincode.marketGapScores).reduce((sum, val) => sum + val, 0) / Object.values(pincode.marketGapScores).length;
      
      return {
        area: pincode.area,
        competitors: totalCompetitors,
        marketGap: avgGap.toFixed(1),
        population: pincode.population
      };
    }).sort((a, b) => b.competitors - a.competitors);

    return areaCompetition.slice(0, 8);
  };

  const generateDemandDistribution = () => {
    if (!pincodeData || pincodeData.length === 0) return [];

    const demandLevels = {
      'High Demand (80-100)': 0,
      'Medium Demand (60-79)': 0,
      'Low Demand (0-59)': 0
    };

    pincodeData.forEach(pincode => {
      Object.values(pincode.demandScores).forEach(score => {
        if (score >= 80) {
          demandLevels['High Demand (80-100)']++;
        } else if (score >= 60) {
          demandLevels['Medium Demand (60-79)']++;
        } else {
          demandLevels['Low Demand (0-59)']++;
        }
      });
    });

    return Object.entries(demandLevels).map(([level, count]) => ({
      level,
      count,
      percentage: ((count / (pincodeData.length * Object.keys(pincodeData[0].demandScores).length)) * 100).toFixed(1)
    }));
  };

  const opportunityData = generateOpportunityData();
  const competitionData = generateCompetitionData();
  const demandDistribution = generateDemandDistribution();

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>📊 Business Insights & Opportunity Visualization</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${selectedView === 'opportunity' ? 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white' : `${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155] hover:border-[#2563eb]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0] hover:border-[#2563eb]'}`}`}
            onClick={() => setSelectedView('opportunity')}
          >
            Opportunity Analysis
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${selectedView === 'competition' ? 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white' : `${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155] hover:border-[#2563eb]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0] hover:border-[#2563eb]'}`}`}
            onClick={() => setSelectedView('competition')}
          >
            Competition Analysis
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${selectedView === 'demand' ? 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white' : `${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155] hover:border-[#2563eb]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0] hover:border-[#2563eb]'}`}`}
            onClick={() => setSelectedView('demand')}
          >
            Demand Distribution
          </button>
        </div>
      </div>

      <div>
        {selectedView === 'opportunity' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Category Opportunity Scores</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={opportunityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e0e0e0'} />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 13, fontWeight: 500 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 13, fontWeight: 500 }} />
                  <Tooltip
                    contentStyle={{
                      background: isDarkMode ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#334155' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: isDarkMode ? '#f1f5f9' : '#000'
                    }}
                  />
                  <Bar dataKey="opportunityScore" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Opportunity Details</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                      <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Category</th>
                      <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Avg Gap</th>
                      <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Avg Demand</th>
                      <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Avg Competitors</th>
                      <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Opportunity Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunityData.map((item, index) => (
                      <tr key={index} className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                        <td className={`p-3 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.category}</td>
                        <td className={`p-3 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.avgGap}</td>
                        <td className={`p-3 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.avgDemand}</td>
                        <td className={`p-3 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.avgCompetitors}</td>
                        <td className="p-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getScoreClass(item.opportunityScore) === 'high' ? 'bg-red-500 text-white' : getScoreClass(item.opportunityScore) === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                            {item.opportunityScore}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {selectedView === 'competition' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Area Competition Levels</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={competitionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e0e0e0'} />
                  <XAxis 
                    dataKey="area" 
                    tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 13, fontWeight: 500 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 13, fontWeight: 500 }} />
                  <Tooltip
                    contentStyle={{
                      background: isDarkMode ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#334155' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: isDarkMode ? '#f1f5f9' : '#000'
                    }}
                  />
                  <Bar dataKey="competitors" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competition Insights</h4>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                {competitionData.slice(0, 4).map((area, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                    <h5 className={`font-bold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.area}</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competitors</span>
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.competitors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Gap</span>
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.marketGap}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population</span>
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.population.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedView === 'demand' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={demandDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ level, percentage }) => `${level}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {demandDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: isDarkMode ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#334155' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: isDarkMode ? '#f1f5f9' : '#000'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand Summary</h4>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                {demandDistribution.map((item, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`} style={{ borderColor: COLORS[index % COLORS.length] }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: COLORS[index % COLORS.length] }}>
                      <span className="text-xl">{index === 0 ? '🔥' : index === 1 ? '⚡' : '💧'}</span>
                    </div>
                    <h5 className={`font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.level}</h5>
                    <p className={`text-sm mb-2 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.percentage}% of total demand</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0]'}`}>{item.count} data points</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default BusinessInsights;
