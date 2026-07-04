import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Users, BarChart3, Maximize2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import EmptyState from './EmptyState';
import { averageOfValues } from '../utils/dataUtils';

function MapSection({ pincodeData, selectedDistrict }) {
  const { isDarkMode } = useTheme();

  const getCenterFromData = () => {
    if (pincodeData && pincodeData.length > 0) {
      const validData = pincodeData.filter(p => p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng));
      if (validData.length > 0) {
        const avgLat = validData.reduce((sum, p) => sum + Number(p.lat), 0) / validData.length;
        const avgLng = validData.reduce((sum, p) => sum + Number(p.lng), 0) / validData.length;
        return [avgLat, avgLng];
      }
    }
    return [20.5937, 78.9629];
  };

  const getGapColor = (avgGapScore) => {
    if (avgGapScore >= 80) return { fill: '#e74c3c', stroke: '#c0392b', label: 'High Opportunity' };
    if (avgGapScore >= 70) return { fill: '#f39c12', stroke: '#e67e22', label: 'Medium Opportunity' };
    return { fill: '#27ae60', stroke: '#229954', label: 'Low Opportunity' };
  };

  const getRadiusByPopulation = (population) => {
    const pop = Number(population) || 0;
    return Math.max(18, Math.min(50, pop / 2500));
  };

  const validPincodeData = pincodeData.filter(p => 
    p && p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng)
  );

  // Compute district summary stats
  const totalPop = validPincodeData.reduce((s, p) => s + (Number(p.population) || 0), 0);
  const avgGap = validPincodeData.length > 0
    ? validPincodeData.reduce((s, p) => s + (averageOfValues(p.marketGapScores) ?? 0), 0) / validPincodeData.length
    : 0;
  const highOpp = validPincodeData.filter(p => (averageOfValues(p.marketGapScores) ?? 0) >= 80).length;
  const medOpp = validPincodeData.filter(p => { const g = averageOfValues(p.marketGapScores) ?? 0; return g >= 70 && g < 80; }).length;

  if (!selectedDistrict || validPincodeData.length === 0) {
    return (
      <EmptyState
        type="noData"
        message={validPincodeData.length === 0 && pincodeData?.length > 0
          ? 'No map coordinates available for this area.'
          : 'No location data available. Search a pincode to fetch map coordinates.'}
      />
    );
  }

  const b = (dark, light) => isDarkMode ? dark : light;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
        <div>
          <h3 className={`text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent`}>
            Market Gap Heat Map
          </h3>
          <p className={`text-sm mt-1 ${b('text-gray-400', 'text-gray-500')}`}>
            {selectedDistrict} — Circle size = population, color = opportunity level
          </p>
        </div>
        {/* Legend */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></span>
            <span className={`text-xs font-medium ${b('text-gray-300', 'text-gray-600')}`}>High ≥80</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></span>
            <span className={`text-xs font-medium ${b('text-gray-300', 'text-gray-600')}`}>Medium 70-79</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span>
            <span className={`text-xs font-medium ${b('text-gray-300', 'text-gray-600')}`}>Low &lt;70</span>
          </div>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-2`}>
        {[
          { icon: MapPin, label: 'Areas', value: validPincodeData.length, color: 'text-blue-500' },
          { icon: Users, label: 'Total Population', value: totalPop.toLocaleString(), color: 'text-purple-500' },
          { icon: TrendingUp, label: 'Avg Gap Score', value: avgGap.toFixed(2), color: 'text-amber-500' },
          { icon: BarChart3, label: 'High Opportunity', value: `${highOpp} areas`, color: 'text-red-500' },
        ].map((stat, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${
            isDarkMode ? 'bg-[#0f172a]/50 border-[#334155]' : 'bg-gray-50 border-[#e2e8f0]'
          }`}>
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'} shadow-sm`}>
              <stat.icon size={16} className={stat.color} />
            </div>
            <div>
              <p className={`text-xs font-medium ${b('text-slate-400', 'text-slate-600')}`}>{stat.label}</p>
              <p className={`text-sm font-bold ${b('text-[#f1f5f9]', 'text-[#1e293b]')}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className={`rounded-xl overflow-hidden border ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
        <MapContainer center={getCenterFromData()} zoom={11} style={{ height: '520px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {validPincodeData.map((pincode, index) => {
            const marketGapScores = pincode.marketGapScores || {};
            const scores = Object.values(marketGapScores);
            const avgGapScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
            const colors = getGapColor(avgGapScore);
            const radius = getRadiusByPopulation(pincode.population);
            
            return (
              <CircleMarker 
                key={`${pincode.pincode}-${index}`} 
                center={[Number(pincode.lat), Number(pincode.lng)]}
                radius={radius}
                pathOptions={{
                  color: colors.stroke,
                  fillColor: colors.fill,
                  fillOpacity: 0.65,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="p-4 min-w-[280px] bg-white text-[#1e293b]">
                    <h4 className="text-lg font-bold mb-2">{pincode.area} ({pincode.pincode})</h4>
                    <p className="text-sm mb-1"><strong>District:</strong> {pincode.district}</p>
                    <p className="text-sm mb-1"><strong>Population:</strong> {pincode.population != null ? Number(pincode.population).toLocaleString() : 'N/A'}</p>
                    <p className="text-sm mb-1"><strong>Population Growth:</strong> {pincode.populationGrowth != null ? `${Number(pincode.populationGrowth).toFixed(2)}%` : 'N/A'}</p>
                    <p className="text-sm mb-1"><strong>Income Level:</strong> {pincode.incomeLevel || 'N/A'}</p>
                    <p className="text-sm mb-1"><strong>Urban Dev:</strong> {pincode.urbanDevelopment != null ? `${pincode.urbanDevelopment}/100` : 'N/A'}</p>
                    <hr className="my-2 border-gray-200" />
                    <p className="text-sm mb-2"><strong>Avg Market Gap:</strong> <span className="font-bold" style={{ color: colors.fill }}>{avgGapScore.toFixed(2)}</span></p>
                    <div className="mt-2">
                      <strong className="text-sm">Top Categories:</strong>
                      {Object.entries(marketGapScores)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([cat, score]) => (
                          <div key={cat} className="flex justify-between items-center mt-1">
                            <span className="text-sm">{cat}:</span>
                            <span className="text-sm font-bold" style={{ color: colors.fill }}>{score}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapSection;
