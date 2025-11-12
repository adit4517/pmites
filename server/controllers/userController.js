// File: server/controllers/userController.js

const User = require('../models/User');
const Pmi = require('../models/Pmi');

// ============ ADMIN FUNCTIONS ============

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.fullName': { $regex: search, $options: 'i' } },
        { 'profile.nik': { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .populate('pmiApplication', 'pmiId status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });

  } catch (err) {
    console.error('Get all users error:', err.message);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('pmiApplication');

    if (!user) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.error('Get user by ID error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const {
      username,
      email,
      role,
      isActive,
      isVerified,
      fullName,
      phone
    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive !== 'undefined') user.isActive = isActive;
    if (typeof isVerified !== 'undefined') user.isVerified = isVerified;
    
    if (fullName) user.profile.fullName = fullName;
    if (phone) user.profile.phone = phone;

    await user.save();

    res.json({
      success: true,
      msg: 'User berhasil diupdate',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified
      }
    });

  } catch (err) {
    console.error('Update user error:', err.message);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    // Tidak bisa hapus admin
    if (user.role === 'admin') {
      return res.status(400).json({ 
        msg: 'Tidak dapat menghapus akun admin' 
      });
    }

    // Hapus aplikasi PMI jika ada
    if (user.pmiApplication) {
      await Pmi.findByIdAndDelete(user.pmiApplication);
    }

    await user.deleteOne();

    res.json({
      success: true,
      msg: 'User berhasil dihapus'
    });

  } catch (err) {
    console.error('Delete user error:', err.message);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle-active
// @access  Private (Admin only)
exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ 
        msg: 'Tidak dapat menonaktifkan akun admin' 
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      msg: `User berhasil ${user.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
      isActive: user.isActive
    });

  } catch (err) {
    console.error('Toggle active error:', err.message);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

// @desc    Verify user
// @route   PUT /api/users/:id/verify
// @access  Private (Admin only)
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      success: true,
      msg: 'User berhasil diverifikasi',
      isVerified: user.isVerified
    });

  } catch (err) {
    console.error('Verify user error:', err.message);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin only)
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const verifiedUsers = await User.countDocuments({ role: 'user', isVerified: true });
    const usersWithApplication = await User.countDocuments({ 
      role: 'user', 
      pmiApplication: { $ne: null } 
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        usersWithApplication,
        inactiveUsers: totalUsers - activeUsers,
        unverifiedUsers: totalUsers - verifiedUsers
      }
    });

  } catch (err) {
    console.error('Get user stats error:', err.message);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};