import React, { createContext, useContext, useState, useEffect } from 'react';

const DistrictContext = createContext();

export const DistrictProvider = ({ children }) => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districts, setDistricts] = useState([]);

  // Load selected district from localStorage on mount
  useEffect(() => {
    const savedDistrict = localStorage.getItem('selectedDistrict');
    if (savedDistrict) {
      setSelectedDistrict(savedDistrict);
    }
  }, []);

  // Save selected district to localStorage whenever it changes
  useEffect(() => {
    if (selectedDistrict) {
      localStorage.setItem('selectedDistrict', selectedDistrict);
    } else {
      localStorage.removeItem('selectedDistrict');
    }
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
