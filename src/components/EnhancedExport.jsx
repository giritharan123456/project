import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { useToast } from '../contexts/ToastContext';
import { Download, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function EnhancedExport({ data, selectedDistrict, businessCategories, leaderboardData }) {
  const { isDarkMode } = useTheme();
  const { districts } = useDistrict();
  const { error: toastError } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const districtName = districts.find(d => d._id === selectedDistrict)?.name || 'All Districts';

  const handleExport = async () => {
    setIsExporting(true);

    try {
      await exportToPDF();
    } catch (error) {
      toastError('PDF export failed. Please try again.');
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
      
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(20);
      doc.setTextColor(102, 126, 234);
      doc.text('MarketVision AI - Market Gap Analysis Report', pageWidth / 2, 22, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`District: ${districtName}`, 14, 34);
      doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 42);
      doc.text(`Total Pincodes: ${data.length}`, 14, 50);

      // Table headers
      const headers = ['Pincode', 'Area', 'District', 'Population', 'Growth %', 'Income Level', 'Opp. Score', 'Feas. Score'];
      businessCategories.forEach(cat => {
        headers.push(`${cat.name} Gap`);
      });

      // Table data
      const tableData = data.map(pincode => {
        const row = [
          pincode.pincode || '',
          pincode.area || '',
          pincode.district || '',
          pincode.population ? pincode.population.toLocaleString() : 'No data',
          pincode.populationGrowth != null ? `${Number(pincode.populationGrowth).toFixed(2)}%` : 'No data',
          pincode.incomeLevel || 'No data',
          pincode.opportunityScore != null ? pincode.opportunityScore : '-',
          pincode.feasibilityScore != null ? pincode.feasibilityScore : '-',
        ];
        businessCategories.forEach(cat => {
          row.push((pincode.marketGapScores && pincode.marketGapScores[cat.name] != null) ? Number(pincode.marketGapScores[cat.name]).toFixed(2) : '0.00');
        });
        return row;
      });

      // Generate main table first
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 57,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          halign: 'left',
          valign: 'middle',
        },
        headStyles: {
          fillColor: [102, 126, 234],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'left',
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
      });

      // Leaderboard section after main table
      if (leaderboardData && leaderboardData.length > 0) {
        const finalY = doc.lastAutoTable.finalY || 55;
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text('Area Leaderboard', 14, finalY + 15);

        const lbHeaders = ['Rank', 'Area', 'District', 'Opportunity Score', 'Feasibility Score'];
        const lbData = leaderboardData.slice(0, 10).map((a, i) => [
          i + 1,
          a.name || '',
          a.district || '',
          a.opportunityScore != null ? a.opportunityScore : '-',
          a.feasibilityScore != null ? a.feasibilityScore : '-',
        ]);

        autoTable(doc, {
          head: [lbHeaders],
          body: lbData,
          startY: finalY + 22,
          styles: { fontSize: 8, cellPadding: 3, halign: 'left', valign: 'middle' },
          headStyles: { fillColor: [102, 126, 234], textColor: 255, fontStyle: 'bold', halign: 'left' },
          alternateRowStyles: { fillColor: [245, 247, 250] },
          columnStyles: {
            0: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'right' },
          },
        });
      }

      // Save PDF
      doc.save(`market-gap-analysis-${districtName}.pdf`);
    } catch (error) {
      toastError('PDF export failed. Please try again.');
    }
  };

  const exportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = ['Pincode', 'Area', 'District', 'Population', 'Growth %', 'Income Level', 'Opp. Score', 'Feas. Score'];
    businessCategories.forEach(cat => headers.push(`${cat.name} Gap`));
    const rows = data.map(pincode => [
      pincode.pincode || '', pincode.area || '', pincode.district || '',
      pincode.population || '', pincode.populationGrowth || '', pincode.incomeLevel || '',
      pincode.opportunityScore ?? '', pincode.feasibilityScore ?? '',
      ...businessCategories.map(cat => (pincode.marketGapScores && pincode.marketGapScores[cat.name]) || 0)
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `market-gap-analysis-${selectedDistrict}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`p-3 rounded-xl border mb-1 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>📥 Export Report</h3>

      <div className="space-y-6 mb-6">
        <div>
          <h4 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Export Summary</h4>
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
              <span className={`block font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>PDF / CSV</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleExport}
          disabled={isExporting || !data || data.length === 0}
        >
          <Download size={18} />
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </button>
        <button 
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:bg-green-700 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={exportCSV}
          disabled={!data || data.length === 0}
        >
          <FileSpreadsheet size={18} />
          Export CSV
        </button>
      </div>
    </div>
  );
}

export default EnhancedExport;
