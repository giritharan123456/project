const Area = require('../models/Area');
const District = require('../models/District');
const BusinessCategory = require('../models/BusinessCategory');
const { convertMapFieldsArray } = require('../utils/leanHelpers');
const logger = require('../utils/logger');

const getSmartResponse = async (query) => {
  const q = query.toLowerCase().trim();

  const [rawAreas, districts, categories] = await Promise.all([
    Area.find().populate('district', 'name').lean().limit(200),
    District.find(),
    BusinessCategory.find()
  ]);
  const areas = convertMapFieldsArray(rawAreas);

  const pincodeMatch = q.match(/\b(\d{6})\b/);
  if (pincodeMatch) {
    const pincode = pincodeMatch[1];
    const area = areas.find(a => a.pincode === pincode);
    if (area) {
      const districtName = area.district?.name || 'Unknown';
      const pop = (area.population || 0).toLocaleString();
      const growth = area.populationGrowth || 0;
      const urban = area.urbanDevelopment || 0;
      const income = area.incomeLevel || 'N/A';
      const opp = area.opportunityScore || 0;

      const demands = Object.fromEntries(area.demandScores || new Map());
      const gaps = Object.fromEntries(area.marketGapScores || new Map());
      const comps = Object.fromEntries(area.competitors || new Map());

      const avgDemand = Object.keys(demands).length ? Object.values(demands).reduce((a, b) => a + (Number(b) || 0), 0) / Object.keys(demands).length : 0;
      const avgGap = Object.keys(gaps).length ? Object.values(gaps).reduce((a, b) => a + (Number(b) || 0), 0) / Object.keys(gaps).length : 0;
      const avgComp = Object.keys(comps).length ? Object.values(comps).reduce((a, b) => a + (Number(b) || 0), 0) / Object.keys(comps).length : 0;

      let bestCat = 'N/A';
      let bestScore = 0;
      if (gaps && typeof gaps === 'object') {
        for (const [cat, gap] of Object.entries(gaps)) {
          const gapVal = Number(gap) || 0;
          const demandVal = Number(demands[cat]) || 0;
          const compVal = Number(comps[cat]) || 0;
          const score = (demandVal * 0.4) + (gapVal * 0.4) - (compVal * 0.2);
          if (score > bestScore) { bestScore = score; bestCat = cat; }
        }
      }

      return `Here's the complete market data for pincode ${pincode}:\n\n` +
        `Location: ${area.area || area.name}, ${districtName}\n` +
        `Population: ${pop}\n` +
        `Growth Rate: ${growth}%\n` +
        `Urban Development: ${urban}/100\n` +
        `Income Level: ${income}\n` +
        `Opportunity Score: ${opp}/100\n\n` +
        `Market Analysis:\n` +
        `• Average Demand: ${avgDemand.toFixed(1)}/10\n` +
        `• Average Market Gap: ${avgGap.toFixed(1)}/100\n` +
        `• Average Competition: ${avgComp.toFixed(1)}/100\n\n` +
        (bestCat !== 'N/A' ? `Best Business Opportunity: ${bestCat}\nThis category has the highest demand-to-competition ratio in this area.\n\n` : '') +
        `${opp >= 70 ? 'This is a high-opportunity area with strong market potential.' : opp >= 50 ? 'This area has moderate potential. Consider the specific business category carefully.' : 'This area has limited opportunities currently. Look for niche businesses with low competition.'}\n\n` +
        `Want me to compare this with nearby areas or suggest specific business types?`;
    } else {
      return `Pincode ${pincode} is not yet in our database. However, I can help you:\n\n` +
        `1. Search this pincode on the Dashboard — our system will automatically fetch real data from government APIs\n` +
        `2. Once loaded, you'll get full market analysis including population, demand scores, and competition data\n\n` +
        `Would you like me to tell you about nearby areas that are already in our database?`;
    }
  }

  const matchedDistrict = districts.find(d => q.includes(d.name.toLowerCase()));
  if (matchedDistrict) {
    const distAreas = areas.filter(a => a.district?.name === matchedDistrict.name || a.district?.toString() === matchedDistrict._id.toString());
    if (distAreas.length === 0) {
      return `District "${matchedDistrict.name}" is in our system but has no area data loaded yet.\n\nSearch any pincode in ${matchedDistrict.name} on the Dashboard to start loading market data.`;
    }
    const totalPop = distAreas.reduce((s, a) => s + (a.population || 0), 0);
    const avgOpp = distAreas.length ? (distAreas.reduce((s, a) => s + (a.opportunityScore || 0), 0) / distAreas.length).toFixed(1) : 0;
    const topArea = distAreas.sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0))[0];
    const avgGrowth = distAreas.length ? (distAreas.reduce((s, a) => s + (a.populationGrowth || 0), 0) / distAreas.length).toFixed(1) : 0;

    return `${matchedDistrict.name} District Market Overview:\n\n` +
      `Areas analyzed: ${distAreas.length}\n` +
      `Total population: ${totalPop.toLocaleString()}\n` +
      `Average growth rate: ${avgGrowth}%\n` +
      `Average opportunity score: ${avgOpp}/100\n\n` +
      (topArea ? `Top area: ${topArea.area || topArea.name} (Score: ${topArea.opportunityScore || 0})\n\n` : '') +
      `${parseFloat(avgOpp) >= 60 ? `${matchedDistrict.name} shows strong market potential across multiple areas.` : `${matchedDistrict.name} has moderate market conditions. Focus on specific high-demand categories.`}\n\n` +
      `Select ${matchedDistrict.name} on the Dashboard to explore detailed area-wise data. Which specific area would you like to know about?`;
  }

  if (q.match(/^(hi|hello|hey|good morning|good evening|good afternoon|namaste|hola|yo)/)) {
    return `Hello! I'm your MarketVision AI assistant. I have real market data for ${areas.length} areas across ${districts.length} districts in Tamil Nadu.\n\nI can help you with:\n• Ask about any pincode — I'll show real population, demand, competition data\n• Ask about any district — I'll show the market overview\n• Find best business opportunities\n• Analyze market demand and competition\n• Get investment guidance\n\nWhat would you like to know?`;
  }

  if (q.includes('best') || q.includes('top') || q.includes('recommend') || q.includes('opportunity') || q.includes('opportunities') || q.includes('which area')) {
    const topAreas = areas
      .filter(a => (a.opportunityScore || 0) > 0)
      .sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0))
      .slice(0, 5);
    if (topAreas.length === 0) return 'No area data available yet. Search a pincode on the Dashboard to load market data.';
    const list = topAreas.map((a, i) => `${i + 1}. ${a.area || a.name} (${a.pincode}) — Score: ${a.opportunityScore}/100 — ${a.district?.name || 'N/A'}`).join('\n');
    const avgScore = (topAreas.reduce((s, a) => s + (a.opportunityScore || 0), 0) / topAreas.length).toFixed(1);
    return `Top 5 Business Opportunities in Tamil Nadu:\n\n${list}\n\nAverage score: ${avgScore}/100\n\nThese areas have the highest demand, lowest competition, and strongest market gaps. For detailed analysis of any area, just ask me about its pincode.`;
  }

  if (q.includes('population') || q.includes('demographic') || q.includes('people') || q.includes('how many people') || q.includes('how many person')) {
    const totalPop = areas.reduce((s, a) => s + (a.population || 0), 0);
    const avgGrowth = areas.length ? (areas.reduce((s, a) => s + (a.populationGrowth || 0), 0) / areas.length).toFixed(1) : 0;
    const highGrowth = areas.filter(a => (a.populationGrowth || 0) > 1.5).length;
    const urbanAreas = areas.filter(a => (a.urbanDevelopment || 0) > 60).length;
    const highIncome = areas.filter(a => a.incomeLevel === 'High').length;
    return `Population & Demographics:\n\nTotal population: ${totalPop.toLocaleString()}\nAverage growth rate: ${avgGrowth}%\nHigh-growth areas: ${highGrowth}\nUrbanized areas: ${urbanAreas}\nHigh-income areas: ${highIncome}\n\nTotal areas in database: ${areas.length}\n\n${parseFloat(avgGrowth) > 1 ? 'The population is growing steadily. This means increasing consumer demand in expanding areas.' : 'Population is stable. Focus on areas with high urban development for consistent business returns.'}`;
  }

  if (q.includes('demand') || q.includes('gap') || q.includes('need') || q.includes('require')) {
    const highOpp = areas.filter(a => (a.opportunityScore || 0) >= 70).length;
    const avgScore = areas.length ? (areas.reduce((s, a) => s + (a.opportunityScore || 0), 0) / areas.length).toFixed(1) : 0;

    const catDemand = {};
    areas.forEach(a => {
      const demands = Object.fromEntries(a.demandScores || new Map());
      Object.entries(demands).forEach(([cat, val]) => {
        if (!catDemand[cat]) catDemand[cat] = [];
        catDemand[cat].push(Number(val) || 0);
      });
    });
    const catAvg = Object.entries(catDemand).map(([cat, vals]) => ({
      cat, avg: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
    })).sort((a, b) => b.avg - a.avg);

    return `Market Demand Analysis:\n\nHigh opportunity areas: ${highOpp}/${areas.length}\nAverage market score: ${avgScore}/100\n\nDemand by Business Category:\n${catAvg.map(c => `• ${c.cat}: ${c.avg}/10`).join('\n')}\n\n${catAvg.length > 0 ? `Highest demand: ${catAvg[0].cat} (${catAvg[0].avg}/10)` : ''}\n\nUse the Category Explorer page to see detailed demand breakdown for each business type.`;
  }

  if (q.includes('competitor') || q.includes('competition') || q.includes('rival') || q.includes('compete')) {
    const highComp = areas.filter(a => {
      const comps = Object.values(Object.fromEntries(a.competitors || new Map()));
      return comps.some(c => (Number(c) || 0) >= 80);
    }).length;
    const lowComp = areas.filter(a => {
      const comps = Object.values(Object.fromEntries(a.competitors || new Map()));
      return comps.every(c => (Number(c) || 0) < 40);
    }).length;

    const catComp = {};
    areas.forEach(a => {
      const comps = Object.fromEntries(a.competitors || new Map());
      Object.entries(comps).forEach(([cat, val]) => {
        if (!catComp[cat]) catComp[cat] = [];
        catComp[cat].push(Number(val) || 0);
      });
    });
    const catAvg = Object.entries(catComp).map(([cat, vals]) => ({
      cat, avg: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
    })).sort((a, b) => a.avg - b.avg);

    return `Competition Analysis:\n\nHigh competition areas: ${highComp}/${areas.length}\nLow competition areas: ${lowComp}/${areas.length}\n\nLowest Competition Categories (best for new entry):\n${catAvg.slice(0, 4).map(c => `• ${c.cat}: ${c.avg}/100`).join('\n')}\n\n${lowComp > 3 ? `${lowComp} areas have low competition — ideal for starting a new business.` : 'Competition is high across most areas. Consider niche categories with less saturation.'}`;
  }

  if (q.includes('forecast') || q.includes('trend') || q.includes('future') || q.includes('growth') || q.includes('predict') || q.includes('next year') || q.includes('5 year')) {
    const avgGrowth = areas.length ? (areas.reduce((s, a) => s + (a.populationGrowth || 0), 0) / areas.length).toFixed(1) : 0;
    const growingAreas = areas.filter(a => (a.populationGrowth || 0) > 1.5).length;
    const topGrowing = areas.sort((a, b) => (b.populationGrowth || 0) - (a.populationGrowth || 0)).slice(0, 3);
    return `Market Forecast & Trends:\n\nAverage growth rate: ${avgGrowth}%\nRapidly growing areas: ${growingAreas}\n\nTop Growing Areas:\n${topGrowing.map((a, i) => `${i + 1}. ${a.area || a.name} (${a.pincode}) — Growth: ${a.populationGrowth || 0}%`).join('\n')}\n\n${parseFloat(avgGrowth) > 1 ? 'Market is growing. Invest in high-growth areas now for strong 2-3 year returns.' : 'Growth is moderate. Focus on established urban areas with consistent demand.'}\n\nFor 5-year projections, go to the Forecast page and enter a specific pincode.`;
  }

  if (q.includes('business') || q.includes('category') || q.includes('shop') || q.includes('store') || q.includes('startup') || q.includes('open') || q.includes('start')) {
    if (categories.length > 0) {
      const catList = categories.map(c => `• ${c.name}`).join('\n');

      const catStats = {};
      areas.forEach(a => {
        const demands = Object.fromEntries(a.demandScores || new Map());
        const gaps = Object.fromEntries(a.marketGapScores || new Map());
        Object.entries(demands).forEach(([cat, val]) => {
          if (!catStats[cat]) catStats[cat] = { demand: [], gap: [] };
          catStats[cat].demand.push(Number(val) || 0);
        });
        Object.entries(gaps).forEach(([cat, val]) => {
          if (!catStats[cat]) catStats[cat] = { demand: [], gap: [] };
          catStats[cat].gap.push(Number(val) || 0);
        });
      });

      const catSummary = Object.entries(catStats).map(([cat, data]) => {
        const avgDemand = data.demand.length ? (data.demand.reduce((a, b) => a + b, 0) / data.demand.length).toFixed(1) : 0;
        const avgGap = data.gap.length ? (data.gap.reduce((a, b) => a + b, 0) / data.gap.length).toFixed(1) : 0;
        return `${cat}: Demand ${avgDemand}/10, Gap ${avgGap}/100`;
      }).join('\n');

      return `Business Categories Available:\n\n${catList}\n\nCategory Performance (based on ${areas.length} areas):\n${catSummary}\n\nTo find the best area for a specific business, select it on the Dashboard or use the Category Explorer.`;
    }
    return 'Business categories are being loaded. Check the Category Explorer page for detailed analysis.';
  }

  if (q.includes('invest') || q.includes('cost') || q.includes('budget') || q.includes('money') || q.includes('price') || q.includes('how much')) {
    const highIncome = areas.filter(a => a.incomeLevel === 'High').length;
    const medIncome = areas.filter(a => a.incomeLevel === 'Medium').length;
    const lowIncome = areas.filter(a => a.incomeLevel === 'Low').length;
    return `Investment Guidance:\n\nIncome Distribution Across Areas:\n• High income areas: ${highIncome}\n• Medium income areas: ${medIncome}\n• Low income areas: ${lowIncome}\n\nInvestment depends on:\n• Area population & income level\n• Urban development score\n• Competition density\n• Business category\n\nFor personalized investment estimate:\n1. Select a pincode on Dashboard\n2. Go to AI Recommendations page\n3. Get detailed investment range, expected customers, and revenue projections\n\nWould you like me to suggest areas matching your budget?`;
  }

  if (q.includes('income') || q.includes('salary') || q.includes('rich') || q.includes('poor') || q.includes('earning')) {
    const highIncome = areas.filter(a => a.incomeLevel === 'High').length;
    const medIncome = areas.filter(a => a.incomeLevel === 'Medium').length;
    const lowIncome = areas.filter(a => a.incomeLevel === 'Low').length;
    const highIncomeAreas = areas.filter(a => a.incomeLevel === 'High').slice(0, 5);
    return `Income Level Analysis:\n\n• High income areas: ${highIncome}\n• Medium income areas: ${medIncome}\n• Low income areas: ${lowIncome}\n\nTop High-Income Areas:\n${highIncomeAreas.map(a => `• ${a.area || a.name} (${a.pincode}) — Pop: ${(a.population || 0).toLocaleString()}`).join('\n')}\n\nHigh-income areas support premium businesses and higher pricing. Medium-income areas are best for value-for-money services.`;
  }

  if (q.includes('safe') || q.includes('safety') || q.includes('risk') || q.includes('secure')) {
    const lowCompAreas = areas.filter(a => {
      const comps = Object.values(Object.fromEntries(a.competitors || new Map()));
      return comps.every(c => (Number(c) || 0) < 40);
    }).length;
    const highOppAreas = areas.filter(a => (a.opportunityScore || 0) >= 70).length;
    return `Business Safety Analysis:\n\nLow-risk areas (low competition): ${lowCompAreas}\nHigh-opportunity areas: ${highOppAreas}\n\nSafest business strategies:\n• Start in low-competition areas with proven demand\n• Choose categories with high market gap scores\n• Focus on areas with population > 20,000 for stable customer base\n\nAvoid areas where competition score > 80 unless you have a unique value proposition.`;
  }

  if (q.startsWith('which') || q.startsWith('what') || q.startsWith('where') || q.startsWith('why') || q.startsWith('how')) {
    if (q.includes('which') && (q.includes('area') || q.includes('place') || q.includes('location') || q.includes('best'))) {
      const top = areas.filter(a => (a.opportunityScore || 0) > 0).sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0)).slice(0, 3);
      if (top.length) {
        return `Best areas to start a business:\n\n${top.map((a, i) => `${i + 1}. ${a.area || a.name} (${a.pincode}) — ${a.district?.name}\n   Score: ${a.opportunityScore}/100, Pop: ${(a.population || 0).toLocaleString()}`).join('\n\n')}\n\nThese have the highest opportunity scores based on demand, competition gaps, and population. Ask me about any specific pincode for detailed data.`;
      }
    }
    if (q.includes('which') && q.includes('business')) {
      const catStats = {};
      areas.forEach(a => {
        const gaps = Object.fromEntries(a.marketGapScores || new Map());
        Object.entries(gaps).forEach(([cat, val]) => {
          if (!catStats[cat]) catStats[cat] = [];
          catStats[cat].push(Number(val) || 0);
        });
      });
      const best = Object.entries(catStats).map(([cat, vals]) => ({
        cat, avg: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
      })).sort((a, b) => b.avg - a.avg).slice(0, 3);
      if (best.length) {
        return `Best business categories by market gap:\n\n${best.map((c, i) => `${i + 1}. ${c.cat} — Gap score: ${c.avg}/100`).join('\n')}\n\nHigher gap = more untapped demand. These categories have the most room for new businesses across ${areas.length} areas.`;
      }
    }
    if (q.includes('where')) {
      const top = areas.filter(a => (a.opportunityScore || 0) > 0).sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0)).slice(0, 3);
      if (top.length) {
        return `Top locations for business:\n\n${top.map((a, i) => `${i + 1}. ${a.area || a.name}, ${a.district?.name} (${a.pincode})`).join('\n')}\n\nThese areas have the highest combined scores for demand, low competition, and population.`;
      }
    }
    return `I can help you find:\n• Best areas — ask "which area is best for business"\n• Best business type — ask "which business should I start"\n• Top locations — ask "where should I open a business"\n• Market data — ask about any pincode number\n\nWhat specifically would you like to know?`;
  }

  if (q.match(/^(yes|no|ok|okay|sure|yep|nope)$/)) {
    return `Could you tell me more about what you're looking for? I can help with:\n\n• Market data for any pincode\n• District-wise analysis\n• Best business opportunities\n• Competition and demand analysis\n• Investment guidance\n\nJust ask your question and I'll provide real data.`;
  }

  if (q.includes('thank') || q.includes('thanks') || q.includes('appreciate') || q.includes('great') || q.includes('good')) {
    return `You're welcome! I'm here to help with any market research questions. You can ask me about:\n\n• Any pincode — real population, demand, competition data\n• Any district — market overview and top areas\n• Business planning — investment, categories, opportunities\n\nFeel free to ask anytime!`;
  }

  if (q.includes('help') || q.includes('how to') || q.includes('what can') || q.includes('feature') || q.includes('use') || q.includes('tutorial')) {
    return `How to use MarketVision AI:\n\n1. Ask about any pincode (e.g. "600001") — get real market data\n2. Ask about any district (e.g. "Chennai") — get district overview\n3. Ask "best opportunities" — see top areas\n4. Ask "competition" — see competitive landscape\n5. Ask "population" — demographic data\n6. Ask "business categories" — available types\n7. Ask "investment" — cost guidance\n\nFor detailed analysis:\n• Dashboard — explore all areas and pincodes\n• AI Recommendations — personalized business suggestions\n• Category Explorer — category-wise analysis\n• Forecast — 5-year projections\n\nWhat would you like to know?`;
  }

  const areaMatch = areas.find(a => q.includes((a.area || a.name || '').toLowerCase()));
  if (areaMatch) {
    const districtName = areaMatch.district?.name || 'N/A';
    return `Data for ${areaMatch.area || areaMatch.name} (${areaMatch.pincode}), ${districtName}:\n\n` +
      `Population: ${(areaMatch.population || 0).toLocaleString()}\n` +
      `Growth: ${areaMatch.populationGrowth || 0}%\n` +
      `Urban Dev: ${areaMatch.urbanDevelopment || 0}/100\n` +
      `Income: ${areaMatch.incomeLevel || 'N/A'}\n` +
      `Opportunity Score: ${areaMatch.opportunityScore || 0}/100\n\n` +
      `Ask me about the pincode ${areaMatch.pincode} for a detailed breakdown of demand, competition, and best business categories.`;
  }

  return `I understand you're asking about "${query}". Here's what I can help with:\n\n` +
    `• Ask about any 6-digit pincode — I'll show real market data\n` +
    `• Ask about any district name — I'll show the overview\n` +
    `• "Best opportunities" — top areas by score\n` +
    `• "Market demand" — demand analysis by category\n` +
    `• "Competition" — competitive landscape\n` +
    `• "Population stats" — demographic data\n` +
    `• "Business categories" — available types\n` +
    `• "Investment guidance" — cost estimates\n` +
    `• "Growth trends" — forecast data\n\n` +
    `I have real data for ${areas.length} areas across ${districts.length} districts. Try asking about a specific pincode or district!`;
};

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    const response = await getSmartResponse(message.trim());
    res.json({ success: true, data: { response } });
  } catch (err) {
    logger.error('AI chat error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate response' });
  }
};
