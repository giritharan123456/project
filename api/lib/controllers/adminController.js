const District = require('../models/District');
const Area = require('../models/Area');
const BusinessCategory = require('../models/BusinessCategory');
const User = require('../models/User');

const calculateScores = (area) => {
  const gaps = area.marketGapScores ? Object.fromEntries(area.marketGapScores) : {};
  const demands = area.demandScores ? Object.fromEntries(area.demandScores) : {};
  const gapValues = Object.values(gaps);
  const demandValues = Object.values(demands);
  const avgGap = gapValues.length ? gapValues.reduce((s, v) => s + v, 0) / gapValues.length : 0;
  const avgDemand = demandValues.length ? demandValues.reduce((s, v) => s + v, 0) / demandValues.length : 0;
  const incomeScore = area.incomeLevel === 'High' ? 85 : area.incomeLevel === 'Medium' ? 60 : 35;
  const growthScore = Math.min((area.populationGrowth || 0) * 10, 100);
  area.feasibilityScore = Math.round((avgDemand * 0.35 + incomeScore * 0.25 + growthScore * 0.25 + (area.urbanDevelopment || 50) * 0.15) * 10) / 10;
  area.opportunityScore = Math.round((avgGap * 0.4 + avgDemand * 0.3 + growthScore * 0.2 + incomeScore * 0.1) * 10) / 10;
};

// @desc    Get all districts
// @route   GET /api/admin/districts
// @access  Admin
const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find({}).sort({ name: 1 });
    res.json({
      success: true,
      count: districts.length,
      data: districts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create district
// @route   POST /api/admin/districts
// @access  Admin
const createDistrict = async (req, res) => {
  try {
    const { name, state, population, area } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'District name is required' });
    }
    const district = await District.create({ name, state, population, area });
    res.status(201).json({
      success: true,
      message: 'District created successfully',
      data: district
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update district
// @route   PUT /api/admin/districts/:id
// @access  Admin
const updateDistrict = async (req, res) => {
  try {
    const district = await District.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!district) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }
    res.json({
      success: true,
      message: 'District updated successfully',
      data: district
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete district
// @route   DELETE /api/admin/districts/:id
// @access  Admin
const deleteDistrict = async (req, res) => {
  try {
    const district = await District.findById(req.params.id);
    if (!district) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }

    // Delete all areas in this district
    await Area.deleteMany({ district: req.params.id });
    await District.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'District and associated areas deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all areas
// @route   GET /api/admin/areas
// @access  Admin
const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find({}).populate('district', 'name').sort({ name: 1 });
    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get areas by district
// @route   GET /api/admin/areas/district/:districtId
// @access  Admin
const getAreasByDistrict = async (req, res) => {
  try {
    const areas = await Area.find({ district: req.params.districtId }).populate('district', 'name');
    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create area
// @route   POST /api/admin/areas
// @access  Admin
const createArea = async (req, res) => {
  try {
    const { name, pincode, population, competitors, demandScores, marketGapScores, searchTrends, district } = req.body;
    if (!name || !pincode || !district) {
      return res.status(400).json({ success: false, message: 'Name, pincode, and district are required' });
    }
    const area = new Area({ name, pincode, population, competitors, demandScores, marketGapScores, searchTrends, district });
    calculateScores(area);
    await area.save();
    const populatedArea = await Area.findById(area._id).populate('district', 'name');
    res.status(201).json({
      success: true,
      message: 'Area created successfully',
      data: populatedArea
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update area
// @route   PUT /api/admin/areas/:id
// @access  Admin
const updateArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ success: false, message: 'Area not found' });
    const allowed = ['name', 'pincode', 'population', 'populationGrowth', 'competitors', 'demandScores', 'marketGapScores', 'searchTrends', 'district', 'coordinates', 'incomeLevel', 'urbanDevelopment'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        area[key] = req.body[key];
      }
    }
    calculateScores(area);
    await area.save();
    const populated = await Area.findById(area._id).populate('district', 'name');
    res.json({
      success: true,
      message: 'Area updated successfully',
      data: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete area
// @route   DELETE /api/admin/areas/:id
// @access  Admin
const deleteArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ success: false, message: 'Area not found' });
    }
    await Area.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Area deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all business categories
// @route   GET /api/admin/business-categories
// @access  Admin
const getAllBusinessCategories = async (req, res) => {
  try {
    const categories = await BusinessCategory.find({}).sort({ name: 1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create business category
// @route   POST /api/admin/business-categories
// @access  Admin
const createBusinessCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const category = await BusinessCategory.create({ name, description, icon });
    res.status(201).json({
      success: true,
      message: 'Business category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update business category
// @route   PUT /api/admin/business-categories/:id
// @access  Admin
const updateBusinessCategory = async (req, res) => {
  try {
    const category = await BusinessCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Business category not found' });
    }
    res.json({
      success: true,
      message: 'Business category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete business category
// @route   DELETE /api/admin/business-categories/:id
// @access  Admin
const deleteBusinessCategory = async (req, res) => {
  try {
    const category = await BusinessCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Business category not found' });
    }
    await BusinessCategory.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Business category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        isGuest: updatedUser.isGuest
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const districtCount = await District.countDocuments();
    const areaCount = await Area.countDocuments();
    const categoryCount = await BusinessCategory.countDocuments();
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const guestCount = await User.countDocuments({ isGuest: true });

    res.json({
      success: true,
      data: {
        districts: districtCount,
        areas: areaCount,
        businessCategories: categoryCount,
        totalUsers: userCount,
        admins: adminCount,
        guests: guestCount,
        regularUsers: userCount - adminCount - guestCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  // District management
  getAllDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  
  // Area management
  getAllAreas,
  getAreasByDistrict,
  createArea,
  updateArea,
  deleteArea,
  
  // Business category management
  getAllBusinessCategories,
  createBusinessCategory,
  updateBusinessCategory,
  deleteBusinessCategory,
  
  // User management
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  
  // Dashboard stats
  getDashboardStats
};
