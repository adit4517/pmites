// File: server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserActive,
  verifyUser,
  getUserStats
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// All routes are admin only

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private (Admin only)
router.get('/stats', authMiddleware, authorizeRoles('admin'), getUserStats);

// @route   GET /api/users
// @desc    Get all users with search & filter
// @access  Private (Admin only)
router.get('/', authMiddleware, authorizeRoles('admin'), getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin only)
router.get('/:id', authMiddleware, authorizeRoles('admin'), getUserById);

// @route   PUT /api/users/:id
// @desc    Update user data
// @access  Private (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('admin'), updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteUser);

// @route   PUT /api/users/:id/toggle-active
// @desc    Toggle user active status
// @access  Private (Admin only)
router.put('/:id/toggle-active', authMiddleware, authorizeRoles('admin'), toggleUserActive);

// @route   PUT /api/users/:id/verify
// @desc    Verify user account
// @access  Private (Admin only)
router.put('/:id/verify', authMiddleware, authorizeRoles('admin'), verifyUser);

module.exports = router;