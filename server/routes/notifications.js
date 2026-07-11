const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

// All notification routes require authentication
router.use(protect);

router.get('/', getNotifications);
router.put('/mark-all-read', markAllAsRead);
router.put('/:id/read', param('id').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, markAsRead);
router.delete('/:id', param('id').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, deleteNotification);

module.exports = router;
