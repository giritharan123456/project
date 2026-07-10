import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { usePincode } from '../contexts/PincodeContext';
import { areasAPI } from '../services/api';
import EmptyState from '../components/EmptyState';
import { averageOfValues, toPlainObject, NO_DATA_LABEL } from '../utils/dataUtils';
import { 
  Sparkles, TrendingUp, DollarSign, Users, Target, CheckCircle,
  AlertTriangle, ArrowRight, Star, Lightbulb, BarChart3,
  Clock, Award, Zap, ChevronRight, MapPin, PieChart, BookOpen
} from 'lucide-react';

function AIRecommendations() {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, districts } = useDistrict();
  const { selectedPincode } = usePincode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [areaData, setAreaData] = useState(null);
  const [error, setError] = useState(null);
  
  const currentDistrict = districts.find(d => d._id === selectedDistrict);
  const districtName = currentDistrict?.name || 'No district selected';

  useEffect(() => {
    const fetchAreaData = async () => {
      if (!selectedPincode) {
        setAreaData(null);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await areasAPI.getByPincode(selectedPincode);
        setAreaData(response.data || null);
        if (!response.data) {
          setError(`Data for pincode ${selectedPincode} will be loaded from government APIs. Please try again or select a different pincode.`);
        }
      } catch (err) {
        setAreaData(null);
        setError(err.message || 'Failed to load area data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAreaData();
  }, [selectedPincode]);

  // Generate dynamic recommendations based on area data
  const generateRecommendations = (area) => {
    if (!area) return null;

    try {
      // Calculate all metrics dynamically from real data
      const population = Number(area.population) || 0;
      const populationGrowth = Number(area.populationGrowth) || 0;
      const incomeLevel = area.incomeLevel || 'Low';
      const urbanDevelopment = Number(area.urbanDevelopment) || 0;

      // Calculate best business category using multi-factor scoring
      const marketGapScores = area.marketGapScores || {};
      const competitors = area.competitors || {};
      const demandScores = area.demandScores || {};
      
      let bestCategory = 'General Retail';
      let highestScore = 0;
      
      Object.entries(marketGapScores).forEach(([category, gap]) => {
        const competition = competitors[category] || 0;
        const demand = demandScores[category] || 0;
        
        // Multi-factor scoring: demand (35%) + gap (25%) + growth (15%) + population (15%) - competition penalty (10%)
        const gapNorm = Math.max(0, gap) / 80;
        const demandNorm = Math.max(0, demand) / 100;
        const compPenalty = (competition / 100) * 10;
        const popFit = Math.min(1, population / 50000);
        const growthNorm = Math.min(1, populationGrowth / 5);
        
        const score = (demandNorm * 35) + (gapNorm * 25) + (growthNorm * 15) + (popFit * 15) - compPenalty;
        
        if (score > highestScore) {
          highestScore = score;
          bestCategory = category;
        }
      });
      
      const highestGap = marketGapScores[bestCategory] || 0;
      
      // Calculate investment based on population and income level
      const baseInvestment = population * 0.05; // Base investment per person
      const incomeMultiplier = incomeLevel === 'High' ? 2 : incomeLevel === 'Medium' ? 1.5 : 1;
      const investmentRange = Math.round(baseInvestment * incomeMultiplier);
      const investmentMin = Math.max(5, Math.round(investmentRange * 0.8));
      const investmentMax = Math.max(10, Math.round(investmentRange * 1.2));
      
      // Calculate expected customers based on population and urban development
      const dailyCustomerRate = (urbanDevelopment / 100) * 0.01; // 0.5% to 1% of population
      const expectedCustomersMin = Math.round(population * dailyCustomerRate * 0.8);
      const expectedCustomersMax = Math.round(population * dailyCustomerRate * 1.2);
      
      // Calculate expected revenue based on demand scores and competition
      const avgDemand = Object.values(demandScores).reduce((sum, val) => sum + (Number(val) || 0), 0) / (Object.keys(demandScores).length || 1);
      const avgCompetition = Object.values(competitors).reduce((sum, val) => sum + (Number(val) || 0), 0) / (Object.keys(competitors).length || 1);
      const revenuePerCustomer = (avgDemand / 100) * 100; // Average spend per customer
      const monthlyRevenueMin = Math.round(expectedCustomersMin * revenuePerCustomer * 30 / 100000);
      const monthlyRevenueMax = Math.round(expectedCustomersMax * revenuePerCustomer * 30 / 100000);
      
      // Calculate success probability based on market gap and competition
      const successProbability = Math.min(95, Math.max(50, Math.round(60 + (highestGap * 0.5) - (avgCompetition * 2))));
      
      // Generate dynamic advantages based on real data
      const advantages = [];
      if (populationGrowth > 2) advantages.push(`Growing population (+${Number(populationGrowth).toFixed(2)}% YoY)`);
      if (urbanDevelopment > 60) advantages.push('Developed infrastructure');
      if (avgDemand > 70) advantages.push('High market demand');
      if (avgCompetition < 5) advantages.push('Low competition');
      if (incomeLevel === 'High' || incomeLevel === 'Medium') advantages.push('Good purchasing power');
      
      // Generate dynamic challenges based on real data
      const challenges = [];
      if (avgCompetition > 8) challenges.push('High competition');
      if (urbanDevelopment < 50) challenges.push('Limited infrastructure');
      if (populationGrowth < 1.5) challenges.push('Slow population growth');
      if (incomeLevel === 'Low') challenges.push('Lower purchasing power');
      
      // Generate future demand projection based on population growth
      const futureDemandPercent = Math.round(populationGrowth * 1.5);
      const futureDemand = `Projected growth (+${Number(futureDemandPercent).toFixed(2)}% YoY)`;
      
      // Generate alternative business ideas based on market gaps
      const alternativeIdeas = [];
      Object.entries(marketGapScores)
        .filter(([cat, gap]) => gap > 60 && cat !== bestCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([category]) => {
          alternativeIdeas.push(`${category} Business`);
        });
      
      if (alternativeIdeas.length === 0) {
        const topGaps = Object.entries(marketGapScores)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([cat]) => `${cat} Business`);
        alternativeIdeas.push(...(topGaps.length > 0 ? topGaps : ['Service Business', 'Franchise Outlet', 'Home-based Business']));
      }

      return {
        business: `${bestCategory} Business`,
        category: bestCategory,
        investment: `₹${investmentMin}-${investmentMax} Lakhs`,
        expectedCustomers: `${expectedCustomersMin}-${expectedCustomersMax}/day`,
        expectedRevenue: `₹${monthlyRevenueMin}-${monthlyRevenueMax} Lakhs/month`,
        successProbability: successProbability,
        whyRecommended: `High market gap score (${Math.round(highestGap)}) for ${bestCategory} in ${area.name} with population of ${population.toLocaleString()}`,
        advantages: advantages.length > 0 ? advantages : ['Market opportunity available', 'Growing demand', 'Scalable business model'],
        challenges: challenges.length > 0 ? challenges : ['Market competition', 'Initial setup costs'],
        futureDemand: futureDemand,
        alternativeIdeas: alternativeIdeas
      };
    } catch (error) {
      return null;
    }
  };

  const topRecommendation = generateRecommendations(areaData);

  // Generate other recommendations based on remaining categories
  const generateOtherRecommendations = (area) => {
    if (!area) return [];

    try {
      const marketGapScores = area.marketGapScores || {};
      const competitors = area.competitors || {};
      const demandScores = area.demandScores || {};
      const population = Number(area.population) || 0;
      const populationGrowth = Number(area.populationGrowth) || 0;
      const incomeLevel = area.incomeLevel || 'Low';
      const urbanDevelopment = Number(area.urbanDevelopment) || 0;
      
      const recommendations = [];

      Object.entries(marketGapScores).forEach(([category, gap]) => {
        const competition = competitors[category] || 0;
        const demand = demandScores[category] || 0;
        
        // Same multi-factor scoring as top recommendation
        const gapNorm = Math.max(0, gap) / 80;
        const demandNorm = Math.max(0, demand) / 100;
        const compPenalty = (competition / 100) * 10;
        const popFit = Math.min(1, population / 50000);
        const growthNorm = Math.min(1, populationGrowth / 5);
        
        const score = (demandNorm * 35) + (gapNorm * 25) + (growthNorm * 15) + (popFit * 15) - compPenalty;
        const adjustedGap = score;
        
        // Calculate metrics dynamically for each category
        const baseInvestment = population * 0.04;
        const incomeMultiplier = incomeLevel === 'High' ? 2 : incomeLevel === 'Medium' ? 1.5 : 1;
        const investmentRange = Math.round(baseInvestment * incomeMultiplier);
        const investmentMin = Math.max(5, Math.round(investmentRange * 0.7));
        const investmentMax = Math.max(8, Math.round(investmentRange * 1.1));
        
        const dailyCustomerRate = (urbanDevelopment / 100) * 0.008;
        const expectedCustomersMin = Math.round(population * dailyCustomerRate * 0.7);
        const expectedCustomersMax = Math.round(population * dailyCustomerRate * 1.1);
        
        const successProb = Math.min(85, Math.max(45, Math.round(55 + (score * 0.8) - (competition * 1.5))));
        
        const revenuePerCustomer = (demand / 100) * 90;
        const monthlyRevenueMin = Math.round(expectedCustomersMin * revenuePerCustomer * 30 / 100000);
        const monthlyRevenueMax = Math.round(expectedCustomersMax * revenuePerCustomer * 30 / 100000);
        
        recommendations.push({
          business: `${category} Business`,
          category: category,
          score: score,
          investment: `₹${investmentMin}-${investmentMax} Lakhs`,
          expectedCustomers: `${expectedCustomersMin}-${expectedCustomersMax}/day`,
          expectedRevenue: `₹${monthlyRevenueMin}-${monthlyRevenueMax} Lakhs/month`,
          successProbability: successProb,
          whyRecommended: `Market gap score ${Math.round(gap)} for ${category} with demand ${Math.round(demand)}`,
          advantages: [
            adjustedGap > 20 ? 'Good market opportunity' : 'Available market',
            demand > 60 ? 'High demand' : 'Moderate demand',
            competition < 5 ? 'Low competition' : 'Manageable competition'
          ],
          challenges: [
            competition > 8 ? 'High competition' : 'Market competition',
            'Initial setup required',
            'Market conditions vary'
          ],
          futureDemand: `Projected growth (+${Number(Math.round(populationGrowth * 1.2)).toFixed(2)}% YoY)`,
          alternativeIdeas: []
        });
      });

      // Sort by score and return top 3 excluding the top recommendation
      return recommendations
        .sort((a, b) => b.score - a.score)
        .filter(rec => rec.category !== (topRecommendation?.category))
        .slice(0, 3);
    } catch (error) {
      return [];
    }
  };

  const otherRecommendations = generateOtherRecommendations(areaData);

  if (!selectedPincode) {
    return (
      <div className={`min-h-[calc(100vh-70px)] px-3 py-2 sm:px-4 sm:py-3 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="max-w-7xl mx-auto">
          <EmptyState type="noData" message="Please select a pincode on the Dashboard first." actionText="Go to Dashboard" onAction={() => navigate('/dashboard')} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-[calc(100vh-70px)] px-3 py-2 sm:px-4 sm:py-3 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
            <p className={`${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading area data from backend...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !areaData || !topRecommendation) {
    return (
      <div className={`min-h-[calc(100vh-70px)] px-3 py-2 sm:px-4 sm:py-3 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="max-w-7xl mx-auto">
          <EmptyState type={error ? 'error' : 'noData'} message={error || `Data for pincode ${selectedPincode} will be loaded from government APIs. Please try again or select a different pincode.`} actionText="Go to Dashboard" onAction={() => navigate('/dashboard')} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-70px)] px-3 py-2 sm:px-4 sm:py-3 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-[#2563eb]" size={32} />
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              AI-Powered Recommendations
            </h1>
          </div>
          <p className={`text-sm sm:text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Intelligent business suggestions based on market analysis for {selectedPincode ? `pincode ${selectedPincode}` : districtName}
          </p>
        </motion.div>

        {/* Top Recommendation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-3xl border-2 mb-8 relative overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-[#2563eb]' : 'bg-[#ffffff] border-[#2563eb]'}`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-full opacity-10 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-yellow-500" size={24} />
              <span className="text-yellow-500 font-bold text-sm sm:text-base">Top Recommendation</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
              <div>
                <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {topRecommendation.business}
                </h2>
                <p className={`text-sm sm:text-base md:text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {topRecommendation.category}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                    {Number(topRecommendation.successProbability).toFixed(2)}%
                  </div>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    Success Probability
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-3 sm:p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
              <div className="flex items-start gap-3">
                <Lightbulb className="text-[#2563eb] flex-shrink-0" size={20} />
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  <span className="font-semibold">Why Recommended:</span> {topRecommendation.whyRecommended}
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className={`p-3 sm:p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-green-500" size={20} />
                  <span className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Investment</span>
                </div>
                <p className={`text-base sm:text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {topRecommendation.investment}
                </p>
              </div>
              <div className={`p-3 sm:p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-blue-500" size={20} />
                  <span className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Expected Customers</span>
                </div>
                <p className={`text-base sm:text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {topRecommendation.expectedCustomers}
                </p>
              </div>
              <div className={`p-3 sm:p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-purple-500" size={20} />
                  <span className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Expected Revenue</span>
                </div>
                <p className={`text-base sm:text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {topRecommendation.expectedRevenue}
                </p>
              </div>
            </div>

            {/* Advantages & Challenges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-green-500" size={20} />
                  <h3 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Advantages</h3>
                </div>
                <ul className="space-y-2">
                  {topRecommendation.advantages.map((advantage, index) => (
                    <li key={index} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-orange-500" size={20} />
                  <h3 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Challenges</h3>
                </div>
                <ul className="space-y-2">
                  {topRecommendation.challenges.map((challenge, index) => (
                    <li key={index} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={16} />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Future Demand */}
            <div className={`p-3 sm:p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Clock className="text-[#2563eb]" size={20} />
                  <span className={`font-semibold text-sm sm:text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Future Demand</span>
                </div>
                <span className="text-green-500 font-bold text-sm sm:text-base">{topRecommendation.futureDemand}</span>
              </div>
            </div>

            {/* Alternative Ideas */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-[#2563eb]" size={20} />
                <h3 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Alternative Ideas</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {topRecommendation.alternativeIdeas.map((idea, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0]'}`}
                  >
                    {idea}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Other Recommendations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {otherRecommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                whileHover={{ scale: 1.02 }}
                className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  <span className={`font-semibold text-sm sm:text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {recommendation.business}
                  </span>
                </div>
                <p className={`text-sm opacity-70 mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {recommendation.category}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Investment</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {recommendation.investment}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Success Rate</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {Number(recommendation.successProbability).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Revenue</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {recommendation.expectedRevenue}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-full"
                    style={{ width: `${recommendation.successProbability}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-[#2563eb]" size={24} />
            <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              AI Market Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: TrendingUp, label: 'Market Growth', value: `+${Number(areaData.populationGrowth || 0).toFixed(2)}%`, color: 'text-green-500' },
              { icon: Users, label: 'Population', value: `${(Number(areaData.population || 0) / 1000).toFixed(0)}K`, color: 'text-blue-500' },
              { icon: DollarSign, label: 'Income Level', value: areaData.incomeLevel || 'Low', color: 'text-purple-500' },
              { icon: Target, label: 'Urban Dev', value: `${Number(areaData.urbanDevelopment || 0).toFixed(2)}/100`, color: 'text-orange-500' }
            ].map((insight, index) => (
              <div key={index} className={`p-3 sm:p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <insight.icon className={`${insight.color} mb-2`} size={20} />
                <p className={`text-xs sm:text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{insight.label}</p>
                <p className={`text-base sm:text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{insight.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          <Link 
            to="/forecast"
            className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div className="min-w-0">
              <h4 className={`font-bold mb-1 text-sm sm:text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>View Forecast</h4>
              <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>5-year predictions</p>
            </div>
            <ChevronRight className={`ml-auto flex-shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>

          <Link 
            to="/comparison"
            className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
              <PieChart className="text-white" size={24} />
            </div>
            <div className="min-w-0">
              <h4 className={`font-bold mb-1 text-sm sm:text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Compare Areas</h4>
              <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Side-by-side analysis</p>
            </div>
            <ChevronRight className={`ml-auto flex-shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>

          <Link 
            to="/reports"
            className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
              <BookOpen className="text-white" size={24} />
            </div>
            <div className="min-w-0">
              <h4 className={`font-bold mb-1 text-sm sm:text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Export Report</h4>
              <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Download PDF</p>
            </div>
            <ChevronRight className={`ml-auto flex-shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default AIRecommendations;
