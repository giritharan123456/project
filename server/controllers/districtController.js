const District = require('../models/District');
const Area = require('../models/Area');
const logger = require('../utils/logger');

// @desc    Get all districts
// @route   GET /api/districts
// @access  Public
const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find({}).lean();
    res.json({
      success: true,
      count: districts.length,
      data: districts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get single district
// @route   GET /api/districts/:id
// @access  Public
const getDistrictById = async (req, res) => {
  try {
    const district = await District.findById(req.params.id).lean();
    if (district) {
      res.json({
        success: true,
        data: district
      });
    } else {
      res.status(404).json({ success: false, message: 'District not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Create new district
// @route   POST /api/districts
// @access  Private/Admin
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
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Update district
// @route   PUT /api/districts/:id
// @access  Private/Admin
const updateDistrict = async (req, res) => {
  try {
    const { name, state, population, area } = req.body;
    const district = await District.findByIdAndUpdate(
      req.params.id,
      { name, state, population, area },
      { new: true, runValidators: true }
    );
    if (district) {
      res.json({
        success: true,
        message: 'District updated successfully',
        data: district
      });
    } else {
      res.status(404).json({ success: false, message: 'District not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Delete district
// @route   DELETE /api/districts/:id
// @access  Private/Admin
const deleteDistrict = async (req, res) => {
  try {
    const district = await District.findById(req.params.id).lean();
    if (district) {
      await Area.deleteMany({ district: req.params.id });
      await District.findByIdAndDelete(req.params.id);
      res.json({
        success: true,
        message: 'District and associated areas deleted successfully'
      });
    } else {
      res.status(404).json({ success: false, message: 'District not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

module.exports = {
  getAllDistricts,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict
};
