const District = require('../models/District');

// @desc    Get all districts
// @route   GET /api/districts
// @access  Public
const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find({});
    res.json({
      success: true,
      count: districts.length,
      data: districts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single district
// @route   GET /api/districts/:id
// @access  Public
const getDistrictById = async (req, res) => {
  try {
    const district = await District.findById(req.params.id);
    if (district) {
      res.json({
        success: true,
        data: district
      });
    } else {
      res.status(404).json({ success: false, message: 'District not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new district
// @route   POST /api/districts
// @access  Private/Admin
const createDistrict = async (req, res) => {
  try {
    const district = await District.create(req.body);
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
// @route   PUT /api/districts/:id
// @access  Private/Admin
const updateDistrict = async (req, res) => {
  try {
    const district = await District.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete district
// @route   DELETE /api/districts/:id
// @access  Private/Admin
const deleteDistrict = async (req, res) => {
  try {
    const district = await District.findByIdAndDelete(req.params.id);
    if (district) {
      res.json({
        success: true,
        message: 'District deleted successfully'
      });
    } else {
      res.status(404).json({ success: false, message: 'District not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllDistricts,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict
};
