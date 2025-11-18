const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper function to generate JWT token
const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    },
  };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
};

// @desc    Register new user (PMI)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const {
    username,
    email,
    password,
    fullName,
    nik,
    phone,
    dateOfBirth,
    gender,
    address
  } = req.body;

  try {
    // Check if user already exists
    let existingUser = await User.findOne({
      $or: [{ username }, { email }, { 'profile.nik': nik }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ msg: 'Username sudah digunakan' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ msg: 'Email sudah digunakan' });
      }
      if (existingUser.profile.nik === nik) {
        return res.status(400).json({ msg: 'NIK sudah digunakan' });
      }
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      role: 'user',
      profile: {
        fullName,
        nik,
        phone,
        dateOfBirth,
        gender,
        address
      }
    });

    await newUser.save();

    // Generate token
    const token = await generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile
      }
    });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ msg: errors.join(', ') });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate user & get token (Admin & User)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Ambil kredensial admin dari environment variables
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.error('Admin credentials not set in .env file');
    return res.status(500).send('Server configuration error');
  }

  try {
    // Cek apakah username dan password cocok dengan admin dari .env
    if (username === adminUsername && password === adminPassword) {
      // Jika cocok, buat token JWT untuk admin
      const token = await generateToken({
        id: 'admin_static_id',
        username: adminUsername,
        role: 'admin'
      });

      return res.json({
        token,
        user: {
          id: 'admin_static_id',
          username: adminUsername,
          role: 'admin'
        }
      });
    } else {
      // Cek login dari database untuk user biasa
      const user = await User.findOne({ username }).select('+password');
      if (!user) {
        return res.status(400).json({ msg: 'Username atau Password salah' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(400).json({ msg: 'Akun tidak aktif' });
      }

      // Compare password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Username atau Password salah' });
      }

      // Generate token
      const token = await generateToken(user);

      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    if (req.user.id === 'admin_static_id') {
      // Handle admin user
      return res.json({
        user: {
          id: req.user.id,
          username: req.user.username,
          role: req.user.role
        }
      });
    }

    // Handle database user
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const {
    fullName,
    phone,
    dateOfBirth,
    gender,
    address
  } = req.body;

  try {
    if (req.user.id === 'admin_static_id') {
      return res.status(400).json({ msg: 'Admin profile tidak dapat diubah' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    // Update profile fields
    if (fullName !== undefined) user.profile.fullName = fullName;
    if (phone !== undefined) user.profile.phone = phone;
    if (dateOfBirth !== undefined) user.profile.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.profile.gender = gender;
    if (address !== undefined) user.profile.address = address;

    await user.save();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ msg: errors.join(', ') });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (req.user.id === 'admin_static_id') {
      return res.status(400).json({ msg: 'Password admin tidak dapat diubah melalui API' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    // Verify old password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Password lama salah' });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    res.json({ msg: 'Password berhasil diubah' });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ msg: errors.join(', ') });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token from localStorage/sessionStorage
    res.json({ msg: 'Logout berhasil' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
