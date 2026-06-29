import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function EnhancedExport({ data, selectedDistrict, businessCategories }) {
  const { isDarkMode } = useTheme();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      await exportToPDF();
    } catch (error) {
      // Export failed silently
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (!data || data.length === 0) {
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(102, 126, 234);
      doc.text('Market Gap Analysis Report', 14, 22);
      
      // Metadata
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`District: ${selectedDistrict}`, 14, 32);
      doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 40);
      doc.text(`Total Pincodes: ${data.length}`, 14, 48);

      // Table headers
      const headers = ['Pincode', 'Area', 'District', 'Population', 'Growth %', 'Income Level'];
      businessCategories.forEach(cat => {
        headers.push(`${cat.name} Gap`);
      });

      // Table data
      const tableData = data.map(pincode => {
        const row = [
          pincode.pincode,
          pincode.area,
          pincode.district,
          pincode.population.toLocaleString(),
          `${pincode.populationGrowth}%`,
          pincode.incomeLevel
        ];
        businessCategories.forEach(cat => {
          row.push((pincode.marketGapScores && pincode.marketGapScores[cat.name]) || 0);
        });
        return row;
      });

      // Generate table
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 55,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [102, 126, 234],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
      });

      // Save PDF
      doc.save(`market-gap-analysis-${selectedDistrict}.pdf`);
    } catch (error) {
      // PDF export error
    }
  };

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>📥 Export Report</h3>

      <div className="space-y-6 mb-6">
        <div>
          <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Export Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
              <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>District</span>
              <span className={`block font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{selectedDistrict}</span>
            </div>
            <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
              <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Pincodes</span>
              <span className={`block font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{data?.length || 0}</span>
            </div>
            <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
              <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Categories</span>
              <span className={`block font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{businessCategories?.length || 0}</span>
            </div>
            <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
              <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Format</span>
              <span className={`block font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>PDF</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        className="w-full px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleExport}
        disabled={isExporting || !data || data.length === 0}
      >
        {isExporting ? 'Exporting...' : 'Export as PDF'}
      </button>
    </div>
  );
}

export default EnhancedExport;
