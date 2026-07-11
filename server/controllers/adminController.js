const District = require('../models/District');
const Area = require('../models/Area');
const BusinessCategory = require('../models/BusinessCategory');
const User = require('../models/User');
const calculateScores = require('../utils/calculateScores');
const { createNotification } = require('./notificationController');
const logger = require('../utils/logger');

// @desc    Get all districts
// @route   GET /api/admin/districts
// @access  Admin
const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find({}).lean().sort({ name: 1 });
    res.json({
      success: true,
      count: districts.length,
      data: districts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
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

    if (req.user) {
      await createNotification(
        req.user._id,
        'admin',
        `New district created: ${name}`,
        `Admin created district "${name}" in ${state || 'Tamil Nadu'}.`,
        { districtName: name }
      );
    }

    res.status(201).json({
      success: true,
      message: 'District created successfully',
      data: district
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Update district
// @route   PUT /api/admin/districts/:id
// @access  Admin
const updateDistrict = async (req, res) => {
  try {
    const { name, state } = req.body;
    const district = await District.findByIdAndUpdate(req.params.id, { name, state }, { new: true, runValidators: true });
    if (!district) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }

    if (req.user) {
      await createNotification(
        req.user._id,
        'admin',
        `District updated: ${district.name}`,
        `Admin updated district "${district.name}".`,
        { districtName: district.name }
      );
    }

    res.json({
      success: true,
      message: 'District updated successfully',
      data: district
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Delete district
// @route   DELETE /api/admin/districts/:id
// @access  Admin
const deleteDistrict = async (req, res) => {
  try {
    const district = await District.findById(req.params.id).lean();
    if (!district) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }

    const districtName = district.name;
    const areaCount = await Area.countDocuments({ district: req.params.id });
    await Area.deleteMany({ district: req.params.id });
    await District.findByIdAndDelete(req.params.id);

    if (req.user) {
      await createNotification(
        req.user._id,
        'admin',
        `District deleted: ${districtName}`,
        `Admin deleted district "${districtName}" and ${areaCount} associated areas.`,
        { districtName }
      );
    }

    res.json({
      success: true,
      message: 'District and associated areas deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get all areas
// @route   GET /api/admin/areas
// @access  Admin
const getAllAreas = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 500, 1), 1000);
    const areas = await Area.find({}).lean().populate('district', 'name').sort({ name: 1 }).limit(limit);
    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get areas by district
// @route   GET /api/admin/areas/district/:districtId
// @access  Admin
const getAreasByDistrict = async (req, res) => {
  try {
    const areas = await Area.find({ district: req.params.districtId }).lean().populate('district', 'name');
    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Create area
// @route   POST /api/admin/areas
// @access  Admin
const createArea = async (req, res) => {
  try {
    const { name, pincode, population, populationGrowth, incomeLevel, coordinates, urbanDevelopment, searchTrends, competitors, demandScores, marketGapScores, district, literacyRate, trafficLevel, landmarks, ageDistribution, residentialVsCommercial } = req.body;
    if (!name || !pincode || !district) {
      return res.status(400).json({ success: false, message: 'Name, pincode, and district are required' });
    }
    const area = new Area({
      name, pincode, population, populationGrowth, incomeLevel,
      coordinates: coordinates || { lat: 0, lng: 0 },
      urbanDevelopment, searchTrends, competitors, demandScores, marketGapScores, district,
      literacyRate, trafficLevel, landmarks, ageDistribution, residentialVsCommercial
    });
    calculateScores(area);
    await area.save();
    const populatedArea = await Area.findById(area._id).lean().populate('district', 'name');

    if (req.user) {
      const districtName = populatedArea.district?.name || '';
      await createNotification(
        req.user._id,
        'admin',
        `New area created: ${name} (${pincode})`,
        `Admin created area "${name}" in ${districtName} with pincode ${pincode}.`,
        { pincode, areaName: name, districtName }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Area created successfully',
      data: populatedArea
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Update area
// @route   PUT /api/admin/areas/:id
// @access  Admin
const updateArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ success: false, message: 'Area not found' });
    const allowed = ['name', 'pincode', 'population', 'populationGrowth', 'competitors', 'demandScores', 'marketGapScores', 'searchTrends', 'district', 'coordinates', 'incomeLevel', 'urbanDevelopment', 'literacyRate', 'trafficLevel', 'landmarks', 'ageDistribution', 'residentialVsCommercial'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        area[key] = req.body[key];
      }
    }
    calculateScores(area);
    await area.save();
    const populated = await Area.findById(area._id).lean().populate('district', 'name');

    if (req.user) {
      const districtName = populated.district?.name || '';
      await createNotification(
        req.user._id,
        'admin',
        `Area updated: ${area.name} (${area.pincode})`,
        `Admin updated area "${area.name}" in ${districtName}.`,
        { pincode: area.pincode, areaName: area.name, districtName }
      );
    }

    res.json({
      success: true,
      message: 'Area updated successfully',
      data: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Delete area
// @route   DELETE /api/admin/areas/:id
// @access  Admin
const deleteArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id).lean();
    if (!area) {
      return res.status(404).json({ success: false, message: 'Area not found' });
    }
    const areaName = area.name;
    const pincode = area.pincode;
    const populatedArea = await Area.findById(area._id).lean().populate('district', 'name');
    const districtName = populatedArea?.district?.name || '';
    await Area.findByIdAndDelete(req.params.id);

    if (req.user) {
      await createNotification(
        req.user._id,
        'admin',
        `Area deleted: ${areaName} (${pincode})`,
        `Admin deleted area "${areaName}" in ${districtName}.`,
        { pincode, areaName, districtName }
      );
    }

    res.json({
      success: true,
      message: 'Area deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get all business categories
// @route   GET /api/admin/business-categories
// @access  Admin
const getAllBusinessCategories = async (req, res) => {
  try {
    const categories = await BusinessCategory.find({}).lean().sort({ name: 1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
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

    if (req.user) {
      await createNotification(
        req.user._id,
        'admin',
        `New business category: ${name}`,
        `Admin created business category "${name}".`,
        {}
      );
    }

    res.status(201).json({
      success: true,
      message: 'Business category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Update business category
// @route   PUT /api/admin/business-categories/:id
// @access  Admin
const updateBusinessCategory = async (req, res) => {
  try {
    const { name, description, icon, minInvestment, maxInvestment, typicalMargin, growthRate } = req.body;
    const category = await BusinessCategory.findByIdAndUpdate(req.params.id, { name, description, icon, minInvestment, maxInvestment, typicalMargin, growthRate }, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Business category not found' });
    }

    if (req.user) {
      await createNotification(
        req.user._id,
        'admin',
        `Business category updated: ${category.name}`,
        `Admin updated business category "${category.name}".`,
        {}
      );
    }

    res.json({
      success: true,
      message: 'Business category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Delete business category
// @route   DELETE /api/admin/business-categories/:id
// @access  Admin
const deleteBusinessCategory = async (req, res) => {
  try {
    const category = await BusinessCategory.findById(req.params.id).lean();
    if (!category) {
      return res.status(404).json({ success: false, message: 'Business category not found' });
    }
    const categoryName = category.name;
    await BusinessCategory.findByIdAndDelete(req.params.id);

    if (req.user) {
      await createNotification(
        req.user._id,
        'admin',
        `Business category deleted: ${categoryName}`,
        `Admin deleted business category "${categoryName}".`,
        {}
      );
    }

    res.json({
      success: true,
      message: 'Business category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 200, 1), 500);
    const users = await User.find({}).lean().select('-password').sort({ createdAt: -1 }).limit(limit);
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
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

    if (req.body.email && req.body.email !== user.email) {
      const existing = await User.findOne({ email: req.body.email }).lean();
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = req.body.email;
    }
    user.name = req.body.name || user.name;
    if (req.body.role) {
      if (!['guest', 'user', 'admin'].includes(req.body.role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }
      user.role = req.body.role;
    }
    if (req.body.password) {
      if (req.body.password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
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
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot delete the last admin' });
      }
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
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
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
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
