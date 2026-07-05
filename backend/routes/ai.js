const express = require('express');
const router = express.Router();
const Area = require('../models/Area');
const District = require('../models/District');
const { protect } = require('../middleware/auth');

const getSmartResponse = async (query) => {
  const q = query.toLowerCase();
  const areas = await Area.find().limit(50);
  const districts = await District.find();

  if (q.includes('best') || q.includes('top') || q.includes('recommend')) {
    const topAreas = areas
      .sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0))
      .slice(0, 5);
    if (topAreas.length === 0) return 'No area data available yet. Search a pincode to load data.';
    const list = topAreas.map((a, i) => `${i + 1}. ${a.area || a.name} (${a.pincode}) — Score: ${a.opportunityScore || 'N/A'}`).join('\n');
    return `Top opportunities:\n${list}`;
  }

  if (q.includes('population') || q.includes('demographic')) {
    const totalPop = areas.reduce((s, a) => s + (a.population || 0), 0);
    const avgGrowth = areas.length ? (areas.reduce((s, a) => s + (a.populationGrowth || 0), 0) / areas.length).toFixed(1) : 0;
    return `Population overview:\n• Total: ${totalPop.toLocaleString()}\n• Avg Growth: ${avgGrowth}%\n• Areas analyzed: ${areas.length}`;
  }

  if (q.includes('demand') || q.includes('gap') || q.includes('score')) {
    const highOpp = areas.filter(a => (a.opportunityScore || 0) >= 70).length;
    const avgScore = areas.length ? (areas.reduce((s, a) => s + (a.opportunityScore || 0), 0) / areas.length).toFixed(1) : 0;
    return `Market analysis:\n• High opportunity areas: ${highOpp}\n• Average score: ${avgScore}\n• Total areas: ${areas.length}`;
  }

  if (q.includes('district')) {
    const distList = districts.map(d => d.name).join(', ');
    return `Available districts (${districts.length}):\n${distList}`;
  }

  if (q.includes('competitor') || q.includes('competition')) {
    const highComp = areas.filter(a => {
      const comps = Object.values(a.competitors || {});
      return comps.some(c => (Number(c) || 0) >= 80);
    }).length;
    return `Competition analysis:\n• High competition areas: ${highComp}\n• Total areas analyzed: ${areas.length}`;
  }

  if (q.includes('forecast') || q.includes('trend') || q.includes('future')) {
    const avgGrowth = areas.length ? (areas.reduce((s, a) => s + (a.populationGrowth || 0), 0) / areas.length).toFixed(1) : 0;
    return `Trend forecast:\n• Population growth trend: ${avgGrowth}%\n• Market is ${parseFloat(avgGrowth) > 1 ? 'growing' : 'stable'}\n• Recommend focusing on areas with >1.5% growth`;
  }

  return `I can help with:\n• "Best opportunities" — top areas\n• "Population stats" — demographics\n• "Market demand" — gap analysis\n• "Districts" — list of districts\n• "Competitors" — competition data\n• "Forecast" — market trends`;
};

router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    const response = await getSmartResponse(message.trim());
    res.json({ success: true, data: { response } });
  } catch (err) {
    res.json({ success: true, data: { response: 'I can help with market analysis. Try asking about opportunities, population, demand, or districts.' } });
  }
});

module.exports = router;
