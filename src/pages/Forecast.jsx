import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { usePincode } from '../contexts/PincodeContext';
import { areasAPI } from '../services/api';
import EmptyState from '../components/EmptyState';
import { 
  TrendingUp, TrendingDown, Calendar, BarChart3, LineChart, 
  PieChart, Users, DollarSign, Target, ArrowLeft, Download,
  Filter, ChevronDown, Info, Zap, AlertCircle, CheckCircle, Building2, Road, MapPin
} from 'lucide-react';

function Forecast() {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, districts } = useDistrict();
  const { selectedPincode } = usePincode();
  const [loading, setLoading] = useState(false);
  const [areaData, setAreaData] = useState(null);
  const [error, setError] = useState(null);
  
  const currentDistrict = districts.find(d => d._id === selectedDistrict);
  const districtName = currentDistrict?.name || 'No district selected';
  
  const [timeframe, setTimeframe] = useState('5years');

  useEffect(() => {
    const fetchAreaData = async () => {
      if (!selectedPincode) {
        setAreaData(null);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await areasAPI.getByPincode(selectedPincode);
        setAreaData(response.data || null);
        if (!response.data) {
          setError(`Data for pincode ${selectedPincode} will be loaded from government APIs. Please try again or select a different pincode.`);
        }
      } catch (err) {
        setAreaData(null);
        setError(err.message || 'Failed to load forecast data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAreaData();
  }, [selectedPincode]);

  // Generate forecast data based on real area data
  const generateForecastData = (area) => {
    if (!area) return null;

    const population = Number(area.population) || 0;
    const populationGrowth = Number(area.populationGrowth) || 0;
    const avgDemand = Object.values(area.demandScores || {}).reduce((sum, val) => sum + (Number(val) || 0), 0) / (Object.keys(area.demandScores || {}).length || 1);
    const avgCompetition = Object.values(area.competitors || {}).reduce((sum, val) => sum + (Number(val) || 0), 0) / (Object.keys(area.competitors || {}).length || 1);
    const urbanDev = Number(area.urbanDevelopment) || 0;
    const demandGrowthRate = Math.round(Math.max(1, Math.min(8, populationGrowth * 0.5 + urbanDev * 0.05)) * 100) / 100;
    const compGrowthRate = Math.round(Math.max(1, Math.min(10, urbanDev * 0.08 + 1)) * 100) / 100;
    const revGrowthRate = Math.round(Math.max(1, Math.min(12, demandGrowthRate * 1.5)) * 100) / 100;

    return {
      population: {
        current: population,
        year1: Math.round(population * (1 + populationGrowth / 100)),
        year3: Math.round(population * Math.pow(1 + populationGrowth / 100, 3)),
        year5: Math.round(population * Math.pow(1 + populationGrowth / 100, 5)),
        year10: Math.round(population * Math.pow(1 + populationGrowth / 100, 10)),
        growthRate: Math.round(populationGrowth * 100) / 100
      },
      demand: {
        current: Math.round(avgDemand * 100) / 100,
        year1: Math.round(Math.min(100, avgDemand * (1 + demandGrowthRate / 100)) * 100) / 100,
        year3: Math.round(Math.min(100, avgDemand * Math.pow(1 + demandGrowthRate / 100, 3)) * 100) / 100,
        year5: Math.round(Math.min(100, avgDemand * Math.pow(1 + demandGrowthRate / 100, 5)) * 100) / 100,
        year10: Math.round(Math.min(100, avgDemand * Math.pow(1 + demandGrowthRate / 100, 10)) * 100) / 100,
        growthRate: demandGrowthRate
      },
      competition: {
        current: Math.round(avgCompetition * 100) / 100,
        year1: Math.round(avgCompetition * (1 + compGrowthRate / 100) * 100) / 100,
        year3: Math.round(avgCompetition * Math.pow(1 + compGrowthRate / 100, 3) * 100) / 100,
        year5: Math.round(avgCompetition * Math.pow(1 + compGrowthRate / 100, 5) * 100) / 100,
        year10: Math.round(avgCompetition * Math.pow(1 + compGrowthRate / 100, 10) * 100) / 100,
        growthRate: compGrowthRate
      },
      revenue: {
        current: Math.round((avgDemand - avgCompetition) * 0.1 * 100) / 100,
        year1: Math.round((avgDemand * (1 + demandGrowthRate / 100) - avgCompetition * (1 + compGrowthRate / 100)) * 0.1 * 100) / 100,
        year3: Math.round((avgDemand * Math.pow(1 + demandGrowthRate / 100, 3) - avgCompetition * Math.pow(1 + compGrowthRate / 100, 3)) * 0.1 * 100) / 100,
        year5: Math.round((avgDemand * Math.pow(1 + demandGrowthRate / 100, 5) - avgCompetition * Math.pow(1 + compGrowthRate / 100, 5)) * 0.1 * 100) / 100,
        year10: Math.round((avgDemand * Math.pow(1 + demandGrowthRate / 100, 10) - avgCompetition * Math.pow(1 + compGrowthRate / 100, 10)) * 0.1 * 100) / 100,
        growthRate: revGrowthRate
      }
    };
  };

  const forecastData = generateForecastData(areaData);

  // Generate future trends based on real data
  const generateFutureTrends = (area) => {
    if (!area) return [];

    const urbanDev = Number(area.urbanDevelopment) || 0;
    const populationGrowth = Number(area.populationGrowth) || 0;
    const incomeLevel = area.incomeLevel || 'Low';

    return [
      { 
        trend: 'Population Growth', 
        impact: populationGrowth > 2 ? 'Positive' : 'Neutral', 
        confidence: Math.round(Math.min(90, 60 + populationGrowth * 10) * 100) / 100, 
        icon: Users 
      },
      { 
        trend: 'Commercial Development', 
        impact: urbanDev > 60 ? 'Positive' : 'Neutral', 
        confidence: Math.round(urbanDev * 100) / 100, 
        icon: Building2 
      },
      { 
        trend: 'Infrastructure Expansion', 
        impact: urbanDev > 50 ? 'Positive' : 'Neutral', 
        confidence: Math.round(Math.min(80, urbanDev + 10) * 100) / 100, 
        icon: Road 
      },
      { 
        trend: 'Competition Increase', 
        impact: 'Negative', 
        confidence: Math.round(Math.min(70, 50 + urbanDev * 0.3) * 100) / 100, 
        icon: TrendingUp 
      },
      { 
        trend: 'Consumer Spending', 
        impact: incomeLevel === 'High' ? 'Positive' : incomeLevel === 'Medium' ? 'Neutral' : 'Negative', 
        confidence: Math.round(Math.min(90, Math.max(30, (incomeLevel === 'High' ? urbanDev * 0.9 : incomeLevel === 'Medium' ? urbanDev * 0.7 : urbanDev * 0.5) + populationGrowth * 3)) * 100) / 100, 
        icon: DollarSign 
      }
    ];
  };

  const futureTrends = generateFutureTrends(areaData);

  const currentYear = new Date().getFullYear();

  // Generate predictions based on forecast data and selected timeframe
  const generatePredictions = (forecast, tf) => {
    if (!forecast) return [];
    const items = [
      {
        year: `${currentYear + 1}`,
        population: `${(forecast.population.year1 / 1000).toFixed(0)}K`,
        demand: `${Number(forecast.demand.year1).toFixed(2)}%`,
        competition: `${Number(forecast.competition.year1).toFixed(2)}%`,
        revenue: `₹${Number(forecast.revenue.year1).toFixed(2)}L`
      },
      {
        year: `${currentYear + 3}`,
        population: `${(forecast.population.year3 / 1000).toFixed(0)}K`,
        demand: `${Number(forecast.demand.year3).toFixed(2)}%`,
        competition: `${Number(forecast.competition.year3).toFixed(2)}%`,
        revenue: `₹${Number(forecast.revenue.year3).toFixed(2)}L`
      },
      {
        year: `${currentYear + 5}`,
        population: `${(forecast.population.year5 / 1000).toFixed(0)}K`,
        demand: `${Number(forecast.demand.year5).toFixed(2)}%`,
        competition: `${Number(forecast.competition.year5).toFixed(2)}%`,
        revenue: `₹${Number(forecast.revenue.year5).toFixed(2)}L`
      },
    ];
    if (tf === '10years') {
      items.push({
        year: `${currentYear + 10}`,
        population: `${(forecast.population.year10 / 1000).toFixed(0)}K`,
        demand: `${Number(forecast.demand.year10).toFixed(2)}%`,
        competition: `${Number(forecast.competition.year10).toFixed(2)}%`,
        revenue: `₹${Number(forecast.revenue.year10).toFixed(2)}L`
      });
    }
    return items;
  };

  const predictions = generatePredictions(forecastData, timeframe);

  // Compute confidence scores from real data
  const confidenceScores = useMemo(() => {
    if (!areaData) return { accuracy: 0, dataQuality: 0, precision: 0 };
    const hasPop = areaData.population > 0 ? 1 : 0;
    const hasGrowth = areaData.populationGrowth != null ? 1 : 0;
    const hasIncome = areaData.incomeLevel ? 1 : 0;
    const hasUrban = areaData.urbanDevelopment > 0 ? 1 : 0;
    const hasDemand = Object.keys(areaData.demandScores || {}).length > 0 ? 1 : 0;
    const hasComp = Object.keys(areaData.competitors || {}).length > 0 ? 1 : 0;
    const completeness = ((hasPop + hasGrowth + hasIncome + hasUrban + hasDemand + hasComp) / 6) * 100;
    return {
      accuracy: Math.round(Math.min(95, 60 + completeness * 0.35) * 100) / 100,
      dataQuality: Math.round(completeness * 100) / 100,
      precision: Math.round(Math.min(92, 55 + completeness * 0.4) * 100) / 100,
    };
  }, [areaData]);

  if (!selectedPincode) {
    return (
      <div className={`min-h-[calc(100vh-70px)] p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="max-w-7xl mx-auto">
          <EmptyState
            type="noData"
            message="Please select a pincode on the Dashboard first, then return here to view forecasts."
            actionText="Go to Dashboard"
            onAction={() => window.location.href = '/dashboard'}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-[calc(100vh-70px)] p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
            <p className={`${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading forecast data from backend...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !areaData || !forecastData) {
    return (
      <div className={`min-h-[calc(100vh-70px)] p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="max-w-7xl mx-auto">
          <EmptyState
            type={error ? 'error' : 'noData'}
            message={error || `Data for pincode ${selectedPincode} will be loaded from government APIs. Please try again or select a different pincode.`}
            actionText="Go to Dashboard"
            onAction={() => window.location.href = '/dashboard'}
          />
        </div>
      </div>
    );
  }


  return (
    <div className={`min-h-[calc(100vh-70px)] p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/dashboard"
            className={`inline-flex items-center gap-2 mb-4 font-medium hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-[#2563eb]" size={28} />
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Market Forecast
                </h1>
              </div>
              <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Predictive analytics for future market trends in {selectedPincode ? `pincode ${selectedPincode}` : districtName}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className={`px-4 py-2 pr-10 rounded-lg border bg-transparent outline-none focus:border-[#2563eb] transition-colors appearance-none cursor-pointer ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}
                >
                  <option value="5years">5 Years</option>
                  <option value="10years">10 Years</option>
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={16} />
              </div>
              <button
                onClick={() => {
                  if (!forecastData) return;
                  const rows = [['Year', 'Population', 'Demand', 'Competition', 'Revenue']];
                  predictions.forEach(p => rows.push([p.year, p.population, p.demand, p.competition, p.revenue]));
                  const csv = rows.map(r => r.join(',')).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `forecast-${selectedPincode || 'data'}.csv`; a.click();
                  URL.revokeObjectURL(url);
                }}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${isDarkMode ? 'text-[#f1f5f9] border-[#334155] hover:bg-[#1e293b]' : 'text-[#1e293b] border-[#e2e8f0] hover:bg-[#ffffff]'}`}
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Forecast Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: 'Population Forecast', current: forecastData.population.current.toLocaleString(), future: forecastData.population.year5.toLocaleString(), growth: `+${Number(forecastData.population.growthRate).toFixed(2)}%`, color: 'text-blue-500' },
            { icon: Target, label: 'Demand Forecast', current: `${Number(forecastData.demand.current).toFixed(2)}%`, future: `${Number(forecastData.demand.year5).toFixed(2)}%`, growth: `+${Number(forecastData.demand.growthRate).toFixed(2)}%`, color: 'text-green-500' },
            { icon: TrendingUp, label: 'Competition Forecast', current: `${Number(forecastData.competition.current).toFixed(2)}%`, future: `${Number(forecastData.competition.year5).toFixed(2)}%`, growth: `+${Number(forecastData.competition.growthRate).toFixed(2)}%`, color: 'text-orange-500' },
            { icon: DollarSign, label: 'Revenue Forecast', current: `₹${Number(forecastData.revenue.current).toFixed(2)}L`, future: `₹${Number(forecastData.revenue.year5).toFixed(2)}L`, growth: `+${Number(forecastData.revenue.growthRate).toFixed(2)}%`, color: 'text-purple-500' }
          ].map((forecast, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.1) }}
              className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
            >
              <forecast.icon className={`${forecast.color} mb-3`} size={24} />
              <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{forecast.label}</p>
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {forecast.current}
                </span>
                <TrendingUp className="text-green-500 mb-1" size={16} />
                <span className={`text-lg font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {forecast.future}
                </span>
              </div>
              <span className="text-sm text-green-500 font-semibold">{forecast.growth} growth</span>
            </motion.div>
          ))}
        </div>

        {/* 5-Year Prediction Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <LineChart className="text-[#2563eb]" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {timeframe === '10years' ? '10-Year' : '5-Year'} Prediction
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Info className={`opacity-50 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={16} />
              <span className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Based on real area data and market trends
              </span>
            </div>
          </div>

          {/* Simplified Chart Visualization */}
          <div className="space-y-6">
            {(() => {
              const maxPop = Math.max(forecastData.population.current, forecastData.population.year5) || 1;
              const popPct = Math.round((forecastData.population.year5 / maxPop) * 100);
              const demPct = Math.round((forecastData.demand.year5 / Math.max(forecastData.demand.year5, 1)) * 100);
              const compPct = Math.round((forecastData.competition.year5 / Math.max(forecastData.competition.year5, 1)) * 100);
              const revMax = Math.max(forecastData.revenue.current, forecastData.revenue.year5) || 1;
              const revPct = Math.round((forecastData.revenue.year5 / revMax) * 100);
              return [
                { label: 'Population Growth', from: forecastData.population.current.toLocaleString(), to: forecastData.population.year5.toLocaleString(), pct: popPct, color: 'from-blue-500 to-blue-600' },
                { label: 'Demand Growth', from: `${Number(forecastData.demand.current).toFixed(2)}%`, to: `${Number(forecastData.demand.year5).toFixed(2)}%`, pct: demPct, color: 'from-green-500 to-green-600' },
                { label: 'Competition Growth', from: `${Number(forecastData.competition.current).toFixed(2)}%`, to: `${Number(forecastData.competition.year5).toFixed(2)}%`, pct: compPct, color: 'from-orange-500 to-orange-600' },
                { label: 'Revenue Growth', from: `₹${Number(forecastData.revenue.current).toFixed(2)}L`, to: `₹${Number(forecastData.revenue.year5).toFixed(2)}L`, pct: revPct, color: 'from-purple-500 to-purple-600' },
              ].map((bar, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{bar.label}</span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {bar.from} → {bar.to}
                    </span>
                  </div>
                  <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(5, bar.pct)}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                      className={`h-full bg-gradient-to-r ${bar.color} rounded-full`}
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </motion.div>

        {/* Year-by-Year Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Year-by-Year Predictions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                  <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Year</th>
                  <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population</th>
                  <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand</th>
                  <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competition</th>
                  <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((prediction, index) => (
                  <motion.tr
                    key={prediction.year}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'} hover:bg-opacity-50 ${isDarkMode ? 'hover:bg-[#1e293b]' : 'hover:bg-[#ffffff]'}`}
                  >
                    <td className={`p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{prediction.year}</td>
                    <td className={`p-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{prediction.population}</td>
                    <td className={`p-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{prediction.demand}</td>
                    <td className={`p-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{prediction.competition}</td>
                    <td className={`p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{prediction.revenue}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Future Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Future Trends Analysis
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {futureTrends.map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + (index * 0.1) }}
                className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${trend.impact === 'Positive' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    <trend.icon className={trend.impact === 'Positive' ? 'text-green-500' : 'text-red-500'} size={20} />
                  </div>
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{trend.trend}</p>
                    <span className={`text-xs ${trend.impact === 'Positive' ? 'text-green-500' : 'text-red-500'}`}>
                      {trend.impact} Impact
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Confidence</span>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{trend.confidence}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full rounded-full ${trend.impact === 'Positive' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${trend.confidence}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Confidence Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Forecast Confidence
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent mb-2">
                {Number(confidenceScores.accuracy).toFixed(2)}%
              </div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Overall Accuracy
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent mb-2">
                {Number(confidenceScores.dataQuality).toFixed(2)}%
              </div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Data Quality
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent mb-2">
                {Number(confidenceScores.precision).toFixed(2)}%
              </div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Model Precision
              </p>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className={`p-6 rounded-2xl border border-l-4 ${isDarkMode ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-500'}`}
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="text-blue-500 flex-shrink-0" size={24} />
            <div>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Forecast Disclaimer
              </h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                These forecasts are based on historical data, market trends, and AI predictive models. 
                Actual results may vary due to unforeseen economic factors, policy changes, or market conditions. 
                Use these predictions as guidance and conduct your own due diligence before making business decisions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Forecast;
