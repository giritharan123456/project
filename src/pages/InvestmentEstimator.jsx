import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { explorerAPI, areasAPI } from '../services/api';

function InvestmentEstimator() {
  const { isDarkMode } = useTheme();
  const { districts, selectedDistrict, setSelectedDistrict } = useDistrict();
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const b = (light, dark) => isDarkMode ? dark : light;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const res = await explorerAPI.getCategories({});
      if (res.success) setCategories(res.categories);
    } catch (err) { console.error('Failed to load categories:', err); }
  };

  useEffect(() => {
    if (selectedDistrict) {
      loadAreas(selectedDistrict);
    } else {
      setAreas([]);
    }
  }, [selectedDistrict]);

  const loadAreas = async (districtId) => {
    try {
      const res = await areasAPI.getByDistrict(districtId);
      if (res.success) setAreas(res.data || []);
    } catch (err) { console.error('Failed to load areas:', err); }
  };

  const handleEstimate = async () => {
    if (!selectedCategory || !selectedArea) return;
    setLoading(true);
    try {
      const res = await explorerAPI.getEstimate({
        category: selectedCategory,
        areaId: selectedArea,
      });
      if (res.success) setEstimate(res.estimate);
      setLoaded(true);
    } catch (err) { console.error('Failed to get estimate:', err); } finally { setLoading(false); }
  };

  const formatCurrency = (val) => {
    if (val == null) return '-';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)} K`;
    return `₹${val}`;
  };

  return (
    <div className={`min-h-[calc(100vh-120px)] p-4 lg:p-8 transition-colors ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${b('text-gray-900', 'text-white')}`}>Investment Estimator</h1>
          <p className={`text-sm ${b('text-gray-500', 'text-gray-400')}`}>Get estimated investment range for any business category in a location</p>
        </div>

        <motion.div className={`rounded-xl border p-6 mb-6 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Business Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Select District</label>
              <select value={selectedDistrict || ''} onChange={(e) => setSelectedDistrict(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                <option value="">Select district</option>
                {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className={`block text-xs font-semibold mb-1 uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Select Area</label>
            <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
              <option value="">Select area</option>
              {areas.map(a => <option key={a._id} value={a._id}>{a.name} ({a.pincode})</option>)}
            </select>
            {!selectedDistrict && <p className={`text-xs mt-1 ${b('text-gray-400', 'text-gray-500')}`}>Select a district first</p>}
          </div>
          <button onClick={handleEstimate} disabled={!selectedCategory || !selectedArea || loading}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}>
            {loading ? 'Calculating...' : 'Get Estimate'}
          </button>
        </motion.div>

        {estimate && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-6 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
            <h2 className={`text-lg font-bold mb-4 ${b('text-gray-900', 'text-white')}`}>Investment Estimate Breakdown</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className={`p-4 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                <p className={`text-xs uppercase tracking-wider mb-1 ${b('text-gray-500', 'text-gray-400')}`}>Estimated Range</p>
                <p className="text-2xl font-bold text-green-500">{formatCurrency(estimate.minTotal)} – {formatCurrency(estimate.maxTotal)}</p>
                <p className={`text-xs mt-1 ${b('text-gray-400', 'text-gray-500')}`}>Base: {formatCurrency(estimate.baseMin)} – {formatCurrency(estimate.baseMax)}</p>
              </div>
              <div className={`p-4 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                <p className={`text-xs uppercase tracking-wider mb-1 ${b('text-gray-500', 'text-gray-400')}`}>Location Multiplier</p>
                <p className="text-2xl font-bold text-blue-500">{estimate.locationMultiplier?.toFixed(2)}x</p>
                <p className={`text-xs mt-1 ${b('text-gray-400', 'text-gray-500')}`}>Based on income, growth, and demand</p>
              </div>
            </div>
            <h3 className={`font-semibold text-sm mb-3 ${b('text-gray-700', 'text-gray-300')}`}>Cost Components</h3>
            <div className="space-y-2">
              {(estimate.breakdown || []).map((item, i) => (
                <div key={i} className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                  <span className={b('text-gray-600', 'text-gray-300')}>{item.label}</span>
                  <span className="font-semibold">{formatCurrency(item.min)} – {formatCurrency(item.max)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default InvestmentEstimator;
