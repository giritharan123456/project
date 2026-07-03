import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { useTheme } from '../contexts/ThemeContext';
import 'leaflet/dist/leaflet.css';

import EmptyState from './EmptyState';

function MapSection({ pincodeData, selectedDistrict }) {
  const { isDarkMode } = useTheme();
  
  // Calculate center from actual pincode data
  const getCenterFromData = () => {
    if (pincodeData && pincodeData.length > 0) {
      const validData = pincodeData.filter(p => p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng));
      if (validData.length > 0) {
        const avgLat = validData.reduce((sum, p) => sum + Number(p.lat), 0) / validData.length;
        const avgLng = validData.reduce((sum, p) => sum + Number(p.lng), 0) / validData.length;
        return [avgLat, avgLng];
      }
    }
    // Default center for Tamil Nadu
    return [11.0168, 76.9558];
  };

  const getGapColor = (avgGapScore) => {
    if (avgGapScore >= 80) return { fill: '#e74c3c', stroke: '#c0392b', label: 'High Opportunity' };
    if (avgGapScore >= 70) return { fill: '#f39c12', stroke: '#e67e22', label: 'Medium Opportunity' };
    return { fill: '#27ae60', stroke: '#229954', label: 'Low Opportunity' };
  };

  const getRadiusByPopulation = (population) => {
    const pop = Number(population) || 0;
    return Math.max(15, Math.min(40, pop / 3000));
  };

  // Filter and validate pincode data
  const validPincodeData = pincodeData.filter(p => 
    p && 
    p.lat && 
    p.lng && 
    !isNaN(p.lat) && 
    !isNaN(p.lng)
  );

  if (!selectedDistrict || validPincodeData.length === 0) {
    return (
      <EmptyState
        type="noData"
        message={validPincodeData.length === 0 && pincodeData?.length > 0
          ? 'No map coordinates available for this area. Location data comes from Google Maps geocoding when you search a pincode.'
          : 'No location data available. Search a pincode to fetch map coordinates from the backend.'}
      />
    );
  }

  return (
    <div className={`p-6 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>🗺️ Market Gap Heat Map - {selectedDistrict}</h3>
      <p className={`text-sm mb-4 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Circle size represents population, color represents market opportunity</p>
      
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-500"></span>
          <span className={`text-xs ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>High Opportunity (≥80)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-amber-500"></span>
          <span className={`text-xs ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Medium Opportunity (70-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-500"></span>
          <span className={`text-xs ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Low Opportunity (&lt;70)</span>
        </div>
      </div>

      <MapContainer center={getCenterFromData()} zoom={11} style={{ height: '450px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                fillOpacity: 0.6,
                weight: 2
              }}
            >
              <Popup>
                <div className={`p-4 min-w-[250px] ${isDarkMode ? 'bg-[#1e293b] text-[#f1f5f9]' : 'bg-[#ffffff] text-[#1e293b]'}`}>
                  <h4 className="text-lg font-bold mb-2">{pincode.area} ({pincode.pincode})</h4>
                  <p className="text-sm mb-1"><strong>District:</strong> {pincode.district}</p>
                  <p className="text-sm mb-1"><strong>Population:</strong> {pincode.population != null ? Number(pincode.population).toLocaleString() : 'No data available'}</p>
                  <p className="text-sm mb-1"><strong>Population Growth:</strong> {pincode.populationGrowth != null ? `${pincode.populationGrowth}%` : 'No data available'}</p>
                  <p className="text-sm mb-1"><strong>Income Level:</strong> {pincode.incomeLevel || 'No data available'}</p>
                  <p className="text-sm mb-1"><strong>Urban Development:</strong> {pincode.urbanDevelopment != null ? `${pincode.urbanDevelopment}/100` : 'No data available'}</p>
                  <p className="text-sm mb-1"><strong>Search Trends:</strong> {pincode.searchTrends != null ? `${pincode.searchTrends}/100` : 'No data available'}</p>
                  <hr className="my-2 border-gray-300" />
                  <p className="text-sm mb-2"><strong>Avg Market Gap Score:</strong> <span style={{ color: colors.fill, fontWeight: 'bold', fontSize: '1.1rem' }}>{avgGapScore.toFixed(1)}</span></p>
                  <div className="mt-3">
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
  );
}

export default MapSection;
