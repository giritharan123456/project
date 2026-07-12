import React, { createContext, useContext, useState, useEffect } from 'react';

const DistrictContext = createContext();

export const DistrictProvider = ({ children }) => {
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    try {
      return localStorage.getItem('selectedDistrict') || null;
    } catch {
      return null;
    }
  });
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if (districts.length > 0 && selectedDistrict) {
      const validDistrict = districts.find(d => d._id === selectedDistrict);
      if (!validDistrict) {
        setSelectedDistrict(districts[0]?._id || null);
      }
    }
  }, [districts, selectedDistrict]);

  useEffect(() => {
    try {
      if (selectedDistrict) {
        localStorage.setItem('selectedDistrict', selectedDistrict);
      } else {
        localStorage.removeItem('selectedDistrict');
      }
    } catch {}
  }, [selectedDistrict]);

  const value = {
    selectedDistrict,
    setSelectedDistrict,
    districts,
    setDistricts
  };

  return (
    <DistrictContext.Provider value={value}>
      {children}
    </DistrictContext.Provider>
  );
};

export const useDistrict = () => {
  const context = useContext(DistrictContext);
  if (!context) {
    throw new Error('useDistrict must be used within a DistrictProvider');
  }
  return context;
};
