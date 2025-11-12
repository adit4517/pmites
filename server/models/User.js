// File: server/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Informasi Akun
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Role User
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  
  // Data Pribadi (untuk user PMI)
  profile: {
    fullName: {
      type: String,
      required: function() {
        return this.role === 'user';
      }
    },
    nik: {
      type: String,
      unique: true,
      sparse: true, // Allow null for admin
      minlength: 16,
      maxlength: 16
    },
    phone: {
      type: String,
      required: function() {
        return this.role === 'user';
      }
    },
    dateOfBirth: {
      type: Date,
      required: function() {
        return this.role === 'user';
      }
    },
    gender: {
      type: String,
      enum: ['Laki-laki', 'Perempuan'],
      required: function() {
        return this.role === 'user';
      }
    },
    address: {
      province: String,
      regency: String,
      district: String,
      village: String,
      fullAddress: String
    },
    
    // Foto Profil
    profilePicture: {
      type: String,
      default: null
    }
  },
  
  // Status Akun
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Informasi Aplikasi PMI (jika user sudah mengajukan)
  pmiApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pmi',
    default: null
  },
  
  // Reset Password Token
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Timestamps
}, { 
  timestamps: true 
});

// Hash password sebelum save
UserSchema.pre('save', async function(next) {
  // Hanya hash jika password baru atau diubah
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method untuk compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method untuk generate reset token (untuk fitur lupa password)
UserSchema.methods.generateResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Token berlaku 10 menit
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

// Virtual untuk mendapatkan age dari dateOfBirth
UserSchema.virtual('age').get(function() {
  if (!this.profile.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.profile.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);