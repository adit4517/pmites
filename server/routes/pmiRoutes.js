

// const express = require('express');
// const router = express.Router();
// const {
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   toggleUserActive,
//   verifyUser,
//   getUserStats
// } = require('../controllers/userController');

// const authMiddleware = require('../middleware/authMiddleware');
// const authorizeRoles = require('../middleware/roleMiddleware');

// // All routes are admin only

// // @route   GET /api/users/stats
// // @desc    Get user statistics
// // @access  Private (Admin only)
// router.get('/stats', authMiddleware, authorizeRoles('admin'), getUserStats);

// // @route   GET /api/users
// // @desc    Get all users
// // @access  Private (Admin only)
// router.get('/', authMiddleware, authorizeRoles('admin'), getAllUsers);

// // @route   GET /api/users/:id
// // @desc    Get user by ID
// // @access  Private (Admin only)
// router.get('/:id', authMiddleware, authorizeRoles('admin'), getUserById);

// // @route   PUT /api/users/:id
// // @desc    Update user
// // @access  Private (Admin only)
// router.put('/:id', authMiddleware, authorizeRoles('admin'), updateUser);

// // @route   DELETE /api/users/:id
// // @desc    Delete user
// // @access  Private (Admin only)
// router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteUser);

// // @route   PUT /api/users/:id/toggle-active
// // @desc    Toggle user active status
// // @access  Private (Admin only)
// router.put('/:id/toggle-active', authMiddleware, authorizeRoles('admin'), toggleUserActive);

// // @route   PUT /api/users/:id/verify
// // @desc    Verify user
// // @access  Private (Admin only)
// router.put('/:id/verify', authMiddleware, authorizeRoles('admin'), verifyUser);

// module.exports = router;

// File: server/routes/pmiRoutes.js

const express = require('express');
const router = express.Router();
const {
  // User PMI Functions
  createPmiApplication,
  getMyApplication,
  updateMyApplication,
  submitApplication,
  
  // Admin Functions
  getAllPmi,
  getPmiById,
  updatePmiStatus,
  addAdminNote,
  deletePmi,
  downloadDocument,
  
  // Statistics Functions
  getStatsJumlahPmi,
  getStatsAsal,
  getStatsAsalDesaByKecamatan,
  getStatsJenisKelamin,
  getStatsNegaraTujuan,
  getStatsProfesi,
  getStatsByStatus
} = require('../controllers/pmiController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// ============================================
// USER PMI ROUTES (Private - User only)
// ============================================

// @route   POST /api/pmi/application
// @desc    Create new PMI application (by user)
// @access  Private (User only)
router.post('/application', authMiddleware, authorizeRoles('user'), createPmiApplication);

// @route   GET /api/pmi/my-application
// @desc    Get user's own PMI application
// @access  Private (User only)
router.get('/my-application', authMiddleware, authorizeRoles('user'), getMyApplication);

// @route   PUT /api/pmi/my-application
// @desc    Update user's own PMI application
// @access  Private (User only)
router.put('/my-application', authMiddleware, authorizeRoles('user'), updateMyApplication);

// @route   POST /api/pmi/my-application/submit
// @desc    Submit application for review
// @access  Private (User only)
router.post('/my-application/submit', authMiddleware, authorizeRoles('user'), submitApplication);

// ============================================
// ADMIN ROUTES (Private - Admin only)
// ============================================

// @route   GET /api/pmi
// @desc    Get all PMI applications with search & filter
// @access  Private (Admin only)
router.get('/', authMiddleware, authorizeRoles('admin'), getAllPmi);

// @route   POST /api/pmi (for manual input by admin)
// @desc    Create PMI data manually by admin
// @access  Private (Admin only)
router.post('/', authMiddleware, authorizeRoles('admin'), createPmiApplication);

// @route   GET /api/pmi/:id
// @desc    Get PMI by ID
// @access  Private (Admin only)
router.get('/:id', authMiddleware, authorizeRoles('admin'), getPmiById);

// @route   PUT /api/pmi/:id
// @desc    Update PMI data
// @access  Private (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('admin'), updateMyApplication);

// @route   DELETE /api/pmi/:id
// @desc    Delete PMI
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deletePmi);

// @route   PUT /api/pmi/:id/status
// @desc    Update PMI status
// @access  Private (Admin only)
router.put('/:id/status', authMiddleware, authorizeRoles('admin'), updatePmiStatus);

// @route   POST /api/pmi/:id/note
// @desc    Add admin note to PMI
// @access  Private (Admin only)
router.post('/:id/note', authMiddleware, authorizeRoles('admin'), addAdminNote);

// ============================================
// DOWNLOAD ROUTE (Private - Admin & Owner)
// ============================================

// @route   GET /api/pmi/download/:pmiId/:docField
// @desc    Download document
// @access  Private (Admin & Owner of application)
router.get('/download/:pmiId/:docField', authMiddleware, downloadDocument);

// ============================================
// STATISTICS ROUTES (Private - Admin only)
// ============================================

// @route   GET /api/pmi/stats/jumlah
// @desc    Get total PMI count
// @access  Private (Admin only)
router.get('/stats/jumlah', authMiddleware, authorizeRoles('admin'), getStatsJumlahPmi);

// @route   GET /api/pmi/stats/asal
// @desc    Get PMI statistics by kecamatan
// @access  Private (Admin only)
router.get('/stats/asal', authMiddleware, authorizeRoles('admin'), getStatsAsal);

// @route   GET /api/pmi/stats/asal/desa/:kecamatan
// @desc    Get PMI statistics by desa in a kecamatan
// @access  Private (Admin only)
router.get('/stats/asal/desa/:kecamatan', authMiddleware, authorizeRoles('admin'), getStatsAsalDesaByKecamatan);

// @route   GET /api/pmi/stats/jenis-kelamin
// @desc    Get PMI statistics by gender
// @access  Private (Admin only)
router.get('/stats/jenis-kelamin', authMiddleware, authorizeRoles('admin'), getStatsJenisKelamin);

// @route   GET /api/pmi/stats/negara-tujuan
// @desc    Get PMI statistics by destination country
// @access  Private (Admin only)
router.get('/stats/negara-tujuan', authMiddleware, authorizeRoles('admin'), getStatsNegaraTujuan);

// @route   GET /api/pmi/stats/profesi
// @desc    Get PMI statistics by profession
// @access  Private (Admin only)
router.get('/stats/profesi', authMiddleware, authorizeRoles('admin'), getStatsProfesi);

// @route   GET /api/pmi/stats/status
// @desc    Get PMI statistics by status
// @access  Private (Admin only)
router.get('/stats/status', authMiddleware, authorizeRoles('admin'), getStatsByStatus);

module.exports = router;