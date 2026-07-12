import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { useToast } from '../contexts/ToastContext';
import { explorerAPI, areasAPI } from '../services/api';
import { Calculator, ChevronDown, TrendingUp, TrendingDown, IndianRupee, Users, Clock, BarChart3, Target, Store } from 'lucide-react';

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
    } catch { toastError('Failed to calculate estimate'); } finally { setLoading(false); }
  };

  const fmt = (val) => {
    if (val == null || isNaN(val)) return '-';
    if (val >= 10000000) return 'Rs. ' + (val / 10000000).toFixed(2) + ' Cr';
    if (val >= 100000) return 'Rs. ' + (val / 100000).toFixed(2) + ' L';
    if (val >= 1000) return 'Rs. ' + (val / 1000).toFixed(0) + 'K';
    return 'Rs. ' + val;
  };

  const ctx = estimate?.areaContext;
  const market = ctx?.market;
  const revenue = ctx?.revenue;
  const costs = ctx?.monthlyCosts;
  const profit = ctx?.profit;
  const roi = ctx?.roi;

  return (
    <div className={`min-h-[calc(100vh-120px)] px-3 sm:px-4 py-4 sm:py-8 transition-colors ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-xl sm:text-2xl font-bold ${b('text-gray-900', 'text-white')}`}>Investment Estimator</h1>
          <p className={`text-xs sm:text-sm ${b('text-gray-500', 'text-gray-400')}`}>Calculate investment, monthly costs, revenue potential, and ROI for any business</p>
        </div>

        <motion.div className={`rounded-xl border p-4 sm:p-6 mb-6 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={`block text-[10px] sm:text-xs font-semibold mb-1.5 uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Business Type</label>
              <div className="relative">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-3 py-2.5 pr-8 rounded-lg border text-sm outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                  <option value="">Choose business</option>
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
            <div>
              <label className={`block text-[10px] sm:text-xs font-semibold mb-1.5 uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Area</label>
              <div className="relative">
                <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}
                  className={`w-full px-3 py-2.5 pr-8 rounded-lg border text-sm outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                  <option value="">Choose area</option>
                  {areas.map(a => <option key={a._id} value={a._id}>{a.name} ({a.pincode})</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
          <button onClick={handleEstimate} disabled={!selectedCategory || !selectedArea || loading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-lg ${
              loading ? 'bg-blue-400 cursor-wait' : 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] hover:shadow-xl hover:-translate-y-0.5'
            } disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto`}>
            <Calculator size={16} />
            {loading ? 'Calculating...' : 'Calculate Investment'}
          </button>
        </motion.div>

        {estimate && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className={`rounded-xl border p-4 sm:p-5 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <div>
                  <h2 className={`text-base sm:text-lg font-bold ${b('text-gray-900', 'text-white')}`}>{estimate.category} Investment</h2>
                  {ctx?.areaInfo && <p className={`text-[10px] sm:text-xs ${b('text-gray-500', 'text-gray-400')}`}>{ctx.areaInfo.name} ({ctx.areaInfo.pincode}), {ctx.areaInfo.district}</p>}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${market?.marketSaturation === 'Low' ? 'bg-green-100 text-green-700' : market?.marketSaturation === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  Competition: {market?.marketSaturation || '-'}
                </div>
              </div>
              <p className={`text-xs ${b('text-gray-500', 'text-gray-400')}`}>{estimate.description || 'Estimated costs based on area data and market conditions'}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard icon={IndianRupee} label="Investment Needed" value={`${fmt(estimate.minTotal)}  to  ${fmt(estimate.maxTotal)}`} sub="One-time setup cost" color="green" b={b} />
              <StatCard icon={TrendingUp} label="Monthly Revenue" value={`${fmt(revenue?.monthlyMin)}  to  ${fmt(revenue?.monthlyMax)}`} sub={`${revenue?.dailyCustomersMin} to ${revenue?.dailyCustomersMax} customers/day`} color="blue" b={b} />
              <StatCard icon={TrendingDown} label="Monthly Costs" value={`${fmt(costs?.totalMin)}  to  ${fmt(costs?.totalMax)}`} sub="Rent + staff + utilities" color="orange" b={b} />
              <StatCard icon={Target} label="Monthly Profit" value={profit?.monthlyMax > 0 ? `${fmt(profit?.monthlyMin)}  to  ${fmt(profit?.monthlyMax)}` : 'Low margin'} sub={roi?.breakEvenMonths ? `Break-even: ${roi.breakEvenMonths} months` : 'Check market conditions'} color={profit?.monthlyMax > 0 ? 'green' : 'red'} b={b} />
            </div>

            {roi && (roi.annualROI != null || roi.breakEvenMonths != null) && (
              <div className={`grid grid-cols-2 gap-3`}>
                {roi.breakEvenMonths && (
                  <div className={`rounded-xl border p-3 sm:p-4 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
                    <div className="flex items-center gap-2 mb-2"><Clock size={16} className="text-purple-500" /><span className={`text-xs font-semibold ${b('text-gray-600', 'text-gray-400')}`}>Break-Even Period</span></div>
                    <p className={`text-2xl font-bold ${b('text-gray-900', 'text-white')}`}>{roi.breakEvenMonths} months</p>
                    <p className={`text-[10px] mt-1 ${b('text-gray-400', 'text-gray-500')}`}>{roi.breakEvenMonths <= 12 ? 'Excellent — fast payback' : roi.breakEvenMonths <= 24 ? 'Good — reasonable recovery' : 'Longer payback period'}</p>
                  </div>
                )}
                {roi.annualROI != null && (
                  <div className={`rounded-xl border p-3 sm:p-4 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
                    <div className="flex items-center gap-2 mb-2"><BarChart3 size={16} className="text-emerald-500" /><span className={`text-xs font-semibold ${b('text-gray-600', 'text-gray-400')}`}>Expected Annual ROI</span></div>
                    <p className={`text-2xl font-bold ${roi.annualROI > 20 ? 'text-emerald-500' : roi.annualROI > 0 ? 'text-yellow-500' : 'text-red-500'}`}>{roi.annualROI}%</p>
                    <p className={`text-[10px] mt-1 ${b('text-gray-400', 'text-gray-500')}`}>{roi.annualROI > 30 ? 'Excellent return potential' : roi.annualROI > 15 ? 'Good return on investment' : 'Conservative estimate'}</p>
                  </div>
                )}
              </div>
            )}

            {costs && (
              <div className={`rounded-xl border p-4 sm:p-5 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
                <h3 className={`text-sm font-bold mb-3 ${b('text-gray-900', 'text-white')}`}>Monthly Running Costs</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <CostItem label="Rent" value={costs.rent} b={b} />
                  <CostItem label="Staff (2-3 people)" value={costs.staff} b={b} />
                  <CostItem label="Utilities & Internet" value={costs.utilities} b={b} />
                  <CostItem label="Marketing & Misc" value={costs.misc} b={b} />
                </div>
                <div className={`mt-3 pt-3 border-t flex justify-between items-center ${b('border-gray-100', 'border-[#334155]')}`}>
                  <span className={`text-xs font-semibold ${b('text-gray-600', 'text-gray-400')}`}>Total Monthly Cost</span>
                  <span className={`text-sm font-bold ${b('text-gray-900', 'text-white')}`}>{fmt(costs.totalMin)}  to  {fmt(costs.totalMax)}</span>
                </div>
              </div>
            )}

            {revenue && (
              <div className={`rounded-xl border p-4 sm:p-5 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
                <h3 className={`text-sm font-bold mb-3 ${b('text-gray-900', 'text-white')}`}>Revenue Potential</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg ${b('bg-blue-50', 'bg-blue-900/20')}`}>
                    <Users size={14} className="text-blue-500 mb-1" />
                    <p className={`text-[10px] uppercase font-semibold ${b('text-gray-500', 'text-gray-400')}`}>Expected Customers/Day</p>
                    <p className={`text-sm font-bold ${b('text-gray-900', 'text-white')}`}>{revenue.dailyCustomersMin}  to  {revenue.dailyCustomersMax}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${b('bg-green-50', 'bg-green-900/20')}`}>
                    <IndianRupee size={14} className="text-green-500 mb-1" />
                    <p className={`text-[10px] uppercase font-semibold ${b('text-gray-500', 'text-gray-400')}`}>Avg Spend/Visit</p>
                    <p className={`text-sm font-bold ${b('text-gray-900', 'text-white')}`}>{fmt(revenue.avgSpendPerVisit)}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${b('bg-purple-50', 'bg-purple-900/20')}`}>
                    <TrendingUp size={14} className="text-purple-500 mb-1" />
                    <p className={`text-[10px] uppercase font-semibold ${b('text-gray-500', 'text-gray-400')}`}>Monthly Revenue</p>
                    <p className={`text-sm font-bold ${b('text-gray-900', 'text-white')}`}>{fmt(revenue.monthlyMin)}  to  {fmt(revenue.monthlyMax)}</p>
                  </div>
                </div>
                {ctx?.areaInfo && (
                  <p className={`text-[10px] mt-2 ${b('text-gray-400', 'text-gray-500')}`}>
                    Based on {ctx.areaInfo.population?.toLocaleString()} people, {ctx.areaInfo.incomeLevel} income area, {market?.demandLabel} demand
                  </p>
                )}
              </div>
            )}

            {market && (
              <div className={`rounded-xl border p-4 sm:p-5 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
                <h3 className={`text-sm font-bold mb-3 ${b('text-gray-900', 'text-white')}`}>Market Analysis</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`p-3 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                    <p className={`text-[10px] uppercase font-semibold ${b('text-gray-500', 'text-gray-400')}`}>Market Demand</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <p className={`text-lg font-bold ${market.demandScore > 50 ? 'text-emerald-500' : 'text-yellow-500'}`}>{market.demandScore}</p>
                      <p className={`text-[10px] ${b('text-gray-400', 'text-gray-500')}`}>/100</p>
                    </div>
                    <div className={`w-full h-1.5 rounded-full mt-1.5 ${b('bg-gray-200', 'bg-gray-700')}`}>
                      <div className={`h-full rounded-full ${market.demandScore > 50 ? 'bg-emerald-500' : 'bg-yellow-500'}`} style={{ width: `${Math.min(100, market.demandScore)}%` }} />
                    </div>
                    <p className={`text-[10px] mt-1 ${b('text-gray-400', 'text-gray-500')}`}>{market.demandLabel}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                    <p className={`text-[10px] uppercase font-semibold ${b('text-gray-500', 'text-gray-400')}`}>Market Gap</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <p className={`text-lg font-bold ${market.gapScore > 50 ? 'text-emerald-500' : 'text-yellow-500'}`}>{market.gapScore}</p>
                      <p className={`text-[10px] ${b('text-gray-400', 'text-gray-500')}`}>/100</p>
                    </div>
                    <div className={`w-full h-1.5 rounded-full mt-1.5 ${b('bg-gray-200', 'bg-gray-700')}`}>
                      <div className={`h-full rounded-full ${market.gapScore > 50 ? 'bg-emerald-500' : 'bg-yellow-500'}`} style={{ width: `${Math.min(100, market.gapScore)}%` }} />
                    </div>
                    <p className={`text-[10px] mt-1 ${b('text-gray-400', 'text-gray-500')}`}>{market.gapScore > 50 ? 'Strong opportunity' : 'Competitive market'}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                    <p className={`text-[10px] uppercase font-semibold ${b('text-gray-500', 'text-gray-400')}`}>Competitors Nearby</p>
                    <p className={`text-lg font-bold mt-1 ${b('text-gray-900', 'text-white')}`}>{market.competitorsForCat}</p>
                    <p className={`text-[10px] ${b('text-gray-400', 'text-gray-500')}`}>Total: {market.totalCompetitors} all types</p>
                  </div>
                  <div className={`p-3 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                    <p className={`text-[10px] uppercase font-semibold ${b('text-gray-500', 'text-gray-400')}`}>Competition Level</p>
                    <p className={`text-lg font-bold mt-1 ${market.marketSaturation === 'Low' ? 'text-emerald-500' : market.marketSaturation === 'Moderate' ? 'text-yellow-500' : 'text-red-500'}`}>{market.marketSaturation}</p>
                    <p className={`text-[10px] ${b('text-gray-400', 'text-gray-500')}`}>{market.marketSaturation === 'Low' ? 'Less competition' : market.marketSaturation === 'Moderate' ? 'Some competition' : 'Crowded market'}</p>
                  </div>
                </div>
              </div>
            )}

            {ctx?.topAreas && ctx.topAreas.filter(a => a.gap > 0).length > 0 && (
              <div className={`rounded-xl border p-4 sm:p-5 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
                <h3 className={`text-sm font-bold mb-3 ${b('text-gray-900', 'text-white')}`}>Best Areas for {estimate.category}</h3>
                <div className="space-y-2">
                  {ctx.topAreas.filter(a => a.gap > 0).map((a, i) => (
                    <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-400' : 'bg-gray-300'}`}>{i + 1}</span>
                        <div>
                          <span className={`text-xs font-semibold ${b('text-gray-700', 'text-gray-300')}`}>{a.name}</span>
                          <span className={`text-[10px] ml-1 ${b('text-gray-400', 'text-gray-500')}`}>({a.pincode})</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${a.gap > 60 ? 'text-emerald-500' : a.gap > 30 ? 'text-yellow-500' : 'text-red-500'}`}>Score: {a.gap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {!estimate && !loading && (
          <div className={`text-center py-16 rounded-xl border ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
            <Store size={48} className={`mx-auto mb-3 ${b('text-gray-300', 'text-gray-600')}`} />
            <p className={`text-sm font-semibold mb-1 ${b('text-gray-600', 'text-gray-300')}`}>Select a business type and area</p>
            <p className={`text-xs ${b('text-gray-400', 'text-gray-500')}`}>Get investment cost, monthly expenses, revenue potential, and ROI estimate</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, b }) {
  const colors = { green: 'bg-green-50 border-green-100 text-green-500', blue: 'bg-blue-50 border-blue-100 text-blue-500', orange: 'bg-orange-50 border-orange-100 text-orange-500', red: 'bg-red-50 border-red-100 text-red-500', purple: 'bg-purple-50 border-purple-100 text-purple-500' };
  const darkColors = { green: 'bg-green-900/20 border-green-800/30 text-green-400', blue: 'bg-blue-900/20 border-blue-800/30 text-blue-400', orange: 'bg-orange-900/20 border-orange-800/30 text-orange-400', red: 'bg-red-900/20 border-red-800/30 text-red-400', purple: 'bg-purple-900/20 border-purple-800/30 text-purple-400' };
  return (
    <div className={`rounded-xl border p-3 sm:p-4 ${b(colors[color], darkColors[color])}`}>
      <Icon size={16} className="mb-1" />
      <p className={`text-[10px] sm:text-[10px] uppercase font-semibold ${b('text-gray-500', 'text-gray-400')}`}>{label}</p>
      <p className={`text-sm sm:text-base font-bold mt-0.5 ${b('text-gray-900', 'text-white')}`}>{value}</p>
      <p className={`text-[10px] sm:text-[10px] mt-0.5 ${b('text-gray-400', 'text-gray-500')}`}>{sub}</p>
    </div>
  );
}

function CostItem({ label, value, b }) {
  return (
    <div className={`p-3 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
      <p className={`text-[10px] uppercase font-semibold ${b('text-gray-500', 'text-gray-400')}`}>{label}</p>
      <p className={`text-sm font-bold ${b('text-gray-900', 'text-white')}`}>{'Rs. ' + ((value || 0) / 1000).toFixed(0) + 'K'}/mo</p>
    </div>
  );
}

export default InvestmentEstimator;
