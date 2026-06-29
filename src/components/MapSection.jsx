import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { useTheme } from '../contexts/ThemeContext';

function MapSection({ pincodeData, selectedDistrict }) {
  const { isDarkMode } = useTheme();
  const center = {
    'Chennai': [13.0827, 80.2707],
    'Coimbatore': [11.0168, 76.9558],
    'Madurai': [9.9252, 78.1197],
    'Tiruchirappalli': [10.7905, 78.7047],
    'Salem': [11.6643, 78.1460],
    'Erode': [11.3410, 77.7172]
  };

  const getGapColor = (avgGapScore) => {
    if (avgGapScore >= 80) return { fill: '#e74c3c', stroke: '#c0392b', label: 'High Opportunity' };
    if (avgGapScore >= 70) return { fill: '#f39c12', stroke: '#e67e22', label: 'Medium Opportunity' };
    return { fill: '#27ae60', stroke: '#229954', label: 'Low Opportunity' };
  };

  const getRadiusByPopulation = (population) => {
    return Math.max(15, Math.min(40, population / 3000));
  };

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

      <MapContainer center={center[selectedDistrict] || [11.0168, 76.9558]} zoom={11} style={{ height: '450px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pincodeData.map((pincode, index) => {
          const avgGapScore = Object.values(pincode.marketGapScores).reduce((a, b) => a + b, 0) / Object.keys(pincode.marketGapScores).length;
          const colors = getGapColor(avgGapScore);
          const radius = getRadiusByPopulation(pincode.population);
          
          return (
            <CircleMarker 
              key={index} 
              center={[pincode.lat, pincode.lng]}
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
                  <p className="text-sm mb-1"><strong>Population:</strong> {pincode.population.toLocaleString()}</p>
                  <p className="text-sm mb-1"><strong>Population Growth:</strong> {pincode.populationGrowth}%</p>
                  <p className="text-sm mb-1"><strong>Income Level:</strong> {pincode.incomeLevel}</p>
                  <p className="text-sm mb-1"><strong>Urban Development:</strong> {pincode.urbanDevelopment}/100</p>
                  <p className="text-sm mb-1"><strong>Search Trends:</strong> {pincode.searchTrends}/100</p>
                  <hr className="my-2 border-gray-300" />
                  <p className="text-sm mb-2"><strong>Avg Market Gap Score:</strong> <span style={{ color: colors.fill, fontWeight: 'bold', fontSize: '1.1rem' }}>{avgGapScore.toFixed(1)}</span></p>
                  <div className="mt-3">
                    <strong className="text-sm">Top Categories:</strong>
                    {Object.entries(pincode.marketGapScores)
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
