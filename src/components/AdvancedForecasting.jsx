import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

function AdvancedForecasting({ pincodeData, businessCategories }) {
  const { isDarkMode } = useTheme();
  const { addToast } = useToast();
  const [timePeriod, setTimePeriod] = useState(12);

  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="p-3 rounded-lg shadow-xl border" style={{ background: isDarkMode ? '#1e293b' : '#ffffff', borderColor: isDarkMode ? '#334155' : '#e0e0e0' }}>
        <p className="font-bold text-sm mb-1" style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs font-bold" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
          </p>
        ))}
      </div>
    );
  };
  const handleExportReport = () => {
    if (!pincodeData || pincodeData.length === 0) {
      addToast('Please select a district first', 'warning');
      return;
    }

    try {
      let reportContent = `
MARKETVISION AI - MARKET GAP FORECASTING REPORT
Generated: ${new Date().toLocaleDateString()}

FORECAST SUMMARY
===============
Total Pincodes Analyzed: ${pincodeData.length}
Total Population: ${pincodeData.reduce((sum, p) => sum + (Number(p.population) || 0), 0).toLocaleString()}
Average Growth Rate: ${(pincodeData.reduce((sum, p) => sum + (Number(p.populationGrowth) || 0), 0) / (pincodeData.length || 1)).toFixed(2)}%

BUSINESS CATEGORIES
==================
`;

      businessCategories.forEach(cat => {
        reportContent += `${cat.name}: Demand=${cat.demand}, Supply=${cat.supply}, Gap=${cat.gap}\n`;
      });

      reportContent += `
PINCODE DETAILS
==============
`;

      pincodeData.forEach((pincode, index) => {
        reportContent += `
${index + 1}. ${pincode.area} (${pincode.pincode})
   Population: ${(pincode.population || 0).toLocaleString()}
   Growth Rate: ${Number(pincode.populationGrowth || 0).toFixed(2)}%
   Income Level: ${pincode.incomeLevel || 'N/A'}
   Urban Development: ${pincode.urbanDevelopment || 'N/A'}

   Category Analysis:
`;
        businessCategories.forEach(cat => {
          reportContent += `   ${cat.name}: Gap=${pincode.marketGapScores[cat.name] || 0}, Demand=${pincode.demandScores[cat.name] || 0}, Competitors=${pincode.competitors[cat.name] || 0}\n`;
        });
      });

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `market-gap-forecast-report.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      addToast('Report export failed', 'error');
    }
  };

  const generateForecastData = () => {
    if (!pincodeData || pincodeData.length === 0) return [];

    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = allMonths.slice(0, timePeriod);
    
    const basePopulation = pincodeData.reduce((sum, p) => sum + (Number(p.population) || 0), 0) / pincodeData.length;
    const avgGrowth = pincodeData.reduce((sum, p) => sum + (Number(p.populationGrowth) || 0), 0) / pincodeData.length;
    const baseDemand = pincodeData.reduce((sum, p) => {
      const vals = Object.values(p.demandScores || {});
      return sum + (vals.length > 0 ? vals.reduce((s, v) => s + (Number(v) || 0), 0) / vals.length : 0);
    }, 0) / pincodeData.length;
    const baseGap = pincodeData.reduce((sum, p) => {
      const vals = Object.values(p.marketGapScores || {});
      return sum + (vals.length > 0 ? vals.reduce((s, v) => s + (Number(v) || 0), 0) / vals.length : 0);
    }, 0) / pincodeData.length;

    return months.map((month, index) => {
      const monthlyGrowth = avgGrowth / 100 / 12;
      return {
        month,
        population: Math.round(basePopulation * Math.pow(1 + monthlyGrowth, index)) || 0,
        demand: Math.round(baseDemand * (1 + (avgGrowth / 100) * (index / 12))) || 0,
        marketGap: Math.round(baseGap * (1 + (avgGrowth / 100) * (index / 12))) || 0
      };
    });
  };

  const generateCategoryForecast = () => {
    if (!businessCategories || businessCategories.length === 0) return [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const avgGrowth = pincodeData?.length > 0
      ? pincodeData.reduce((sum, p) => sum + (Number(p.populationGrowth) || 0), 0) / pincodeData.length
      : 2;
    
    return businessCategories.slice(0, 4).map(category => {
      const baseGap = Number(category.gap) || 0;
      const baseDemand = Number(category.demand) || 0;
      
      const categoryData = months.map((month, index) => {
        const growthFactor = 1 + (avgGrowth / 100) * (index / 12);
        return {
          month,
          [`${category.name} Gap`]: Math.round(baseGap * growthFactor) || 0,
          [`${category.name} Demand`]: Math.round(baseDemand * growthFactor) || 0
        };
      });

      return { category: category.name, data: categoryData };
    });
  };

  const generateTrendAnalysis = () => {
    if (!pincodeData || pincodeData.length === 0) return [];

    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const avgGrowth = pincodeData.reduce((sum, p) => sum + (Number(p.populationGrowth) || 0), 0) / pincodeData.length;
    const baseGap = pincodeData.reduce((sum, p) => {
      const vals = Object.values(p.marketGapScores || {});
      return sum + (vals.length > 0 ? vals.reduce((s, v) => s + (Number(v) || 0), 0) / vals.length : 0);
    }, 0) / pincodeData.length;
    const baseDemand = pincodeData.reduce((sum, p) => {
      const vals = Object.values(p.demandScores || {});
      return sum + (vals.length > 0 ? vals.reduce((s, v) => s + (Number(v) || 0), 0) / vals.length : 0);
    }, 0) / pincodeData.length;
    const baseCompetition = pincodeData.reduce((sum, p) => {
      const vals = Object.values(p.competitors || {});
      return sum + (vals.length > 0 ? vals.reduce((s, v) => s + (Number(v) || 0), 0) / vals.length : 0);
    }, 0) / pincodeData.length;
    
    return quarters.map((quarter, index) => {
      const trend = 1 + (avgGrowth / 100) * (index / 4);
      return {
        quarter,
        marketGap: Math.round(baseGap * trend) || 0,
        demand: Math.round(baseDemand * trend) || 0,
        competition: Math.round(baseCompetition * trend) || 0
      };
    });
  };

  const forecastData = generateForecastData();
  const categoryForecast = generateCategoryForecast();
  const trendAnalysis = generateTrendAnalysis();

  // UI styling colors for charts - not hardcoded data
  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c'];

  return (
    <div className={`p-3 rounded-xl border mb-1 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#475569] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-white border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>📈 Advanced Forecasting & Trend Analysis</h3>
        <div className="flex gap-2">
          <select value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} className={`px-3 py-2 border-2 rounded-lg ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b]'}`}>
            <option value={12}>12 Months</option>
            <option value={6}>6 Months</option>
            <option value={3}>3 Months</option>
          </select>
          <button className={`px-4 py-2 border-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] hover:border-[#2563eb]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] hover:border-[#2563eb]'}`} onClick={handleExportReport}>📊 Export Report</button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-0">
        <motion.div
          className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 className={`text-base font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population & Demand Forecast</h4>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorPopulation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#475569' : '#cbd5e1'} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 13, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} axisLine={{ stroke: isDarkMode ? '#64748b' : '#94a3b8' }} tickLine={false} />
              <YAxis tick={{ fontSize: 13, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} axisLine={{ stroke: isDarkMode ? '#64748b' : '#94a3b8' }} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 8 }} formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 13 }}>{value}</span>} />
              <Area type="monotone" dataKey="population" stroke="#2563eb" fill="url(#colorPopulation)" name="Population" />
              <Area type="monotone" dataKey="demand" stroke="#7c3aed" fill="url(#colorDemand)" name="Demand" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className={`text-base font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Gap Trend</h4>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#475569' : '#cbd5e1'} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 13, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} axisLine={{ stroke: isDarkMode ? '#64748b' : '#94a3b8' }} tickLine={false} />
              <YAxis tick={{ fontSize: 13, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} axisLine={{ stroke: isDarkMode ? '#64748b' : '#94a3b8' }} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 8 }} formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 13 }}>{value}</span>} />
              <Line type="monotone" dataKey="marketGap" stroke="#db2777" strokeWidth={3} name="Market Gap" dot={{ fill: '#db2777', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        className={`p-3 rounded-lg border mt-1 ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h4 className={`text-base font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Quarterly Trend Analysis</h4>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={trendAnalysis}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#475569' : '#cbd5e1'} vertical={false} />
            <XAxis dataKey="quarter" tick={{ fontSize: 13, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} axisLine={{ stroke: isDarkMode ? '#64748b' : '#94a3b8' }} tickLine={false} />
            <YAxis tick={{ fontSize: 13, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} axisLine={{ stroke: isDarkMode ? '#64748b' : '#94a3b8' }} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: isDarkMode ? '#1e293b' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#334155' : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '13px',
                color: isDarkMode ? '#f1f5f9' : '#000'
              }}
            />
              <Legend wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 8 }} formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 13 }}>{value}</span>} />
              <Line type="monotone" dataKey="marketGap" stroke="#2563eb" strokeWidth={2} name="Market Gap" />
            <Line type="monotone" dataKey="demand" stroke="#16a34a" strokeWidth={2} name="Demand" />
            <Line type="monotone" dataKey="competition" stroke="#ea580c" strokeWidth={2} name="Competition" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className={`p-3 rounded-lg border mt-1 ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h4 className={`text-base font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Category-wise Forecast</h4>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
          {categoryForecast.map((cat, index) => (
            <div key={index} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
              <h5 className={`font-bold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{cat.category}</h5>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={cat.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#475569' : '#cbd5e1'} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} axisLine={{ stroke: isDarkMode ? '#64748b' : '#94a3b8' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} axisLine={{ stroke: isDarkMode ? '#64748b' : '#94a3b8' }} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={`${cat.category} Gap`} 
                    stroke={COLORS[index % COLORS.length]} 
                    strokeWidth={2}
                    name="Gap"
                  />
                  <Line 
                    type="monotone" 
                    dataKey={`${cat.category} Demand`} 
                    stroke={COLORS[(index + 2) % COLORS.length]} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Demand"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default AdvancedForecasting;
