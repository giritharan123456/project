import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useDistrict } from '../contexts/DistrictContext';
import { useToast } from '../contexts/ToastContext';
import { explorerAPI, favoriteAPI, shareAPI } from '../services/api';
import { Heart, Share2, MessageCircle, Mail, Copy, Check, X, ExternalLink } from 'lucide-react';

function AreaLeaderboard() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const { districts, selectedDistrict } = useDistrict();
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('opportunityScore');
  const [filterDistrict, setFilterDistrict] = useState(selectedDistrict || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState({});
  const [shareModal, setShareModal] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const b = (light, dark) => isDarkMode ? dark : light;

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy, filterDistrict, page]);

  useEffect(() => {
    if (!user || areas.length === 0) return;
    const checkFavorites = async () => {
      const favMap = {};
      for (const area of areas) {
        try {
          const res = await favoriteAPI.check('area', area._id);
          favMap[area._id] = res.isFavorite;
        } catch { /* ignore */ }
      }
      setFavorites(favMap);
    };
    checkFavorites();
  }, [user, areas]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const params = { sortBy, page, limit: 15 };
      if (filterDistrict) params.district = filterDistrict;
      const res = await explorerAPI.getLeaderboard(params);
      if (res.success) { setAreas(res.areas); setTotalPages(res.pages || 1); }
    } catch { toastError('Failed to load leaderboard'); } finally { setLoading(false); }
  };

  const handleFavorite = async (e, area) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login?redirect=/leaderboard'); return; }
    try {
      if (favorites[area._id]) {
        await favoriteAPI.remove('area', area._id);
        setFavorites(prev => ({ ...prev, [area._id]: false }));
      } else {
        await favoriteAPI.add('area', area._id, { name: area.name, pincode: area.pincode, district: area.district });
        setFavorites(prev => ({ ...prev, [area._id]: true }));
      }
    } catch (err) { alert(err.message || 'Failed to update favorite'); }
  };

  const handleShare = async (e, area) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login?redirect=/leaderboard'); return; }
    try {
      const res = await shareAPI.create('area', area._id, { name: area.name, pincode: area.pincode, district: area.district });
      const url = `${window.location.origin}/share/${res.data.shareToken}`;
      setShareModal({ area, url });
    } catch (err) { alert(err.message || 'Failed to create share link'); }
  };

  const shareToWhatsApp = (url, name) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${name} on MarketVision AI: ${url}`)}`, '_blank');
  };

  const shareToGmail = (url, name) => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(`MarketVision AI - ${name}`)}&body=${encodeURIComponent(`Check out ${name} on MarketVision AI: ${url}`)}`, '_blank');
  };

  const shareToTwitter = (url, name) => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${name} on MarketVision AI`)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyLink = async (url) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(shareModal?.url);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRankBadge = (i) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  const getScoreColor = (s) => {
    if (s >= 70) return 'text-green-500';
    if (s >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const sortOptions = [
    { value: 'opportunityScore', label: 'Opportunity Score' },
    { value: 'feasibilityScore', label: 'Feasibility Score' },
    { value: 'population', label: 'Population' },
    { value: 'populationGrowth', label: 'Growth Rate' },
  ];

  return (
    <div className={`min-h-[calc(100vh-120px)] p-4 lg:p-8 transition-colors ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${b('text-gray-900', 'text-white')}`}>Area Leaderboard</h1>
            <p className={`text-sm ${b('text-gray-500', 'text-gray-400')}`}>All areas ranked by opportunity and feasibility scores</p>
          </div>
          <div className="flex gap-3">
            <select value={filterDistrict} onChange={(e) => { setFilterDistrict(e.target.value); setPage(1); }}
              className={`px-3 py-2 rounded-lg border text-sm outline-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#1e293b] border-[#334155] text-gray-200')}`}>
              <option value="">All Districts</option>
              {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className={`px-3 py-2 rounded-lg border text-sm outline-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#1e293b] border-[#334155] text-gray-200')}`}>
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2563eb]"></div></div>
        ) : areas.length === 0 ? (
          <div className={`text-center py-20 ${b('text-gray-400', 'text-gray-500')}`}><p>No areas found</p></div>
        ) : (
          <div className="space-y-3">
            {areas.map((area, i) => (
              <motion.div key={area._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <Link to={`/area-overview/${area.pincode}`} className={`block rounded-xl border p-4 no-underline transition-all hover:shadow-md ${b('bg-white border-gray-200 hover:bg-gray-50', 'bg-[#1e293b] border-[#334155] hover:bg-[#1e293b]/80')}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i < 3 ? 'text-lg' : ''} ${b('bg-gray-100', 'bg-[#0f172a]')}`}>
                      {getRankBadge(i)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-sm truncate ${b('text-gray-900', 'text-white')}`}>{area.name}</h3>
                        <span className={`text-xs ${b('text-gray-400', 'text-gray-500')}`}>{area.pincode}</span>
                      </div>
                      <p className={`text-xs ${b('text-gray-500', 'text-gray-400')}`}>{area.district} · {area.population?.toLocaleString()} population · {area.incomeLevel} income · {area.literacyRate != null ? `${area.literacyRate}% literacy` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => handleFavorite(e, area)} title={favorites[area._id] ? 'Unfavorite' : 'Favorite'}
                        className={`p-2 rounded-lg transition-colors ${favorites[area._id] ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : b('text-gray-400 hover:text-red-500 hover:bg-red-50', 'text-gray-500 hover:text-red-400 hover:bg-red-900/20')}`}>
                        <Heart size={16} fill={favorites[area._id] ? 'currentColor' : 'none'} />
                      </button>
                      <button onClick={(e) => handleShare(e, area)} title={copiedId === area._id ? 'Copied!' : 'Share'}
                        className={`p-2 rounded-lg transition-colors ${copiedId === area._id ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : b('text-gray-400 hover:text-blue-500 hover:bg-blue-50', 'text-gray-500 hover:text-blue-400 hover:bg-blue-900/20')}`}>
                        <Share2 size={16} />
                      </button>
                      <div className="text-right flex gap-4">
                        <div>
                          <p className={`text-[10px] uppercase tracking-wider ${b('text-gray-400', 'text-gray-500')}`}>Opp</p>
                          <p className={`text-lg font-bold ${getScoreColor(area.opportunityScore)}`}>{Number(area.opportunityScore).toFixed(1)}</p>
                        </div>
                        <div>
                          <p className={`text-[10px] uppercase tracking-wider ${b('text-gray-400', 'text-gray-500')}`}>Feas</p>
                          <p className={`text-lg font-bold ${getScoreColor(area.feasibilityScore)}`}>{Number(area.feasibilityScore).toFixed(1)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${b('bg-white border-gray-300 text-gray-700', 'bg-[#1e293b] border-[#334155] text-gray-200')} disabled:opacity-40`}>Previous</button>
                <span className={`flex items-center px-3 text-sm ${b('text-gray-600', 'text-gray-400')}`}>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${b('bg-white border-gray-300 text-gray-700', 'bg-[#1e293b] border-[#334155] text-gray-200')} disabled:opacity-40`}>Next</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShareModal(null)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-sm rounded-2xl border shadow-2xl p-6 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}
            >
              <button onClick={() => setShareModal(null)}
                className={`absolute top-3 right-3 p-1 rounded-lg ${b('text-gray-400 hover:bg-gray-100', 'text-gray-500 hover:bg-[#334155]')}`}>
                <X size={18} />
              </button>

              <h3 className={`text-lg font-bold mb-1 ${b('text-gray-900', 'text-white')}`}>Share</h3>
              <p className={`text-sm mb-5 ${b('text-gray-500', 'text-gray-400')}`}>{shareModal.area.name} ({shareModal.area.pincode})</p>

              <div className="space-y-2">
                <button onClick={() => shareToWhatsApp(shareModal.url, shareModal.area.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${b('hover:bg-green-50 text-gray-700', 'hover:bg-green-900/20 text-gray-200')}`}>
                  <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center"><MessageCircle size={18} className="text-white" /></div>
                  WhatsApp
                </button>
                <button onClick={() => shareToGmail(shareModal.url, shareModal.area.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${b('hover:bg-red-50 text-gray-700', 'hover:bg-red-900/20 text-gray-200')}`}>
                  <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center"><Mail size={18} className="text-white" /></div>
                  Gmail
                </button>
                <button onClick={() => shareToTwitter(shareModal.url, shareModal.area.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${b('hover:bg-blue-50 text-gray-700', 'hover:bg-blue-900/20 text-gray-200')}`}>
                  <div className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center"><ExternalLink size={18} className="text-white" /></div>
                  Twitter / X
                </button>
                <button onClick={() => copyLink(shareModal.url)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${b('hover:bg-gray-100 text-gray-700', 'hover:bg-[#334155] text-gray-200')}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${copiedId === shareModal.url ? 'bg-green-500' : 'bg-gray-500'}`}>
                    {copiedId === shareModal.url ? <Check size={18} className="text-white" /> : <Copy size={18} className="text-white" />}
                  </div>
                  {copiedId === shareModal.url ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AreaLeaderboard;
