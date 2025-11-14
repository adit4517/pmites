// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const cors = require('cors');
// const path = require('path');

// dotenv.config();
// connectDB();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // Sajikan folder 'uploads' secara statis
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Define Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/pmi', require('./routes/pmiRoutes'));
// app.use('/api/users', require('./routes/userRoutes')); // <-- ADD THIS LINE

// app.use('/api/status', (req, res) => {
//   res.status(200).json({ status: 'success', message: 'Backend PMI Rembang berjalan!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ [SERVER BERHASIL BERJALAN] di Port: ${PORT}`);
// });

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sajikan folder 'uploads' secara statis
// Ini memungkinkan akses langsung ke file melalui URL seperti http://localhost:5000/uploads/namafile.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pmi', require('./routes/pmiRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // User management routes

// Health check endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Backend PMI Rembang berjalan!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    msg: 'Route tidak ditemukan',
    requestedUrl: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    msg: err.message || 'Terjadi kesalahan server',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ [SERVER BERHASIL BERJALAN] di Port: ${PORT}`);
});