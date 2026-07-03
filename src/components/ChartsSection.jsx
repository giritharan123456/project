import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import EmptyState from './EmptyState';
import { averageOfValues, toPlainObject } from '../utils/dataUtils';

// UI styling colors for charts - not hardcoded data
const COLORS = ['#667eea', '#764ba2', '#f39c12', '#27ae60', '#e74c3c', '#3498db', '#9b59b6', '#1abc9c'];

function ChartsSection({ businessCategories, selectedCategory, pincodeData }) {
  const { isDarkMode } = useTheme();

  if (!pincodeData || pincodeData.length === 0 || businessCategories.length === 0) {
    return (
      <EmptyState
        type="noData"
        message="No chart data available. Search a pincode on the dashboard to load census and market data."
      />
    );
  }

  const filteredCategories = selectedCategory === 'all'
    ? businessCategories.filter(c => c.demand !== null || c.supply !== null)
    : businessCategories.filter(cat => cat.name === selectedCategory);

  const forecastData = pincodeData.map(pincode => {
    const demandScores = toPlainObject(pincode.demandScores);
    const avgDemand = averageOfValues(demandScores);
    const growth = pincode.populationGrowth ?? 0;
    return {
      name: pincode.pincode,
      currentDemand: avgDemand ?? 0,
      projectedDemand: avgDemand !== null ? avgDemand + (growth * 2) : 0,
      populationGrowth: growth,
      searchTrends: pincode.searchTrends ?? 0
    };
  }).filter(d => d.currentDemand > 0 || d.projectedDemand > 0);

  const gapDistribution = pincodeData.flatMap(pincode =>
    Object.entries(toPlainObject(pincode.marketGapScores)).map(([category, score]) => ({
      category,
      score: Number(score)
    }))
  ).reduce((acc, { category, score }) => {
    if (!isNaN(score)) {
      if (!acc[category]) acc[category] = 0;
      acc[category] += score;
    }
    return acc;
  }, {});

  const gapChartData = Object.entries(gapDistribution).map(([category, score]) => ({
    name: category,
    score: Math.round(score / pincodeData.length)
  }));

  if (filteredCategories.length === 0 && forecastData.length === 0 && gapChartData.length === 0) {
    return (
      <EmptyState
        type="noData"
        message="No chart data available for the selected area."
      />
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
      <div className={`p-7 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}>
        <h3 className={`text-lg font-semibold mb-5 text-center bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand vs Supply Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredCategories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="demand" fill="#667eea" name="Demand" />
            <Bar dataKey="supply" fill="#764ba2" name="Supply" />
            <Bar dataKey="gap" fill="#e74c3c" name="Gap" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`p-7 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}>
        <h3 className={`text-lg font-semibold mb-5 text-center bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand Forecasting</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="currentDemand" stroke="#667eea" name="Current Demand" strokeWidth={2} />
            <Line type="monotone" dataKey="projectedDemand" stroke="#27ae60" name="Projected Demand" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={`p-7 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}>
        <h3 className={`text-lg font-semibold mb-5 text-center bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Gap Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gapChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#e74c3c" name="Avg Market Gap Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`p-7 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}>
        <h3 className={`text-lg font-semibold mb-5 text-center bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Business Category Gap Share</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={gapChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, score }) => `${name}: ${score}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="score"
            >
              {gapChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartsSection;
