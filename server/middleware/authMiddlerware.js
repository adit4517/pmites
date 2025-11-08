const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Check if the token starts with 'Bearer '
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token format is "Bearer <token>"' });
  }

  const token = authHeader.substring(7, authHeader.length); // Remove 'Bearer ' prefix

  if (!token) {
    return res.status(401).json({ msg: 'No token extracted, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Add user from payload to request object

    // Optional: Check if user still exists in DB
    // const user = await User.findById(req.user.id).select('-password');
    // if (!user) {
    //   return res.status(401).json({ msg: 'User not found, authorization denied' });
    // }
    // req.user = user; // Attach the full user object (without password)

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Token verification error:', err.message);
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token has expired' });
    }
    res.status(500).json({ msg: 'Server Error during token verification' });
  }
};

module.exports = authMiddleware;