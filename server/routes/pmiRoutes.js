const express = require('express');
const router = express.Router();
const {
  createPmi,
  getAllPmi,
  getPmiById,
  deletePmi,
  downloadDocument,
  getStatsJumlahPmi,
  getStatsAsal,
  getStatsAsalDesaByKecamatan,
  getStatsJenisKelamin,
  getStatsNegaraTujuan,
  getStatsProfesi,
  updatePmi
} = require('../controllers/pmiController');
// const authMiddleware = require('../middleware/authMiddleware'); // Jika ingin proteksi route

// @route   POST api/pmi
// @desc    Create a PMI record
// @access  Private (contoh, jika sudah ada authMiddleware)
router.post('/', /*authMiddleware,*/ createPmi); // authMiddleware di-komen dulu

// @route   GET api/pmi
// @desc    Get all PMI records
// @access  Private
router.get('/', /*authMiddleware,*/ getAllPmi);

// @route   GET api/pmi/:id
// @desc    Get single PMI record
// @access  Private
router.get('/:id', /*authMiddleware,*/ getPmiById);

// @route   DELETE api/pmi/:id
// @desc    Delete a PMI record
// @access  Private
router.delete('/:id', /*authMiddleware,*/ deletePmi);

// @route   GET api/pmi/download/:pmiId/:docField
// @desc    Download a specific document for a PMI
// @access  Private (or Public depending on requirements)
router.get('/download/:pmiId/:docField', /*authMiddleware,*/ downloadDocument);


// Statistik Routes
router.get('/stats/jumlah', /*authMiddleware,*/ getStatsJumlahPmi);
router.get('/stats/asal', /*authMiddleware,*/ getStatsAsal);
router.get('/stats/asal/desa/:kecamatan', /*authMiddleware,*/ getStatsAsalDesaByKecamatan);
router.get('/stats/jenis-kelamin', /*authMiddleware,*/ getStatsJenisKelamin);
router.get('/stats/negara-tujuan', /*authMiddleware,*/ getStatsNegaraTujuan);
router.get('/stats/profesi', /*authMiddleware,*/ getStatsProfesi);

// @route   PUT api/pmi/:id
// @desc    Update a PMI record
// @access  Private
router.put('/:id', /*authMiddleware,*/ updatePmi);

module.exports = router;