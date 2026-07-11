import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useDistrict } from '../contexts/DistrictContext';
import { usePincode } from '../contexts/PincodeContext';
import { areasAPI } from '../services/api';
import EmptyState from '../components/EmptyState';
import { averageOfValues } from '../utils/dataUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FileText, Download, BarChart3, MapPin, Users,
  TrendingUp, Target, DollarSign, ArrowLeft, ChevronRight,
  AlertTriangle, CheckCircle, Zap, Shield
} from 'lucide-react';

function Reports() {
  const { isDarkMode } = useTheme();
  const { error: toastError } = useToast();
  const { selectedDistrict, districts } = useDistrict();
  const { selectedPincode } = usePincode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [areaData, setAreaData] = useState(null);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const currentDistrict = districts.find(d => d._id === selectedDistrict);
  const districtName = currentDistrict?.name || 'No district selected';

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPincode) { setAreaData(null); return; }
      try {
        setLoading(true);
        setError(null);
        const areaRes = await areasAPI.getByPincode(selectedPincode);
        if (areaRes.data) {
          setAreaData(areaRes.data);
        } else {
          setError(`Data for pincode ${selectedPincode} not found.`);
        }
      } catch (err) {
        setError(err.message || 'Failed to load report data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPincode]);

  const areaStats = useMemo(() => {
    if (!areaData) return null;
    const marketGapScores = areaData.marketGapScores || {};
    const competitors = areaData.competitors || {};
    const demandScores = areaData.demandScores || {};
    const avgGap = averageOfValues(marketGapScores) ?? 0;
    const avgDemand = averageOfValues(demandScores) ?? 0;
    const totalCompetitors = Object.values(competitors).reduce((s, v) => s + (Number(v) || 0), 0);
    const categories = Object.entries(marketGapScores).map(([name, gap]) => ({
      name, gap: Number(gap) || 0,
      demand: Number(demandScores[name]) || 0,
      competitors: Number(competitors[name]) || 0,
    })).sort((a, b) => b.gap - a.gap);
    const bestCategory = categories[0] || null;
    const riskCategories = categories.filter(c => c.competitors > 8);
    const highOppCategories = categories.filter(c => c.gap >= 70 && c.competitors < 5);
    return { avgGap, avgDemand, totalCompetitors, categories, bestCategory, riskCategories, highOppCategories };
  }, [areaData]);

  const handleExportPDF = async () => {
    if (!areaData || !areaStats) return;
    setExporting(true);
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
      doc.text('Area Market Analysis Report', margin, 19);
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
      doc.text('Pincode:', margin + 75, infoY);
      doc.setFont(undefined, 'normal');
      doc.text(areaData.pincode || 'N/A', margin + 100, infoY);
      doc.setFont(undefined, 'bold');
      doc.text('Area:', margin + 130, infoY);
      doc.setFont(undefined, 'normal');
      doc.text(areaData.name || 'N/A', margin + 145, infoY);

      // Separator line
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.5);
      doc.line(margin, infoY + 5, pageWidth - margin, infoY + 5);

      // Area Overview section
      let yPos = infoY + 14;
      doc.setFontSize(13);
      doc.setTextColor(37, 99, 235);
      doc.setFont(undefined, 'bold');
      doc.text('Area Overview', margin, yPos);
      doc.setFont(undefined, 'normal');

      autoTable(doc, {
        startY: yPos + 4,
        head: [['Metric', 'Value']],
        body: [
          ['Population', (areaData.population || 0).toLocaleString()],
          ['Population Growth', `${Number(areaData.populationGrowth || 0).toFixed(2)}%`],
          ['Income Level', areaData.incomeLevel || 'N/A'],
          ['Urban Development', `${Number(areaData.urbanDevelopment || 0).toFixed(2)}/100`],
          ['Literacy Rate', areaData.literacyRate ? `${areaData.literacyRate}%` : 'N/A'],
          ['Traffic Level', areaData.trafficLevel || 'N/A'],
          ['Avg Market Gap Score', Number(areaStats.avgGap).toFixed(2)],
          ['Avg Demand Score', Number(areaStats.avgDemand).toFixed(2)],
          ['Total Competitors', areaStats.totalCompetitors],
        ],
        styles: { fontSize: 9, cellPadding: 3, halign: 'left', valign: 'middle', textColor: [50, 50, 50] },
        headStyles: { fillColor: [37, 99, 235], halign: 'left', fontStyle: 'bold', textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        columnStyles: { 0: { cellWidth: 65, fontStyle: 'bold' }, 1: { cellWidth: 'auto', halign: 'right' } },
        margin: { left: margin, right: margin },
      });

      // Landmarks section
      if (areaData.landmarks && areaData.landmarks.length > 0) {
        yPos = doc.lastAutoTable.finalY + 12;
        doc.setFontSize(13);
        doc.setTextColor(37, 99, 235);
        doc.setFont(undefined, 'bold');
        doc.text('Nearby Landmarks', margin, yPos);
        doc.setFont(undefined, 'normal');

        autoTable(doc, {
          startY: yPos + 4,
          head: [['Landmark', 'Type']],
          body: areaData.landmarks.map(l => [l.name || l, l.type || '']),
          styles: { fontSize: 9, cellPadding: 3, halign: 'left', valign: 'middle', textColor: [50, 50, 50] },
          headStyles: { fillColor: [37, 99, 235], halign: 'left', fontStyle: 'bold', textColor: 255 },
          alternateRowStyles: { fillColor: [245, 247, 250] },
          columnStyles: { 0: { cellWidth: 110 }, 1: { cellWidth: 'auto', halign: 'center' } },
          margin: { left: margin, right: margin },
        });
      }

      // Category Breakdown section
      if (areaStats.categories.length > 0) {
        yPos = doc.lastAutoTable.finalY + 12;

        // Check if we need a new page
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(13);
        doc.setTextColor(37, 99, 235);
        doc.setFont(undefined, 'bold');
        doc.text('Category Breakdown', margin, yPos);
        doc.setFont(undefined, 'normal');

        autoTable(doc, {
          startY: yPos + 4,
          head: [['Category', 'Gap Score', 'Demand', 'Competitors', 'Status']],
          body: areaStats.categories.map(c => [
            c.name, Number(c.gap).toFixed(1), Number(c.demand).toFixed(1), c.competitors,
            c.gap >= 70 && c.competitors < 5 ? 'High Opportunity' : c.competitors > 8 ? 'Saturated' : 'Moderate'
          ]),
          styles: { fontSize: 9, cellPadding: 3, halign: 'left', valign: 'middle', textColor: [50, 50, 50] },
          headStyles: { fillColor: [37, 99, 235], halign: 'left', fontStyle: 'bold', textColor: 255 },
          alternateRowStyles: { fillColor: [245, 247, 250] },
          columnStyles: {
            0: { cellWidth: 40, fontStyle: 'bold' },
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'center' },
            4: { halign: 'center' }
          },
          margin: { left: margin, right: margin },
        });
      }

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

      doc.save(`report-${areaData.pincode || 'area'}.pdf`);
    } catch (err) {
      toastError('PDF export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    if (!areaData || !areaStats) return;
    const rows = [['Metric', 'Value']];
    rows.push(['District', districtName]);
    rows.push(['Pincode', areaData.pincode || '']);
    rows.push(['Area', areaData.name || '']);
    rows.push(['Population', areaData.population || 0]);
    rows.push(['Population Growth', Number(areaData.populationGrowth || 0).toFixed(2)]);
    rows.push(['Income Level', areaData.incomeLevel || '']);
    rows.push(['Urban Development', Number(areaData.urbanDevelopment || 0).toFixed(2)]);
    rows.push(['Avg Market Gap', Number(areaStats.avgGap).toFixed(2)]);
    rows.push(['Avg Demand', Number(areaStats.avgDemand).toFixed(2)]);
    rows.push(['Total Competitors', areaStats.totalCompetitors]);
    rows.push([]);
    rows.push(['Category', 'Gap Score', 'Demand', 'Competitors', 'Status']);
    areaStats.categories.forEach(c => {
      rows.push([c.name, Number(c.gap).toFixed(2), Number(c.demand).toFixed(2), c.competitors,
        c.gap >= 70 && c.competitors < 5 ? 'High Opportunity' : c.competitors > 8 ? 'Saturated' : 'Moderate']);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `report-${areaData.pincode || 'area'}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!selectedPincode) {
    return (
    <div className={`min-h-[calc(100vh-70px)] p-4 sm:p-6 md:p-10 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <FileText className="text-[#2563eb]" size={28} />
              <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Reports</h1>
            </div>
            <p className={`text-sm sm:text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Generate professional market analysis reports for any area.
            </p>
          </motion.div>

          {/* Report Features */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={`p-4 sm:p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Report Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { icon: BarChart3, title: 'Market Gap Analysis', desc: 'Detailed breakdown of market gaps across all business categories' },
                { icon: Users, title: 'Demographics', desc: 'Population, growth rate, income levels, and urban development data' },
                { icon: Target, title: 'Opportunity Scoring', desc: 'AI-calculated opportunity scores for each category' },
                { icon: AlertTriangle, title: 'Competition Analysis', desc: 'Competitor counts and saturation levels per category' },
                { icon: TrendingUp, title: 'Growth Projections', desc: '5-year forecasts based on current trends' },
                { icon: Download, title: 'Export Options', desc: 'Download as PDF or CSV for offline analysis' },
              ].map((feature, i) => (
                <div key={i} className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                  <feature.icon className="text-[#2563eb] mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className={`font-bold text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{feature.title}</p>
                    <p className={`text-xs mt-0.5 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How to Export */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`p-4 sm:p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>How to Export</h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                { step: '1', title: 'Search a Pincode', desc: 'Use the Dashboard search bar to find the area you want to analyze.' },
                { step: '2', title: 'Navigate to Reports', desc: 'Click the Reports link in the navigation menu.' },
                { step: '3', title: 'Choose Export Format', desc: 'Click "Export PDF" for a formatted report or "Export CSV" for raw data.' },
                { step: '4', title: 'Download', desc: 'The file will be downloaded to your device automatically.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs sm:text-sm font-bold">{item.step}</span>
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.title}</p>
                    <p className={`text-xs mt-0.5 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Report Contents */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`p-4 sm:p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Report Contents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {[
                'Area Overview (name, pincode, district)',
                'Population & Demographics',
                'Market Gap Scores by Category',
                'Demand Scores by Category',
                'Competition Analysis',
                'Opportunity Rankings',
                'High Opportunity Categories',
                'Saturated Categories Warning',
                'Income Level Assessment',
                'Growth Rate Analysis',
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-lg ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                  <CheckCircle size={12} className="text-green-500 shrink-0" />
                  <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Search a Pincode to Generate Report <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-[calc(100vh-70px)] p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
            <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Generating report for {selectedPincode}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !areaData) {
    return (
      <div className={`min-h-[calc(100vh-70px)] p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="max-w-7xl mx-auto">
          <EmptyState type={error ? 'error' : 'noData'} message={error || 'Area data not found.'} actionText="Go to Dashboard" onAction={() => navigate('/dashboard')} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-70px)] p-4 sm:p-6 md:p-10 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/dashboard" className={`inline-flex items-center gap-2 mb-4 font-medium hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <FileText className="text-[#2563eb]" size={28} />
                <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Area Report</h1>
              </div>
              <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {areaData.name} — Pincode {areaData.pincode} — {districtName}
              </p>
            </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button onClick={handleExportPDF} disabled={exporting}
                className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                <Download size={16} /> {exporting ? 'Exporting...' : 'Export PDF'}
              </button>
              <button onClick={handleExportCSV}
                className="px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-[#2563eb] text-[#2563eb] rounded-xl font-semibold hover:bg-[#2563eb] hover:text-white transition-all flex items-center justify-center gap-2 text-sm">
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>
        </motion.div>

        {areaStats && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Users, label: 'Population', value: (areaData.population || 0).toLocaleString(), color: 'text-blue-500' },
              { icon: TrendingUp, label: 'Growth Rate', value: `${Number(areaData.populationGrowth || 0).toFixed(2)}%`, color: 'text-green-500' },
              { icon: Target, label: 'Avg Gap Score', value: Number(areaStats.avgGap).toFixed(2), color: 'text-emerald-500' },
              { icon: DollarSign, label: 'Income Level', value: areaData.incomeLevel || 'Low', color: 'text-purple-500' },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                className={`p-3 sm:p-5 rounded-2xl border transition-all hover:shadow-lg ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
                <m.icon className={`${m.color} mb-1.5 sm:mb-2`} size={20} />
                <p className={`text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.label}</p>
                <p className={`text-base sm:text-xl font-extrabold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{m.value}</p>
              </motion.div>
            ))}
          </div>
        )}

        {areaStats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`p-4 sm:p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <Zap className="text-[#2563eb]" size={22} />
              <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Key Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {areaStats.bestCategory && (
                <div className={`p-3 sm:p-5 rounded-xl border-l-4 border-green-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <CheckCircle size={14} className="text-green-500" />
                    <p className={`text-[10px] sm:text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Best Opportunity</p>
                  </div>
                  <p className={`font-bold text-base sm:text-lg ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{areaStats.bestCategory.name}</p>
                  <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>Gap Score: {Number(areaStats.bestCategory.gap).toFixed(2)} | Demand: {Number(areaStats.bestCategory.demand).toFixed(2)}</p>
                </div>
              )}
              <div className={`p-3 sm:p-5 rounded-xl border-l-4 border-blue-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Shield size={14} className="text-blue-500" />
                  <p className={`text-[10px] sm:text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Market Coverage</p>
                </div>
                <p className={`font-bold text-base sm:text-lg ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{areaStats.categories.length} Categories</p>
                <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>{areaStats.totalCompetitors} total competitors across all categories</p>
              </div>
              {areaStats.riskCategories.length > 0 ? (
                <div className={`p-3 sm:p-5 rounded-xl border-l-4 border-orange-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <AlertTriangle size={14} className="text-orange-500" />
                    <p className={`text-[10px] sm:text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Saturated Categories</p>
                  </div>
                  <p className={`font-bold text-base sm:text-lg ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{areaStats.riskCategories.length} categories</p>
                  <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 truncate ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>{areaStats.riskCategories.slice(0, 3).map(c => c.name).join(', ')}{areaStats.riskCategories.length > 3 ? '...' : ''}</p>
                </div>
              ) : (
                <div className={`p-3 sm:p-5 rounded-xl border-l-4 border-green-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <CheckCircle size={14} className="text-green-500" />
                    <p className={`text-[10px] sm:text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No Saturated Categories</p>
                  </div>
                  <p className={`font-bold text-base sm:text-lg ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>All clear</p>
                  <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>All categories have low competition</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {areaStats && areaStats.categories.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className={`p-4 sm:p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <BarChart3 className="text-[#2563eb]" size={22} />
              <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Category Breakdown</h3>
              <span className={`ml-auto text-sm font-semibold px-3 py-1 rounded-full ${isDarkMode ? 'bg-[#334155] text-[#94a3b8]' : 'bg-[#e2e8f0] text-[#64748b]'}`}>
                {areaStats.categories.length} categories
              </span>
            </div>
            <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
              <table className="w-full text-left min-w-[480px]">
                <thead>
                  <tr className={`border-b-2 ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                    <th className={`pb-2 sm:pb-3 font-bold text-xs sm:text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Category</th>
                    <th className={`pb-2 sm:pb-3 font-bold text-xs sm:text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Gap Score</th>
                    <th className={`hidden md:table-cell pb-2 sm:pb-3 font-bold text-xs sm:text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand</th>
                    <th className={`hidden md:table-cell pb-2 sm:pb-3 font-bold text-xs sm:text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competitors</th>
                    <th className={`pb-2 sm:pb-3 font-bold text-xs sm:text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {areaStats.categories.map((cat, i) => (
                    <tr key={i} className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'} last:border-b-0`}>
                      <td className={`py-3 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{cat.name}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          cat.gap >= 70 ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700' :
                          cat.gap >= 40 ? isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700' :
                          isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                        }`}>{Number(cat.gap).toFixed(2)}</span>
                      </td>
                      <td className={`hidden md:table-cell py-3 text-right font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{Number(cat.demand).toFixed(2)}</td>
                      <td className={`hidden md:table-cell py-3 text-right font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{cat.competitors}</td>
                      <td className="py-3 text-right">
                        {cat.gap >= 70 && cat.competitors < 5 ? (
                          <span className="inline-flex items-center gap-1 text-green-500 text-xs font-bold"><CheckCircle size={14} /> High Opportunity</span>
                        ) : cat.competitors > 8 ? (
                          <span className="inline-flex items-center gap-1 text-orange-500 text-xs font-bold"><AlertTriangle size={14} /> Saturated</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-500 text-xs font-bold"><Target size={14} /> Moderate</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <Link to="/ai-recommendations"
            className={`p-4 sm:p-5 rounded-2xl border flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center shrink-0">
              <Zap className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>AI Insights</h4>
              <p className={`text-sm opacity-70 truncate ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Get recommendations</p>
            </div>
            <ChevronRight className={`ml-auto shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>
          <Link to="/forecast"
            className={`p-4 sm:p-5 rounded-2xl border flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center shrink-0">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Forecast</h4>
              <p className={`text-sm opacity-70 truncate ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Future predictions</p>
            </div>
            <ChevronRight className={`ml-auto shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>
          <Link to="/comparison"
            className={`p-4 sm:p-5 rounded-2xl border flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center shrink-0">
              <BarChart3 className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Compare</h4>
              <p className={`text-sm opacity-70 truncate ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Side-by-side analysis</p>
            </div>
            <ChevronRight className={`ml-auto shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Reports;
