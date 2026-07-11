import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { useToast } from '../contexts/ToastContext';
import { Download, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function EnhancedExport({ data, selectedDistrict, businessCategories }) {
  const { isDarkMode } = useTheme();
  const { districts } = useDistrict();
  const { error: toastError } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const districtName = (districts || []).find(d => d._id === selectedDistrict || d.name === selectedDistrict)?.name || selectedDistrict || 'All Districts';

  const handleExport = async () => {
    setIsExporting(true);

    try {
      await exportToPDF();
    } catch (error) {
      toastError?.('PDF export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (!data || data.length === 0) {
      toastError?.('No data to export');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;

      // Header bar
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 28, 'F');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('MarketVision AI', margin, 12);
      doc.setFontSize(10);
      doc.text('Market Gap Analysis Report', margin, 19);
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageWidth - margin, 12, { align: 'right' });

      // Info section
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      const infoY = 36;
      doc.setFont(undefined, 'bold');
      doc.text('District:', margin, infoY);
      doc.setFont(undefined, 'normal');
      doc.text(districtName, margin + 25, infoY);
      doc.setFont(undefined, 'bold');
      doc.text('Pincodes:', margin + 75, infoY);
      doc.setFont(undefined, 'normal');
      doc.text(String(data.length), margin + 105, infoY);
      doc.setFont(undefined, 'bold');
      doc.text('Categories:', margin + 130, infoY);
      doc.setFont(undefined, 'normal');
      doc.text(String(businessCategories?.length || 0), margin + 162, infoY);

      // Separator line
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.5);
      doc.line(margin, infoY + 5, pageWidth - margin, infoY + 5);

      // Summary stats
      let yPos = infoY + 14;
      const totalPopulation = data.reduce((s, p) => s + (Number(p.population) || 0), 0);
      const avgOpp = data.length > 0 ? (data.reduce((s, p) => s + (Number(p.opportunityScore) || 0), 0) / data.length).toFixed(1) : '0';
      const avgFeas = data.length > 0 ? (data.reduce((s, p) => s + (Number(p.feasibilityScore) || 0), 0) / data.length).toFixed(1) : '0';

      doc.setFontSize(13);
      doc.setTextColor(37, 99, 235);
      doc.setFont(undefined, 'bold');
      doc.text('Summary', margin, yPos);
      doc.setFont(undefined, 'normal');

      autoTable(doc, {
        startY: yPos + 4,
        head: [['Metric', 'Value']],
        body: [
          ['Total Population', totalPopulation.toLocaleString()],
          ['Average Opportunity Score', `${avgOpp}/100`],
          ['Average Feasibility Score', `${avgFeas}/100`],
          ['Total Areas Analyzed', String(data.length)],
        ],
        styles: { fontSize: 9, cellPadding: 3, halign: 'left', valign: 'middle', textColor: [50, 50, 50] },
        headStyles: { fillColor: [37, 99, 235], halign: 'left', fontStyle: 'bold', textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        columnStyles: { 0: { cellWidth: 70, fontStyle: 'bold' }, 1: { cellWidth: 'auto', halign: 'right' } },
        margin: { left: margin, right: margin },
      });

      // Main data table
      yPos = doc.lastAutoTable.finalY + 12;
      if (yPos > pageHeight - 60) { doc.addPage(); yPos = 20; }

      doc.setFontSize(13);
      doc.setTextColor(37, 99, 235);
      doc.setFont(undefined, 'bold');
      doc.text('Area Details', margin, yPos);
      doc.setFont(undefined, 'normal');

      const headers = ['Pincode', 'Area', 'Population', 'Growth %', 'Income', 'Opp.', 'Feas.'];
      (businessCategories || []).forEach(cat => {
        headers.push(`${(cat.name || '').substring(0, 8)} Gap`);
      });

      const tableData = data.map(pincode => {
        const row = [
          pincode.pincode || '',
          (pincode.area || '').substring(0, 18),
          pincode.population ? pincode.population.toLocaleString() : '-',
          pincode.populationGrowth != null ? `${Number(pincode.populationGrowth).toFixed(1)}%` : '-',
          pincode.incomeLevel || '-',
          pincode.opportunityScore != null ? String(pincode.opportunityScore) : '-',
          pincode.feasibilityScore != null ? String(pincode.feasibilityScore) : '-',
        ];
        (businessCategories || []).forEach(cat => {
          row.push((pincode.marketGapScores && pincode.marketGapScores[cat.name] != null) ? Number(pincode.marketGapScores[cat.name]).toFixed(1) : '0');
        });
        return row;
      });

      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: yPos + 4,
        styles: { fontSize: 7, cellPadding: 2, halign: 'left', valign: 'middle', textColor: [50, 50, 50] },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', halign: 'left', fontSize: 7 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        columnStyles: {
          0: { cellWidth: 18 },
          2: { halign: 'right' },
          3: { halign: 'right' },
          5: { halign: 'right' },
          6: { halign: 'right' },
        },
        margin: { left: margin, right: margin },
      });

      // Footer on every page
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
        doc.text('MarketVision AI - Confidential', margin, pageHeight - 8);
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
      }

      doc.save(`market-gap-analysis-${districtName}.pdf`);
    } catch (error) {
      toastError?.('PDF export failed. Please try again.');
    }
  };

  const escapeCSV = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const exportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = ['Pincode', 'Area', 'District', 'Population', 'Growth %', 'Income Level', 'Opp. Score', 'Feas. Score'];
    (businessCategories || []).forEach(cat => headers.push(`${cat.name || ''} Gap`));
    const rows = data.map(pincode => [
      pincode.pincode || '', pincode.area || '', pincode.district || '',
      pincode.population || '', pincode.populationGrowth || '', pincode.incomeLevel || '',
      pincode.opportunityScore ?? '', pincode.feasibilityScore ?? '',
      ...(businessCategories || []).map(cat => (pincode.marketGapScores && pincode.marketGapScores[cat.name]) || 0)
    ]);
    const csv = [headers.map(escapeCSV).join(','), ...rows.map(r => r.map(escapeCSV).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `market-gap-analysis-${districtName}.csv`; a.click();
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
              <span className={`block font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{districtName}</span>
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
