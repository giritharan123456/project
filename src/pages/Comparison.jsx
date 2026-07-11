import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { usePincode } from '../contexts/PincodeContext';
import { areasAPI } from '../services/api';
import { 
  ArrowLeft, Plus, X, TrendingUp, TrendingDown, BarChart3, 
  Users, DollarSign, Target, Award, MapPin, Star, ChevronDown,
  Crown, ChevronRight
} from 'lucide-react';

function Comparison() {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, districts } = useDistrict();
  const { selectedPincode } = usePincode();
  
  const currentDistrict = districts.find(d => d._id === selectedDistrict);
  const districtName = currentDistrict?.name;
  
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'opportunityScore', dir: 'desc' });

  // Fetch areas from backend
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        const response = await areasAPI.getAll();
        const allAreas = (response.data || []).map(area => ({
          id: area._id,
          name: area.name,
          pincode: area.pincode,
          district: area.district?.name,
          score: Object.values(area.marketGapScores || {}).reduce((a, b) => a + (Number(b) || 0), 0) / (Object.keys(area.marketGapScores || {}).length || 1),
          population: Number(area.population),
          competition: Object.values(area.competitors || {}).reduce((a, b) => a + (Number(b) || 0), 0),
          demand: Object.values(area.demandScores || {}).reduce((a, b) => a + (Number(b) || 0), 0) / (Object.keys(area.demandScores || {}).length || 1),
          marketGapScores: area.marketGapScores,
          competitors: area.competitors,
          demandScores: area.demandScores,
          populationGrowth: Number(area.populationGrowth),
          incomeLevel: area.incomeLevel,
          urbanDevelopment: Number(area.urbanDevelopment),
          feasibilityScore: area.feasibilityScore != null ? Number(area.feasibilityScore) : null,
          opportunityScore: area.opportunityScore != null ? Number(area.opportunityScore) : null,
          incomeValue: area.incomeLevel === 'High' ? 85 : area.incomeLevel === 'Medium' ? 60 : 35
        }));
        
        // Filter by selected district
        const filteredAreas = allAreas.filter(area => area.district === districtName).map(area => ({
          ...area,
          score: Math.round(area.score * 100) / 100,
          competition: Math.round(area.competition * 100) / 100,
          demand: Math.round(area.demand * 100) / 100,
          populationGrowth: Math.round(area.populationGrowth * 100) / 100
        }));
        setAvailableAreas(filteredAreas);
        
        // If selectedPincode is set, prioritize it in comparison
        if (selectedPincode) {
          const selectedArea = filteredAreas.find(area => area.pincode === selectedPincode);
          if (selectedArea) {
            const otherAreas = filteredAreas.filter(area => area.pincode !== selectedPincode);
            const comparisonAreas = [selectedArea, ...otherAreas.slice(0, 3)];
            setSelectedAreas(comparisonAreas.slice(0, 4));
          } else {
            // If selected pincode not found, use first 2 areas
            setSelectedAreas(filteredAreas.slice(0, 2));
          }
        } else {
          // Set default selected areas (first 2)
          if (filteredAreas.length >= 2) {
            setSelectedAreas(filteredAreas.slice(0, 2));
          }
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load areas. Please check your connection and try again.');
        setLoading(false);
      }
    };

    fetchAreas();
  }, [selectedPincode, districtName]);

  const addArea = (area) => {
    if (selectedAreas.length < 4 && !selectedAreas.find(a => a.id === area.id)) {
      setSelectedAreas([...selectedAreas, area]);
      setShowAddModal(false);
    }
  };

  const removeArea = (id) => {
    setSelectedAreas(selectedAreas.filter(area => area.id !== id));
  };

  const getWinner = () => {
    if (selectedAreas.length === 0) return null;
    return selectedAreas.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  };

  const winner = getWinner();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
          <p className={`${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading areas from backend...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#2563eb] text-white rounded hover:bg-[#1d4ed8]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (availableAreas.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center">
          <p className={`${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            No areas available in {districtName}. Please select a different district.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-70px)] px-3 py-2 sm:px-4 sm:py-3 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
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
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="text-[#2563eb]" size={28} />
                <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Area Comparison
                </h1>
              </div>
              <p className={`text-sm sm:text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Compare multiple locations side by side in {selectedPincode ? `pincode ${selectedPincode}` : districtName}
              </p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              disabled={selectedAreas.length >= 4}
              className="px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={20} />
              Add Area ({selectedAreas.length}/4)
            </button>
          </div>
        </motion.div>

        {/* Comparison Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6"
        >
          {selectedAreas.map((area, index) => {
            const isWinner = winner && area.id === winner.id;
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 relative ${isWinner ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}
              >
                {isWinner && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="text-white" size={16} />
                  </div>
                )}
                
                <button
                  onClick={() => removeArea(area.id)}
                  className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-1 rounded-lg transition-colors ${isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="text-[#2563eb]" size={20} />
                  <h3 className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h3>
                </div>
                <p className={`text-xs sm:text-sm opacity-70 mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {area.district} • {area.pincode}
                </p>

                <div className="text-center mb-4">
                  <div className={`text-2xl sm:text-4xl font-extrabold ${isWinner ? 'text-yellow-600 dark:text-yellow-400' : 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent'}`}>
                    {Number(area.score || 0).toFixed(2)}
                  </div>
                  <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    Market Score
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population</span>
                    <span className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {area.population.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competition</span>
                    <span className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                       {Number(area.competition || 0).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand</span>
                    <span className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                       {Number(area.demand || 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Detailed Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 mb-6 ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="text-blue-600" size={20} />
            <h3 className={`text-sm sm:text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Detailed Comparison
            </h3>
          </div>

          <div className={`overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 rounded-lg border-2 ${isDarkMode ? 'border-[#475569]' : 'border-slate-200'}`}>
            <table className="w-full border-collapse min-w-[320px] sm:min-w-[500px]">
              <thead>
                <tr className={isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-100'}>
                  <th className={`text-left p-1.5 sm:p-3 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Metric</th>
                  {selectedAreas.map(area => (
                    <th key={area.id} className={`text-center p-2 sm:p-3 text-[10px] font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <div className="flex items-center justify-center gap-1">
                        {area.name}
                        {winner && area.id === winner.id && <Crown className="text-yellow-500" size={14} />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Market Score', icon: Award, isHigherBetter: true, key: 'score', hideClass: '' },
                  { label: 'Opportunity Score', icon: TrendingUp, isHigherBetter: true, key: 'opportunityScore', hideClass: '' },
                  { label: 'Feasibility Score', icon: Award, isHigherBetter: true, key: 'feasibilityScore', hideClass: 'hidden sm:table-row' },
                  { label: 'Population', icon: Users, isHigherBetter: true, key: 'population', hideClass: 'hidden md:table-row' },
                  { label: 'Demand', icon: TrendingUp, isHigherBetter: true, key: 'demand', hideClass: '' },
                  { label: 'Competition', icon: Target, isHigherBetter: false, key: 'competition', hideClass: 'hidden lg:table-row' },
                  { label: 'Income Level', icon: DollarSign, isHigherBetter: true, key: 'incomeValue', hideClass: 'hidden lg:table-row' }
                ].map((metric, rowIndex) => (
                  <tr key={rowIndex} className={`border-b-2 transition-colors ${metric.hideClass} ${isDarkMode ? 'border-[#475569] hover:bg-[#0f172a]/60' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <td className={`p-1.5 sm:p-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${isDarkMode ? 'bg-[#0f172a]' : 'bg-blue-50'}`}>
                          <metric.icon className="text-blue-600" size={14} />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">{metric.label}</span>
                      </div>
                    </td>
                    {selectedAreas.map((area, colIndex) => {
                      const rawValue = metric.key === 'score' ? area.score :
                                       metric.key === 'opportunityScore' ? area.opportunityScore :
                                       metric.key === 'feasibilityScore' ? area.feasibilityScore :
                                       metric.key === 'population' ? area.population :
                                       metric.key === 'demand' ? area.demand :
                                       metric.key === 'incomeValue' ? area.incomeValue :
                                       area.competition;
                      const displayValue = metric.key === 'population' ? (area.population || 0).toLocaleString() :
                                           metric.key === 'competition' ? `${Number(area.competition || 0).toFixed(2)}%` :
                                           metric.key === 'demand' ? `${Number(area.demand || 0).toFixed(2)}%` :
                                           metric.key === 'incomeValue' ? area.incomeLevel || '-' :
                                           rawValue != null ? rawValue : '-';
                      const numericValues = selectedAreas.map(a => Number(a[metric.key]) || 0);
                      const isBest = metric.isHigherBetter
                        ? rawValue === Math.max(...numericValues)
                        : rawValue === Math.min(...numericValues);
                      return (
                        <td key={colIndex} className="text-center p-2 sm:p-3">
                          <span className={`inline-flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-sm font-extrabold ${
                            isBest && rawValue != null 
                              ? isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700' 
                              : isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {displayValue}
                            {isBest && rawValue != null && <Star className="text-yellow-500 fill-yellow-500" size={12} />}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-[#2563eb]" size={24} />
            <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Rankings
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[...selectedAreas].sort((a, b) => b.score - a.score).map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (index * 0.1) }}
                className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl border flex items-center gap-3 sm:gap-4 ${index === 0 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-300 text-white'}`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h4>
                  <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {area.district} • {area.pincode}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg sm:text-2xl font-bold ${index === 0 ? 'text-yellow-600 dark:text-yellow-400' : isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {Number(area.score || 0).toFixed(2)}
                  </div>
                  <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    Score
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Areas Sortable Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 mb-6 ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="text-blue-600" size={20} />
            <h3 className={`text-sm sm:text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              All Areas – Sortable Table
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
              {availableAreas.length} areas
            </span>
          </div>

          <div className={`overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 rounded-lg border-2 ${isDarkMode ? 'border-[#475569]' : 'border-slate-200'}`}>
            <table className="w-full text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className={isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-100'}>
                  {[
                    { label: 'Area', hideClass: '' },
                    { label: 'Pincode', hideClass: 'hidden sm:table-cell' },
                    { label: 'District', hideClass: 'hidden md:table-cell' },
                    { label: 'Population', hideClass: 'hidden md:table-cell' },
                    { label: 'Growth%', hideClass: 'hidden lg:table-cell' },
                    { label: 'Income', hideClass: 'hidden lg:table-cell' },
                    { label: 'Opp.Score', hideClass: '' },
                    { label: 'Feas.Score', hideClass: '' },
                    { label: 'Gap Score', hideClass: '' },
                    { label: 'Demand', hideClass: '' }
                  ].map(({ label: col, hideClass }) => (
                    <th key={col}
                      onClick={() => {
                        const sortMap = { 'Area': 'name', 'Pincode': 'pincode', 'District': 'district', 'Population': 'population', 'Growth%': 'populationGrowth', 'Income': 'incomeValue', 'Opp.Score': 'opportunityScore', 'Feas.Score': 'feasibilityScore', 'Gap Score': 'score', 'Demand': 'demand' };
                        const key = sortMap[col];
                        if (!key) return;
                        setSortConfig(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
                      }}
                      className={`${hideClass} text-left p-3 text-[10px] font-extrabold uppercase tracking-wider cursor-pointer select-none transition-colors hover:bg-blue-50 dark:hover:bg-[#1e293b] ${isDarkMode ? 'text-slate-300 hover:text-blue-300' : 'text-slate-600 hover:text-blue-700'}`}
                    >
                      <div className="flex items-center gap-1">
                        {col}
                        {sortConfig.key === ({ 'Area': 'name', 'Pincode': 'pincode', 'District': 'district', 'Population': 'population', 'Growth%': 'populationGrowth', 'Income': 'incomeValue', 'Opp.Score': 'opportunityScore', 'Feas.Score': 'feasibilityScore', 'Gap Score': 'score', 'Demand': 'demand' }[col]) && (
                          <span className="text-blue-500">{sortConfig.dir === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...availableAreas]
                  .sort((a, b) => {
                    const aVal = a[sortConfig.key] ?? 0;
                    const bVal = b[sortConfig.key] ?? 0;
                    if (typeof aVal === 'string') {
                      return sortConfig.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                    }
                    return sortConfig.dir === 'asc' ? aVal - bVal : bVal - aVal;
                  })
                  .map((area, i) => (
                    <motion.tr key={area.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}
                      className={`border-t-2 transition-colors ${isDarkMode ? 'border-[#475569] hover:bg-[#0f172a]/60' : 'border-slate-200 hover:bg-blue-50/50'}`}
                    >
                      <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{area.name}</td>
                      <td className={`hidden sm:table-cell p-3 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{area.pincode}</td>
                      <td className={`hidden md:table-cell p-3 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{area.district}</td>
                      <td className={`hidden md:table-cell p-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{(area.population || 0).toLocaleString()}</td>
                      <td className={`hidden lg:table-cell p-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{Number(area.populationGrowth || 0).toFixed(2)}%</td>
                      <td className={`hidden lg:table-cell p-3 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{area.incomeLevel || '-'}</td>
                      <td className={`p-3 font-extrabold ${area.opportunityScore >= 70 ? 'text-emerald-500' : area.opportunityScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{area.opportunityScore != null ? Number(area.opportunityScore).toFixed(2) : '-'}</td>
                      <td className={`p-3 font-extrabold ${area.feasibilityScore >= 70 ? 'text-emerald-500' : area.feasibilityScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{area.feasibilityScore != null ? Number(area.feasibilityScore).toFixed(2) : '-'}</td>
                      <td className={`p-3 font-extrabold ${area.score >= 70 ? 'text-emerald-500' : area.score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{Number(area.score || 0).toFixed(2)}</td>
                      <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{Number(area.demand || 0).toFixed(2)}%</td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          <Link 
            to="/ai-recommendations"
            className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
              <Star className="text-white" size={24} />
            </div>
            <div className="min-w-0">
              <h4 className={`font-bold mb-1 text-sm sm:text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>AI Recommendations</h4>
              <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Get smart suggestions</p>
            </div>
            <ChevronRight className={`ml-auto flex-shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>

          <Link 
            to="/forecast"
            className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div className="min-w-0">
              <h4 className={`font-bold mb-1 text-sm sm:text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>View Forecast</h4>
              <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Future predictions</p>
            </div>
            <ChevronRight className={`ml-auto flex-shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>

          <Link 
            to="/reports"
            className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div className="min-w-0">
              <h4 className={`font-bold mb-1 text-sm sm:text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Export Report</h4>
              <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Download comparison</p>
            </div>
            <ChevronRight className={`ml-auto flex-shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>
        </motion.div>

        {/* Add Area Modal */}
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border max-w-md w-full ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Add Area to Compare
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`p-2 rounded-lg ${isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableAreas
                  .filter(area => !selectedAreas.find(a => a.id === area.id))
                  .map(area => (
                    <button
                      key={area.id}
                      onClick={() => addArea(area)}
                      className={`w-full p-4 rounded-xl border text-left transition-all hover:border-[#2563eb] ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b]'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{area.name}</h4>
                          <p className="text-sm opacity-70">{area.district} • {area.pincode}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#2563eb]">{Number(area.score || 0).toFixed(2)}</div>
                          <p className="text-xs opacity-70">Score</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>

              {availableAreas.filter(area => !selectedAreas.find(a => a.id === area.id)).length === 0 && (
                <p className={`text-center py-8 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  No more areas available to compare
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Comparison;
