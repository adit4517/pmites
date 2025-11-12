// File: server/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/auth/register
// @desc    Register new user (PMI)
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Admin & User)
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', authMiddleware, getCurrentUser);

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, updateProfile);

// @route   PUT api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authMiddleware, changePassword);

// @route   POST api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authMiddleware, logout);

module.exports = router;