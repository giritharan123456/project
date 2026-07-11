import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { useToast } from '../contexts/ToastContext';
import { explorerAPI, areasAPI } from '../services/api';
import { Calculator, Download, ChevronDown, TrendingUp, MapPin, IndianRupee, BarChart3, Info } from 'lucide-react';

function InvestmentEstimator() {
  const { isDarkMode } = useTheme();
  const { error: toastError } = useToast();
  const { districts, selectedDistrict, setSelectedDistrict } = useDistrict();
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const b = (light, dark) => isDarkMode ? dark : light;

  useEffect(() => { loadInitialData(); }, []);

  const loadInitialData = async () => {
    try {
      const res = await explorerAPI.getCategories({});
      if (res.success) setCategories(res.categories);
    } catch { toastError('Failed to load categories'); }
  };

  useEffect(() => {
    if (selectedDistrict) { loadAreas(selectedDistrict); } else { setAreas([]); setSelectedArea(''); }
  }, [selectedDistrict]);

  const loadAreas = async (districtId) => {
    try {
      const res = await areasAPI.getByDistrict(districtId);
      if (res.success) setAreas(res.data || []);
    } catch { toastError('Failed to load areas'); }
  };

  const handleEstimate = async () => {
    if (!selectedCategory || !selectedArea) return;
    setLoading(true);
    setEstimate(null);
    try {
      const res = await explorerAPI.getEstimate({ category: selectedCategory, areaId: selectedArea });
      if (res.success) setEstimate(res.estimate);
      setLoaded(true);
    } catch { toastError('Failed to calculate estimate'); } finally { setLoading(false); }
  };

  const formatCurrency = (val) => {
    if (val == null || isNaN(val)) return '-';
    if (val >= 10000000) return `\u20B9${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `\u20B9${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `\u20B9${(val / 1000).toFixed(0)} K`;
    return `\u20B9${val}`;
  };

  const getAreaInsights = () => {
    if (!estimate?.area || !selectedArea) return null;
    const areaObj = areas.find(a => a._id === selectedArea);
    if (!areaObj) return null;
    const insights = [];
    if (areaObj.incomeLevel === 'High') insights.push({ icon: TrendingUp, color: 'green', text: 'High-income area — premium pricing possible' });
    else if (areaObj.incomeLevel === 'Medium') insights.push({ icon: TrendingUp, color: 'blue', text: 'Medium-income area — balanced pricing' });
    else insights.push({ icon: TrendingUp, color: 'yellow', text: 'Low-income area — budget-friendly approach' });

    if ((areaObj.populationGrowth || 0) > 1.5) insights.push({ icon: BarChart3, color: 'green', text: `Growing area (${areaObj.populationGrowth}% growth) — good long-term bet` });
    else if ((areaObj.populationGrowth || 0) > 0) insights.push({ icon: BarChart3, color: 'blue', text: `Stable area (${areaObj.populationGrowth}% growth)` });

    if ((areaObj.population || 0) > 50000) insights.push({ icon: MapPin, color: 'purple', text: `Large population (${(areaObj.population).toLocaleString()}) — high footfall potential` });

    return insights;
  };

  const breakdownLabels = {
    'Base Investment': 'Standard setup cost for this business type',
    'Income Level Adjustment': 'How local income affects costs',
    'Growth Premium': 'Area growth rate impact on investment',
    'Demand Multiplier': 'Market demand effect on expected spend',
  };

  const getMultiplierLabel = (mult) => {
    if (mult == null || isNaN(mult)) return 'Location data incomplete';
    if (mult >= 1.3) return 'Premium location — higher setup cost but strong returns';
    if (mult >= 1.0) return 'Good location — standard investment range';
    if (mult >= 0.7) return 'Budget-friendly area — lower setup cost';
    return 'Low-cost area — minimal investment needed';
  };

  const insights = getAreaInsights();
  const mult = estimate?.locationMultiplier;

  return (
    <div className={`min-h-[calc(100vh-120px)] px-3 sm:px-4 py-4 sm:py-8 transition-colors ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-xl sm:text-2xl font-bold ${b('text-gray-900', 'text-white')}`}>Investment Estimator</h1>
          <p className={`text-xs sm:text-sm ${b('text-gray-500', 'text-gray-400')}`}>See estimated investment range for any business in any location</p>
        </div>

        <motion.div className={`rounded-xl border p-4 sm:p-6 mb-6 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-[10px] sm:text-xs font-semibold mb-1.5 uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Business Type</label>
              <div className="relative">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-3 py-2.5 pr-8 rounded-lg border text-sm outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                  <option value="">Choose business type</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>
            <div>
              <label className={`block text-[10px] sm:text-xs font-semibold mb-1.5 uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>District</label>
              <div className="relative">
                <select value={selectedDistrict || ''} onChange={(e) => setSelectedDistrict(e.target.value)}
                  className={`w-full px-3 py-2.5 pr-8 rounded-lg border text-sm outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                  <option value="">Choose district</option>
                  {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label className={`block text-[10px] sm:text-xs font-semibold mb-1.5 uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Area / Pincode</label>
            <div className="relative">
              <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}
                className={`w-full px-3 py-2.5 pr-8 rounded-lg border text-sm outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                <option value="">Choose area</option>
                {areas.map(a => <option key={a._id} value={a._id}>{a.name} ({a.pincode})</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
            </div>
            {!selectedDistrict && <p className={`text-[10px] sm:text-xs mt-1 flex items-center gap-1 ${b('text-gray-400', 'text-gray-500')}`}><Info size={10} /> Select a district first to see areas</p>}
          </div>
          <button onClick={handleEstimate} disabled={!selectedCategory || !selectedArea || loading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-lg ${
              loading ? 'bg-blue-400 cursor-wait' : 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] hover:shadow-xl hover:-translate-y-0.5'
            } disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto`}>
            <Calculator size={16} />
            {loading ? 'Calculating...' : 'Get Estimate'}
          </button>
        </motion.div>

        {estimate && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-4 sm:p-6 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
              <div>
                <h2 className={`text-base sm:text-lg font-bold ${b('text-gray-900', 'text-white')}`}>Investment Estimate</h2>
                {estimate.area && (
                  <p className={`text-[10px] sm:text-xs mt-0.5 ${b('text-gray-500', 'text-gray-400')}`}>
                    {estimate.area.name} ({estimate.area.pincode}), {estimate.area.district}
                  </p>
                )}
              </div>
              <button onClick={() => {}} className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white hover:shadow-lg hover:-translate-y-0.5`}>
                <Download size={14} /> Save Report
              </button>
            </div>

            <div className={`p-5 rounded-xl mb-6 ${b('bg-green-50 border border-green-100', 'bg-green-900/20 border border-green-800/30')}`}>
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee size={18} className="text-green-500" />
                <p className={`text-xs sm:text-sm uppercase tracking-wider font-semibold ${b('text-green-600', 'text-green-400')}`}>Estimated Investment Range</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-500">{formatCurrency(estimate.minTotal)} \u2013 {formatCurrency(estimate.maxTotal)}</p>
              <p className={`text-[10px] sm:text-xs mt-2 ${b('text-green-600/70', 'text-green-400/70')}`}>
                Standard range: {formatCurrency(estimate.baseMin)} \u2013 {formatCurrency(estimate.baseMax)} for this business type
              </p>
            </div>

            {mult != null && !isNaN(mult) && (
              <div className={`p-4 rounded-xl mb-6 ${b('bg-blue-50 border border-blue-100', 'bg-blue-900/20 border border-blue-800/30')}`}>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-blue-500" />
                  <p className={`text-xs sm:text-sm font-semibold ${b('text-blue-600', 'text-blue-400')}`}>Area Cost Factor: {mult.toFixed(2)}x</p>
                </div>
                <p className={`text-[10px] sm:text-xs ${b('text-blue-600/70', 'text-blue-400/70')}`}>{getMultiplierLabel(mult)}</p>
              </div>
            )}

            {insights && insights.length > 0 && (
              <div className={`p-4 rounded-xl mb-6 ${b('bg-purple-50 border border-purple-100', 'bg-purple-900/20 border border-purple-800/30')}`}>
                <p className={`text-xs font-semibold mb-2 ${b('text-purple-600', 'text-purple-400')}`}>Area Insights</p>
                <div className="space-y-1.5">
                  {insights.map((ins, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <ins.icon size={12} className={`text-${ins.color}-500`} />
                      <span className={`text-[10px] sm:text-xs ${b('text-gray-600', 'text-gray-300')}`}>{ins.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 className={`font-semibold text-sm mb-3 ${b('text-gray-700', 'text-gray-300')}`}>How We Calculated This</h3>
            <div className="space-y-2">
              {(estimate.breakdown || []).map((item, i) => {
                const val = Math.abs(item.max - item.min);
                const pct = estimate.baseMax > 0 ? Math.min(100, Math.round((val / estimate.baseMax) * 100)) : 0;
                const isNegative = item.min < 0 || item.max < 0;
                return (
                  <div key={i} className={`px-4 py-3 rounded-lg ${b('bg-gray-50 border border-gray-100', 'bg-[#0f172a] border border-[#1e293b]')}`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div>
                        <span className={`text-xs sm:text-sm font-medium ${b('text-gray-700', 'text-gray-300')}`}>{item.label}</span>
                        <p className={`text-[10px] mt-0.5 ${b('text-gray-400', 'text-gray-500')}`}>{breakdownLabels[item.label] || 'Adjustment based on area data'}</p>
                      </div>
                      <span className={`font-semibold text-xs sm:text-sm ${isNegative ? 'text-red-500' : 'text-green-600'} ${b('', isNegative ? '' : 'text-green-400')}`}>
                        {formatCurrency(item.min)} \u2013 {formatCurrency(item.max)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {!estimate && loaded && (
          <div className={`text-center py-12 rounded-xl border ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
            <Calculator size={40} className={`mx-auto mb-3 ${b('text-gray-300', 'text-gray-600')}`} />
            <p className={`text-sm ${b('text-gray-500', 'text-gray-400')}`}>Select a business type and area, then click Get Estimate</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvestmentEstimator;
