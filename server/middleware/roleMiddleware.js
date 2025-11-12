// File: server/middleware/roleMiddleware.js

/**
 * Middleware untuk check role user
 * Usage: router.get('/admin-only', authMiddleware, authorizeRoles('admin'), controllerFunc)
 */

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user sudah di-set oleh authMiddleware sebelumnya
    if (!req.user) {
      return res.status(401).json({ 
        msg: 'Tidak terautentikasi' 
      });
    }

    // Check apakah role user termasuk dalam allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `Akses ditolak. Role '${req.user.role}' tidak memiliki izin untuk mengakses resource ini.`,
        requiredRoles: roles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

module.exports = authorizeRoles;