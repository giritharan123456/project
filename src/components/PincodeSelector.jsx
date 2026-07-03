import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePincode } from '../contexts/PincodeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { MapPin } from 'lucide-react';

function PincodeSelector({ areas }) {
  const { isDarkMode } = useTheme();
  const { selectedPincode, setSelectedPincode } = usePincode();
  const { selectedDistrict, districts } = useDistrict();

  const currentDistrict = districts.find(d => d._id === selectedDistrict);
  
  // Filter areas by selected district
  const districtAreas = currentDistrict 
    ? areas.filter(area => area.district === currentDistrict.name)
    : [];

  const handlePincodeChange = (e) => {
    setSelectedPincode(e.target.value);
  };

  return (
    <div className="flex items-center gap-3">
      <MapPin className="w-5 h-5 text-[#2563eb]" />
      <select
        value={selectedPincode || ''}
        onChange={handlePincodeChange}
        disabled={!selectedDistrict || districtAreas.length === 0}
        className={`px-4 py-2 pr-8 rounded-lg border bg-transparent outline-none focus:border-[#2563eb] transition-colors appearance-none cursor-pointer min-w-[200px] ${
          isDarkMode 
            ? 'text-[#f1f5f9] border-[#334155] disabled:opacity-50' 
            : 'text-[#1e293b] border-[#e2e8f0] disabled:opacity-50'
        }`}
      >
        <option value="">
          {selectedDistrict ? 'Select Pincode' : 'Select District First'}
        </option>
        {districtAreas.map((area) => (
          <option key={area.id} value={area.pincode}>
            {area.pincode} - {area.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PincodeSelector;
