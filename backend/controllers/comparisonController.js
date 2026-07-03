const Area = require('../models/Area');
const User = require('../models/User');

// @desc    Compare multiple areas
// @route   POST /api/comparison/compare
// @access  Private
const compareAreas = async (req, res) => {
  try {
    const { areaIds } = req.body;
    
    if (!areaIds || !Array.isArray(areaIds) || areaIds.length < 2 || areaIds.length > 4) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide 2-4 area IDs for comparison' 
      });
    }

    const areas = await Area.find({ _id: { $in: areaIds } }).populate('district', 'name');
    
    if (areas.length !== areaIds.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'One or more areas not found' 
      });
    }

    // Calculate comparison metrics
    const comparisonData = areas.map(area => ({
      id: area._id,
      pincode: area.pincode,
      name: area.name,
      district: area.district.name,
      population: area.population,
      populationGrowth: area.populationGrowth,
      incomeLevel: area.incomeLevel,
      urbanDevelopment: area.urbanDevelopment,
      searchTrends: area.searchTrends,
      competitors: area.competitors,
      demandScores: area.demandScores,
      marketGapScores: area.marketGapScores,
      overallScore: (() => { const m = area.marketGapScores ? Object.fromEntries(area.marketGapScores) : {}; const v = Object.values(m); return v.length ? v.reduce((a, b) => a + (Number(b) || 0), 0) / v.length : 0; })()
    }));

    // Determine winner
    const winner = comparisonData.reduce((prev, current) => 
      prev.overallScore > current.overallScore ? prev : current
    );

    res.json({
      success: true,
      data: {
        areas: comparisonData,
        winner,
        comparisonDate: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save comparison
// @route   POST /api/comparison/save
// @access  Private
const saveComparison = async (req, res) => {
  try {
    const { areaIds, name } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create comparison object
    const comparison = {
      name: name || `Comparison ${new Date().toLocaleDateString()}`,
      areaIds,
      createdAt: new Date()
    };

    user.savedComparisons.push(comparison);
    await user.save();

    res.json({
      success: true,
      message: 'Comparison saved successfully',
      data: comparison
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get saved comparisons
// @route   GET /api/comparison/saved
// @access  Private
const getSavedComparisons = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user.savedComparisons
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete saved comparison
// @route   DELETE /api/comparison/:id
// @access  Private
const deleteComparison = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.savedComparisons = user.savedComparisons.filter(
      comp => comp._id.toString() !== req.params.id
    );
    await user.save();

    res.json({
      success: true,
      message: 'Comparison deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  compareAreas,
  saveComparison,
  getSavedComparisons,
  deleteComparison
};
