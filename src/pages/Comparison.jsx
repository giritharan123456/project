import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ArrowLeft, Plus, X, TrendingUp, TrendingDown, BarChart3, 
  Users, DollarSign, Target, Award, MapPin, Star, ChevronDown,
  Filter, Search, ArrowRight, Crown
} from 'lucide-react';

function Comparison() {
  const { isDarkMode } = useTheme();
  const [selectedAreas, setSelectedAreas] = useState([
    { id: 1, name: 'T. Nagar', pincode: '600017', district: 'Chennai', score: 92, population: 125000, competition: 78, demand: 95 },
    { id: 2, name: 'Anna Nagar', pincode: '600040', district: 'Chennai', score: 85, population: 180000, competition: 82, demand: 88 }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);

  const availableAreas = [
    { id: 3, name: 'Adyar', pincode: '600020', district: 'Chennai', score: 78, population: 95000, competition: 65, demand: 82 },
    { id: 4, name: 'Mylapore', pincode: '600004', district: 'Chennai', score: 88, population: 110000, competition: 70, demand: 90 },
    { id: 5, name: 'Velachery', pincode: '600042', district: 'Chennai', score: 82, population: 145000, competition: 75, demand: 86 },
    { id: 6, name: 'Perambur', pincode: '600011', district: 'Chennai', score: 75, population: 135000, competition: 80, demand: 80 }
  ];

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
    return selectedAreas.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  };

  const winner = getWinner();

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
                <BarChart3 className="text-[#2563eb]" size={28} />
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Area Comparison
                </h1>
              </div>
              <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Compare multiple locations side by side
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {selectedAreas.map((area, index) => {
            const isWinner = area.id === winner.id;
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className={`p-6 rounded-2xl border-2 relative ${isWinner ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
              >
                {isWinner && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="text-white" size={16} />
                  </div>
                )}
                
                <button
                  onClick={() => removeArea(area.id)}
                  className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="text-[#2563eb]" size={20} />
                  <h3 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h3>
                </div>
                <p className={`text-sm opacity-70 mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {area.district} • {area.pincode}
                </p>

                <div className="text-center mb-4">
                  <div className={`text-4xl font-extrabold ${isWinner ? 'text-yellow-600 dark:text-yellow-400' : 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent'}`}>
                    {area.score}
                  </div>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    Market Score
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {area.population.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competition</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {area.competition}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {area.demand}%
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
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Detailed Comparison
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                  <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Metric</th>
                  {selectedAreas.map(area => (
                    <th key={area.id} className={`text-center p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {area.name}
                      {area.id === winner.id && <Crown className="inline ml-1 text-yellow-500" size={16} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Market Score', icon: Award, isHigherBetter: true },
                  { label: 'Population', icon: Users, isHigherBetter: true },
                  { label: 'Competition', icon: Target, isHigherBetter: false },
                  { label: 'Demand', icon: TrendingUp, isHigherBetter: true },
                  { label: 'Avg. Income', icon: DollarSign, isHigherBetter: true }
                ].map((metric, rowIndex) => (
                  <tr key={rowIndex} className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                    <td className={`p-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      <div className="flex items-center gap-2">
                        <metric.icon className="text-[#2563eb]" size={16} />
                        {metric.label}
                      </div>
                    </td>
                    {selectedAreas.map((area, colIndex) => {
                      const value = metric.label === 'Market Score' ? area.score :
                                   metric.label === 'Population' ? area.population.toLocaleString() :
                                   metric.label === 'Competition' ? `${area.competition}%` :
                                   metric.label === 'Demand' ? `${area.demand}%` : '₹45K';
                      const isBest = metric.isHigherBetter 
                        ? value === Math.max(...selectedAreas.map(a => 
                            metric.label === 'Market Score' ? a.score :
                            metric.label === 'Population' ? a.population :
                            metric.label === 'Competition' ? a.competition :
                            metric.label === 'Demand' ? a.demand : 45
                          ))
                        : value === Math.min(...selectedAreas.map(a => 
                            metric.label === 'Competition' ? a.competition : 0
                          ));
                      return (
                        <td key={colIndex} className="text-center p-4">
                          <span className={`font-semibold ${isBest ? 'text-green-500' : isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                            {value}
                          </span>
                          {isBest && <Star className="inline ml-1 text-yellow-500 fill-yellow-500" size={14} />}
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
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Rankings
            </h3>
          </div>

          <div className="space-y-4">
            {[...selectedAreas].sort((a, b) => b.score - a.score).map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (index * 0.1) }}
                className={`p-4 rounded-xl border flex items-center gap-4 ${index === 0 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-300 text-white'}`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h4>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {area.district} • {area.pincode}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${index === 0 ? 'text-yellow-600 dark:text-yellow-400' : isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {area.score}
                  </div>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    Score
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link 
            to="/ai-recommendations"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <Star className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>AI Recommendations</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Get smart suggestions</p>
            </div>
            <ChevronRight className={`ml-auto ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>

          <Link 
            to="/forecast"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>View Forecast</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Future predictions</p>
            </div>
            <ChevronRight className={`ml-auto ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>

          <Link 
            to="/reports"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Export Report</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Download comparison</p>
            </div>
            <ChevronRight className={`ml-auto ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
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
              className={`p-6 rounded-2xl border max-w-md w-full ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
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
                          <div className="text-lg font-bold text-[#2563eb]">{area.score}</div>
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
