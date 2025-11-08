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

// --- PENTING: Sajikan folder 'uploads' secara statis ---
// Ini memungkinkan akses langsung ke file melalui URL seperti http://localhost:5000/uploads/namafile.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pmi', require('./routes/pmiRoutes'));
app.use('/api/status', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Backend PMI Rembang berjalan!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ [SERVER BERHASIL BERJALAN] di Port: ${PORT}`);
});
