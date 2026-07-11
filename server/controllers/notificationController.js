const Notification = require('../models/Notification');
const logger = require('../utils/logger');

// @desc    Get all notifications for authenticated user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const { limit = 50, unreadOnly } = req.query;
    const query = { user: req.user._id };

    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false
    });

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Mark all notifications as read for user
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Create a notification (internal use by other controllers)
// @param   userId - ObjectId of user
// @param   type - notification type
// @param   title - notification title
// @param   message - notification message
// @param   metadata - optional { pincode, areaName, districtName, score }
const createNotification = async (userId, type, title, message, metadata = {}) => {
  try {
    if (!userId) return; // skip for unauthenticated fetches
    await Notification.create({ user: userId, type, title, message, metadata });
  } catch (err) {
    // Non-critical — log but don't throw
    logger.error(`Failed to create notification: ${err.message}`);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
};
