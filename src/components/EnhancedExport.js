import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function EnhancedExport({ data, selectedDistrict, businessCategories }) {
  const { isDarkMode } = useTheme();
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      switch (exportFormat) {
        case 'csv':
          await exportToCSV();
          break;
        case 'json':
          await exportToJSON();
          break;
        default:
          await exportToCSV();
      }
    } catch (error) {
      // Export failed silently
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = async () => {
    if (!data || data.length === 0) {
      return;
    }

    try {
      let headers = ['Pincode', 'Area', 'District', 'Population', 'Growth Rate', 'Income Level', 'Urban Development'];

      businessCategories.forEach(cat => {
        headers.push(`${cat.name} Competitors`);
        headers.push(`${cat.name} Demand Score`);
        headers.push(`${cat.name} Market Gap Score`);
      });

      let csvRows = [headers.join(',')];

      data.forEach(pincode => {
        const row = [
          pincode.pincode,
          pincode.area,
          pincode.district,
          pincode.population,
          pincode.populationGrowth,
          pincode.incomeLevel,
          pincode.urbanDevelopment
        ];

        businessCategories.forEach(cat => {
          row.push((pincode.competitors && pincode.competitors[cat.name]) || 0);
          row.push((pincode.demandScores && pincode.demandScores[cat.name]) || 0);
          row.push((pincode.marketGapScores && pincode.marketGapScores[cat.name]) || 0);
        });

        csvRows.push(row.join(','));
      });

      let csvContent = csvRows.join('\n');
      downloadFile(csvContent, `market-gap-analysis-${selectedDistrict}.csv`, 'text/csv');
    } catch (error) {
      // CSV export error
    }
  };

  const exportToJSON = async () => {
    if (!data || data.length === 0) {
      return;
    }

    try {
      const jsonData = {
        metadata: {
          district: selectedDistrict,
          exportDate: new Date().toISOString(),
          totalPincodes: data.length,
          businessCategories: businessCategories.map(cat => cat.name)
        },
        data: data.map(pincode => ({
          pincode: pincode.pincode,
          area: pincode.area,
          district: pincode.district,
          population: pincode.population,
          populationGrowth: pincode.populationGrowth,
          incomeLevel: pincode.incomeLevel,
          urbanDevelopment: pincode.urbanDevelopment,
          competitors: pincode.competitors,
          demandScores: pincode.demandScores,
          marketGapScores: pincode.marketGapScores
        }))
      };

      const jsonContent = JSON.stringify(jsonData, null, 2);
      downloadFile(jsonContent, `market-gap-analysis-${selectedDistrict}.json`, 'application/json');
    } catch (error) {
      // JSON export error
    }
  };

  const downloadFile = (content, filename, mimeType) => {
    try {
      const isText = mimeType.includes('text') || mimeType.includes('csv');
      const blobContent = isText ? ['\ufeff', content] : [content];
      
      const blob = new Blob(blobContent, { type: `${mimeType};charset=utf-8` });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      // Download failed
    }
  };

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: '📊', description: 'Comma-separated values' },
    { value: 'json', label: 'JSON', icon: '🔧', description: 'Structured data format' }
  ];

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-bold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>📥 Enhanced Export</h3>
        <button 
          className={`px-4 py-2 border-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark hover:border-primary-blue' : 'bg-bg-light border-border-light text-text-light hover:border-primary-blue'}`}
          onClick={() => setShowOptions(!showOptions)}
        >
          {showOptions ? '▼' : '▶'} Options
        </button>
      </div>

      <motion.div 
        className="overflow-hidden"
        initial={{ height: 'auto' }}
        animate={{ height: showOptions ? 'auto' : '0px' }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div>
            <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Select Format</h4>
            <div className="grid grid-cols-2 gap-4">
              {formatOptions.map(format => (
                <div
                  key={format.value}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${exportFormat === format.value ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white border-transparent' : `${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark hover:border-primary-blue' : 'bg-bg-light border-border-light text-text-light hover:border-primary-blue'}`}`}
                  onClick={() => setExportFormat(format.value)}
                >
                  <span className="text-2xl block mb-2">{format.icon}</span>
                  <span className="block font-semibold">{format.label}</span>
                  <span className="block text-xs opacity-70 mt-1">{format.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Export Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>District</span>
                <span className={`block font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{selectedDistrict}</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Pincodes</span>
                <span className={`block font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{data?.length || 0}</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Categories</span>
                <span className={`block font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{businessCategories?.length || 0}</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Format</span>
                <span className={`block font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{exportFormat.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <button 
        className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleExport}
        disabled={isExporting || !data || data.length === 0}
      >
        {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
      </button>
    </div>
  );
}

export default EnhancedExport;
