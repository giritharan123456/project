import React, { createContext, useContext, useState, useEffect } from 'react';

const PincodeContext = createContext(null);

export const PincodeProvider = ({ children }) => {
  const [selectedPincode, setSelectedPincode] = useState(null);
  const [pincodes, setPincodes] = useState([]);

  // Load selected pincode from localStorage on mount
  useEffect(() => {
    try {
      const storedPincode = localStorage.getItem('selectedPincode');
      if (storedPincode) {
        setSelectedPincode(storedPincode);
      }
    } catch {
      // localStorage may be unavailable in private browsing
    }
  }, []);

  // Save selected pincode to localStorage whenever it changes
  useEffect(() => {
    try {
      if (selectedPincode) {
        localStorage.setItem('selectedPincode', selectedPincode);
      } else {
        localStorage.removeItem('selectedPincode');
      }
    } catch {}
  }, [selectedPincode]);

  const value = {
    selectedPincode,
    setSelectedPincode,
    pincodes,
    setPincodes
  };

  return (
    <PincodeContext.Provider value={value}>
      {children}
    </PincodeContext.Provider>
  );
};

export const usePincode = () => {
  const context = useContext(PincodeContext);
  if (!context) {
    throw new Error('usePincode must be used within a PincodeProvider');
  }
  return context;
};
