import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

function AdvancedForecasting({ pincodeData, businessCategories }) {
  const { isDarkMode } = useTheme();
  const handleExportReport = () => {
    if (!pincodeData || pincodeData.length === 0) {
      alert('No data available to export');
      return;
    }

    try {
      let reportContent = `
MARKET GAP FORECASTING REPORT
Generated: ${new Date().toLocaleDateString()}

FORECAST SUMMARY
===============
Total Pincodes Analyzed: ${pincodeData.length}
Total Population: ${pincodeData.reduce((sum, p) => sum + p.population, 0).toLocaleString()}
Average Growth Rate: ${(pincodeData.reduce((sum, p) => sum + p.populationGrowth, 0) / pincodeData.length).toFixed(2)}%

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
   Population: ${pincode.population.toLocaleString()}
   Growth Rate: ${pincode.populationGrowth}%
   Income Level: ${pincode.incomeLevel}
   Urban Development: ${pincode.urbanDevelopment}

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
      alert('Report export failed.');
    }
  };

  const generateForecastData = () => {
    if (!pincodeData || pincodeData.length === 0) return [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const forecastData = months.map((month, index) => {
      const basePopulation = pincodeData.reduce((sum, p) => sum + p.population, 0) / pincodeData.length;
      const baseGrowth = pincodeData.reduce((sum, p) => sum + p.populationGrowth, 0) / pincodeData.length;
      const baseDemand = pincodeData.reduce((sum, p) => {
        const avgDemand = Object.values(p.demandScores).reduce((s, v) => s + v, 0) / Object.values(p.demandScores).length;
        return sum + avgDemand;
      }, 0) / pincodeData.length;
      
      const growthFactor = 1 + (baseGrowth / 100) / 12;
      const seasonalVariation = Math.sin((index / 12) * Math.PI * 2) * 0.1;
      
      return {
        month,
        population: Math.round(basePopulation * Math.pow(growthFactor, index) * (1 + seasonalVariation)),
        demand: Math.round(baseDemand * (1 + seasonalVariation * 0.5)),
        marketGap: Math.round(baseDemand * 0.3 * (1 + seasonalVariation * 0.3))
      };
    });

    return forecastData;
  };

  const generateCategoryForecast = () => {
    if (!businessCategories || businessCategories.length === 0) return [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return businessCategories.slice(0, 4).map(category => {
      const baseGap = category.gap;
      const baseDemand = category.demand;
      
      const categoryData = months.map((month, index) => {
        const growthFactor = 1 + (0.02 * index / 12);
        const seasonalVariation = Math.sin((index / 12) * Math.PI * 2) * 0.15;
        
        return {
          month,
          [`${category.name} Gap`]: Math.round(baseGap * growthFactor * (1 + seasonalVariation)),
          [`${category.name} Demand`]: Math.round(baseDemand * growthFactor * (1 + seasonalVariation * 0.5))
        };
      });

      return {
        category: category.name,
        data: categoryData
      };
    });
  };

  const generateTrendAnalysis = () => {
    if (!pincodeData || pincodeData.length === 0) return [];

    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    return quarters.map((quarter, index) => {
      const baseGap = pincodeData.reduce((sum, p) => {
        const avgGap = Object.values(p.marketGapScores).reduce((s, v) => s + v, 0) / Object.values(p.marketGapScores).length;
        return sum + avgGap;
      }, 0) / pincodeData.length;
      
      const trend = 1 + (index * 0.05);
      const volatility = (Math.random() - 0.5) * 0.1;
      
      return {
        quarter,
        marketGap: Math.round(baseGap * trend * (1 + volatility)),
        demand: Math.round(75 * trend * (1 + volatility * 0.5)),
        competition: Math.round(25 * trend * (1 - volatility * 0.3))
      };
    });
  };

  const forecastData = generateForecastData();
  const categoryForecast = generateCategoryForecast();
  const trendAnalysis = generateTrendAnalysis();

  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c'];

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>📈 Advanced Forecasting & Trend Analysis</h3>
        <div className="flex gap-2">
          <select className={`px-3 py-2 border-2 rounded-lg ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b]'}`}>
            <option>12 Months</option>
            <option>6 Months</option>
            <option>3 Months</option>
          </select>
          <button className={`px-4 py-2 border-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] hover:border-[#2563eb]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] hover:border-[#2563eb]'}`} onClick={handleExportReport}>📊 Export Report</button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        <motion.div
          className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population & Demand Forecast</h4>
          <ResponsiveContainer width="100%" height={250}>
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
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e0e0e0'} />
              <XAxis dataKey="month" tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 12 }} />
              <YAxis tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: isDarkMode ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#334155' : '#e0e0e0'}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: isDarkMode ? '#f1f5f9' : '#000'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="population" stroke="#2563eb" fill="url(#colorPopulation)" name="Population" />
              <Area type="monotone" dataKey="demand" stroke="#7c3aed" fill="url(#colorDemand)" name="Demand" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Gap Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e0e0e0'} />
              <XAxis dataKey="month" tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 12 }} />
              <YAxis tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: isDarkMode ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#334155' : '#e0e0e0'}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: isDarkMode ? '#f1f5f9' : '#000'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="marketGap" stroke="#db2777" strokeWidth={3} name="Market Gap" dot={{ fill: '#db2777', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        className={`p-4 rounded-lg border mt-6 ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h4 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Quarterly Trend Analysis</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendAnalysis}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e0e0e0'} />
            <XAxis dataKey="quarter" tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 12 }} />
            <YAxis tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: isDarkMode ? '#1e293b' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#334155' : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '12px',
                color: isDarkMode ? '#f1f5f9' : '#000'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="marketGap" stroke="#2563eb" strokeWidth={2} name="Market Gap" />
            <Line type="monotone" dataKey="demand" stroke="#16a34a" strokeWidth={2} name="Demand" />
            <Line type="monotone" dataKey="competition" stroke="#ea580c" strokeWidth={2} name="Competition" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className={`p-4 rounded-lg border mt-6 ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h4 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Category-wise Forecast</h4>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {categoryForecast.map((cat, index) => (
            <div key={index} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
              <h5 className={`font-bold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{cat.category}</h5>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={cat.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e0e0e0'} />
                  <XAxis dataKey="month" tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 10 }} />
                  <YAxis tick={{ fill: isDarkMode ? '#f1f5f9' : '#000', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      background: isDarkMode ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#334155' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: isDarkMode ? '#f1f5f9' : '#000'
                    }}
                  />
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
