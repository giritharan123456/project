import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { useToast } from '../contexts/ToastContext';
import { explorerAPI, areasAPI } from '../services/api';
import { MapPin, TrendingUp, Calculator, Download, ChevronDown } from 'lucide-react';

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
    try {
      const res = await explorerAPI.getEstimate({ category: selectedCategory, areaId: selectedArea });
      if (res.success) setEstimate(res.estimate);
      setLoaded(true);
    } catch { toastError('Failed to calculate estimate'); } finally { setLoading(false); }
  };

  const formatCurrency = (val) => {
    if (val == null) return '-';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)} K`;
    return `₹${val}`;
  };

  const exportPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    const catName = categories.find(c => c._id === selectedCategory)?.name || '';
    const areaObj = areas.find(a => a._id === selectedArea);
    const areaName = areaObj ? `${areaObj.name} (${areaObj.pincode})` : '';

    doc.setFontSize(18);
    doc.text('Investment Estimate Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Category: ${catName}`, 14, 32);
    doc.text(`Area: ${areaName}`, 14, 38);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 44);

    doc.setFontSize(12);
    doc.text(`Estimated Range: ${formatCurrency(estimate.minTotal)} – ${formatCurrency(estimate.maxTotal)}`, 14, 56);
    doc.text(`Location Multiplier: ${estimate.locationMultiplier?.toFixed(2)}x`, 14, 64);
    doc.text(`Base Range: ${formatCurrency(estimate.baseMin)} – ${formatCurrency(estimate.baseMax)}`, 14, 72);

    const rows = (estimate.breakdown || []).map(item => [item.label, `${formatCurrency(item.min)} – ${formatCurrency(item.max)}`]);
    autoTable(doc, {
      startY: 82,
      head: [['Component', 'Range']],
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`investment-estimate-${areaObj?.pincode || 'report'}.pdf`);
  };

  return (
    <div className={`min-h-[calc(100vh-120px)] px-3 sm:px-4 py-4 sm:py-8 transition-colors ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-xl sm:text-2xl font-bold ${b('text-gray-900', 'text-white')}`}>Investment Estimator</h1>
          <p className={`text-xs sm:text-sm ${b('text-gray-500', 'text-gray-400')}`}>Get estimated investment range for any business category in a location</p>
        </div>

        <motion.div className={`rounded-xl border p-4 sm:p-6 mb-6 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-[10px] sm:text-xs font-semibold mb-1.5 uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Business Category</label>
              <div className="relative">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-3 py-2.5 pr-8 rounded-lg border text-sm outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>
            <div>
              <label className={`block text-[10px] sm:text-xs font-semibold mb-1.5 uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Select District</label>
              <div className="relative">
                <select value={selectedDistrict || ''} onChange={(e) => setSelectedDistrict(e.target.value)}
                  className={`w-full px-3 py-2.5 pr-8 rounded-lg border text-sm outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                  <option value="">Select district</option>
                  {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label className={`block text-[10px] sm:text-xs font-semibold mb-1.5 uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Select Area</label>
            <div className="relative">
              <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}
                className={`w-full px-3 py-2.5 pr-8 rounded-lg border text-sm outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                <option value="">Select area</option>
                {areas.map(a => <option key={a._id} value={a._id}>{a.name} ({a.pincode})</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
            </div>
            {!selectedDistrict && <p className={`text-[10px] sm:text-xs mt-1 ${b('text-gray-400', 'text-gray-500')}`}>Select a district first</p>}
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
              <h2 className={`text-base sm:text-lg font-bold ${b('text-gray-900', 'text-white')}`}>Investment Estimate Breakdown</h2>
              <button onClick={exportPDF}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white hover:shadow-lg hover:-translate-y-0.5`}>
                <Download size={14} /> Download PDF
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-xl ${b('bg-green-50 border border-green-100', 'bg-green-900/20 border border-green-800/30')}`}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} className="text-green-500" />
                  <p className={`text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${b('text-green-600', 'text-green-400')}`}>Estimated Range</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-green-500">{formatCurrency(estimate.minTotal)} – {formatCurrency(estimate.maxTotal)}</p>
                <p className={`text-[10px] sm:text-xs mt-1 ${b('text-green-600/70', 'text-green-400/70')}`}>Base: {formatCurrency(estimate.baseMin)} – {formatCurrency(estimate.baseMax)}</p>
              </div>
              <div className={`p-4 rounded-xl ${b('bg-blue-50 border border-blue-100', 'bg-blue-900/20 border border-blue-800/30')}`}>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-blue-500" />
                  <p className={`text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${b('text-blue-600', 'text-blue-400')}`}>Location Multiplier</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-blue-500">{estimate.locationMultiplier?.toFixed(2)}x</p>
                <p className={`text-[10px] sm:text-xs mt-1 ${b('text-blue-600/70', 'text-blue-400/70')}`}>Based on income, growth & demand</p>
              </div>
            </div>

            <h3 className={`font-semibold text-sm mb-3 ${b('text-gray-700', 'text-gray-300')}`}>Cost Components</h3>
            <div className="space-y-2">
              {(estimate.breakdown || []).map((item, i) => (
                <div key={i} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-3 rounded-lg ${b('bg-gray-50 border border-gray-100', 'bg-[#0f172a] border border-[#1e293b]')}`}>
                  <span className={`text-xs sm:text-sm ${b('text-gray-600', 'text-gray-400')}`}>{item.label}</span>
                  <span className={`font-semibold text-xs sm:text-sm mt-1 sm:mt-0 ${b('text-gray-900', 'text-white')}`}>{formatCurrency(item.min)} – {formatCurrency(item.max)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {!estimate && loaded && (
          <div className={`text-center py-12 rounded-xl border ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
            <Calculator size={40} className={`mx-auto mb-3 ${b('text-gray-300', 'text-gray-600')}`} />
            <p className={`text-sm ${b('text-gray-500', 'text-gray-400')}`}>Select a category and area, then click Get Estimate</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvestmentEstimator;
