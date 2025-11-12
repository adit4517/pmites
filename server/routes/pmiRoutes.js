
// ========================================
// File: server/routes/userRoutes.js (NEW)
// ========================================

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
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', authMiddleware, authorizeRoles('admin'), getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin only)
router.get('/:id', authMiddleware, authorizeRoles('admin'), getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
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
// @desc    Verify user
// @access  Private (Admin only)
router.put('/:id/verify', authMiddleware, authorizeRoles('admin'), verifyUser);

module.exports = router;


// ========================================
// IMPORTANT: Update server/server.js
// ========================================

/*
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

// Sajikan folder 'uploads' secara statis
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pmi', require('./routes/pmiRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // <-- ADD THIS LINE

app.use('/api/status', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Backend PMI Rembang berjalan!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ [SERVER BERHASIL BERJALAN] di Port: ${PORT}`);
});
*/