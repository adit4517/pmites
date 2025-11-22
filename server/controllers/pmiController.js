// File: server/controllers/pmiController.js

const Pmi = require('../models/Pmi');
const User = require('../models/User');
const Counter = require('../models/Counter');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images, PDFs, or Word Documents Only!');
    }
  }
}).fields([
  { name: 'ktpPmi', maxCount: 1 },
  { name: 'kk', maxCount: 1 },
  { name: 'akta', maxCount: 1 },
  { name: 'bukuNikah', maxCount: 1 },
  { name: 'ijazah', maxCount: 1 },
  { name: 'izinKeluarga', maxCount: 1 },
  { name: 'sertifikatKeterampilan', maxCount: 1 },
  { name: 'dokumenLainnya', maxCount: 1 },
  { name: 'pasFoto', maxCount: 1 },
  { name: 'skck', maxCount: 1 },
  { name: 'suratSehatJasmani', maxCount: 1 },
  { name: 'suratSehatRohani', maxCount: 1 }
]);

// ============ USER PMI FUNCTIONS ============

// @desc    Create PMI application (by User)
// @route   POST /api/pmi/application
// @access  Private (User only)
exports.createPmiApplication = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ msg: err });
    }

    try {
      const existingApplication = await Pmi.findOne({ user: req.user.id });
      
      if (existingApplication) {
        return res.status(400).json({ 
          msg: 'Anda sudah memiliki aplikasi PMI. Silakan edit aplikasi yang ada.' 
        });
      }

      const {
        nama,
        asalKecamatan,
        asalDesa,
        jenisKelamin,
        negaraTujuan,
        profesi,
        waktuBerangkat,
        pendidikanTerakhir,
        pengalamanKerja,
        keterampilan
      } = req.body;

      const counterDoc = await Counter.findOneAndUpdate(
        { _id: 'pmiId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const pmiId = 'PMI' + String(counterDoc.seq).padStart(3, '0');

      const dokumen = {};
      if (req.files) {
        for (const key in req.files) {
          if (req.files[key] && req.files[key][0]) {
            dokumen[key] = req.files[key][0].path;
          }
        }
      }

      let keterampilanArray = [];
      if (keterampilan) {
        if (typeof keterampilan === 'string') {
          keterampilanArray = keterampilan.split(',').map(k => k.trim());
        } else if (Array.isArray(keterampilan)) {
          keterampilanArray = keterampilan;
        }
      }

      const newPmi = new Pmi({
        pmiId,
        user: req.user.id,
        nama,
        asal: { kecamatan: asalKecamatan, desa: asalDesa },
        jenisKelamin,
        negaraTujuan,
        profesi,
        waktuBerangkat,
        pendidikanTerakhir,
        pengalamanKerja: pengalamanKerja || null,
        keterampilan: keterampilanArray,
        dokumen,
        status: 'draft'
      });

      const pmi = await newPmi.save();

      await User.findByIdAndUpdate(req.user.id, {
        pmiApplication: pmi._id
      });

      res.status(201).json({
        success: true,
        msg: 'Aplikasi PMI berhasil dibuat',
        pmi
      });

    } catch (err) {
      console.error('Error creating PMI application:', err.message);
      res.status(500).json({ 
        msg: 'Terjadi kesalahan server',
        error: err.message 
      });
    }
  });
};

// @desc    Get user's PMI application
// @route   GET /api/pmi/my-application
// @access  Private (User only)
exports.getMyApplication = async (req, res) => {
  try {
    const pmi = await Pmi.findOne({ user: req.user.id })
      .populate('user', 'username email profile')
      .populate('processedBy', 'username profile.fullName');

    if (!pmi) {
      return res.status(404).json({ 
        msg: 'Anda belum memiliki aplikasi PMI' 
      });
    }

    res.json({
      success: true,
      pmi
    });

  } catch (err) {
    console.error('Error getting my application:', err.message);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

// @desc    Update PMI application (by User)
// @route   PUT /api/pmi/my-application
// @access  Private (User only)
exports.updateMyApplication = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    try {
      const pmi = await Pmi.findOne({ user: req.user.id });

      if (!pmi) {
        return res.status(404).json({ 
          msg: 'Aplikasi tidak ditemukan' 
        });
      }

      if (!['draft', 'need_revision'].includes(pmi.status)) {
        return res.status(400).json({ 
          msg: `Aplikasi dengan status '${pmi.statusLabel}' tidak dapat diedit` 
        });
      }

      const {
        nama,
        asalKecamatan,
        asalDesa,
        jenisKelamin,
        negaraTujuan,
        profesi,
        waktuBerangkat,
        pendidikanTerakhir,
        pengalamanKerja,
        keterampilan,
        documentsToDelete
      } = req.body;

      if (nama) pmi.nama = nama;
      if (asalKecamatan && asalDesa) pmi.asal = { kecamatan: asalKecamatan, desa: asalDesa };
      if (jenisKelamin) pmi.jenisKelamin = jenisKelamin;
      if (negaraTujuan) pmi.negaraTujuan = negaraTujuan;
      if (profesi) pmi.profesi = profesi;
      if (waktuBerangkat) pmi.waktuBerangkat = waktuBerangkat;
      if (pendidikanTerakhir) pmi.pendidikanTerakhir = pendidikanTerakhir;
      if (pengalamanKerja) pmi.pengalamanKerja = pengalamanKerja;
      
      if (keterampilan) {
        if (typeof keterampilan === 'string') {
          pmi.keterampilan = keterampilan.split(',').map(k => k.trim());
        } else if (Array.isArray(keterampilan)) {
          pmi.keterampilan = keterampilan;
        }
      }

      if (documentsToDelete) {
        const docsToDeleteArray = JSON.parse(documentsToDelete);
        docsToDeleteArray.forEach(docField => {
          if (pmi.dokumen[docField]) {
            fs.unlink(path.join(__dirname, '..', pmi.dokumen[docField]), (unlinkErr) => {
              if (unlinkErr) console.error(`Failed to delete: ${pmi.dokumen[docField]}`);
            });
            pmi.dokumen[docField] = undefined;
          }
        });
      }

      if (req.files) {
        for (const key in req.files) {
          if (req.files[key] && req.files[key][0]) {
            if (pmi.dokumen[key]) {
              fs.unlink(path.join(__dirname, '..', pmi.dokumen[key]), (unlinkErr) => {
                if (unlinkErr) console.error(`Failed to delete old file`);
              });
            }
            pmi.dokumen[key] = req.files[key][0].path;
          }
        }
      }

      if (pmi.status === 'need_revision') {
        pmi.revisionNotes = null;
      }

      pmi.markModified('dokumen');
      await pmi.save();

      res.json({
        success: true,
        msg: 'Aplikasi berhasil diupdate',
        pmi
      });

    } catch (err) {
      console.error('Error updating application:', err.message);
      res.status(500).json({ msg: 'Terjadi kesalahan server' });
    }
  });
};

// @desc    Submit PMI application
// @route   POST /api/pmi/my-application/submit
// @access  Private (User only)
exports.submitApplication = async (req, res) => {
  try {
    const pmi = await Pmi.findOne({ user: req.user.id });

    if (!pmi) {
      return res.status(404).json({ 
        msg: 'Aplikasi tidak ditemukan' 
      });
    }

    if (!['draft', 'need_revision'].includes(pmi.status)) {
      return res.status(400).json({ 
        msg: 'Aplikasi sudah disubmit sebelumnya' 
      });
    }

    const requiredDocs = ['ktpPmi', 'kk', 'akta', 'ijazah', 'pasFoto'];
    const missingDocs = requiredDocs.filter(doc => !pmi.dokumen[doc]);

    if (missingDocs.length > 0) {
      return res.status(400).json({ 
        msg: 'Dokumen wajib belum lengkap',
        missingDocs: missingDocs
      });
    }

    await pmi.updateStatus('submitted', req.user.id, 'Aplikasi disubmit oleh user');

    res.json({
      success: true,
      msg: 'Aplikasi berhasil disubmit. Menunggu review dari admin.',
      pmi
    });

  } catch (err) {
    console.error('Error submitting application:', err.message);
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
};

// ============ ADMIN FUNCTIONS ============

// @desc    Get all PMI submissions (Admin)
// @route   GET /api/pmi/submissions
// @access  Private (Admin only)
exports.getAllSubmissions = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    // Filter by status (exclude draft)
    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: 'draft' };
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { pmiId: { $regex: search, $options: 'i' } },
        { nama: { $regex: search, $options: 'i' } },
        { 'asal.kecamatan': { $regex: search, $options: 'i' } },
        { 'asal.desa': { $regex: search, $options: 'i' } }
      ];
    }

    const submissions = await Pmi.find(query)
      .populate('user', 'username email profile')
      .populate('processedBy', 'username profile.fullName')
      .sort({ submittedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      count: submissions.length,
      submissions
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all PMI data (Admin)
// @route   GET /api/pmi
// @access  Private (Admin only)
exports.getAllPmi = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      query.$or = [
        { pmiId: { $regex: search, $options: 'i' } },
        { nama: { $regex: search, $options: 'i' } },
        { 'asal.kecamatan': { $regex: search, $options: 'i' } },
        { 'asal.desa': { $regex: search, $options: 'i' } },
        { negaraTujuan: { $regex: search, $options: 'i' } },
        { profesi: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const pmiData = await Pmi.find(query)
      .populate('user', 'username email profile')
      .populate('processedBy', 'username profile.fullName')
      .sort({ createdAt: -1 });

    res.json(pmiData);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get PMI by ID (Admin)
// @route   GET /api/pmi/:id
// @access  Private (Admin only)
exports.getPmiById = async (req, res) => {
  try {
    const pmi = await Pmi.findById(req.params.id)
      .populate('user', 'username email profile')
      .populate('processedBy', 'username profile.fullName')
      .populate('adminNotes.createdBy', 'username profile.fullName')
      .populate('statusHistory.changedBy', 'username profile.fullName');

    if (!pmi) {
      return res.status(404).json({ msg: 'Data PMI tidak ditemukan' });
    }

    res.json(pmi);

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Data PMI tidak ditemukan' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update PMI status (Admin)
// @route   PUT /api/pmi/:id/status
// @access  Private (Admin only)
exports.updatePmiStatus = async (req, res) => {
  try {
    const { status, note, rejectionReason, revisionNotes } = req.body;

    const pmi = await Pmi.findById(req.params.id);

    if (!pmi) {
      return res.status(404).json({ msg: 'Data PMI tidak ditemukan' });
    }

    // Set additional fields before updating status
    if (!pmi.processedBy && req.user.id !== 'admin_static_id') {
      pmi.processedBy = req.user.id;
    }

    if (status === 'rejected' && rejectionReason) {
      pmi.rejectionReason = rejectionReason;
    }

    if (status === 'need_revision' && revisionNotes) {
      pmi.revisionNotes = revisionNotes;
    }

    // Handle admin user specially for status update
    const changedById = req.user.id === 'admin_static_id' ? null : req.user.id;
    await pmi.updateStatus(status, changedById, note || '');

    res.json({
      success: true,
      msg: 'Status berhasil diupdate',
      pmi
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add admin note (Admin)
// @route   POST /api/pmi/:id/note
// @access  Private (Admin only)
exports.addAdminNote = async (req, res) => {
  try {
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ msg: 'Note tidak boleh kosong' });
    }

    const pmi = await Pmi.findById(req.params.id);

    if (!pmi) {
      return res.status(404).json({ msg: 'Data PMI tidak ditemukan' });
    }

    await pmi.addAdminNote(note, req.user.id);

    res.json({
      success: true,
      msg: 'Catatan berhasil ditambahkan',
      pmi
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete PMI (Admin)
// @route   DELETE /api/pmi/:id
// @access  Private (Admin only)
exports.deletePmi = async (req, res) => {
  try {
    const pmi = await Pmi.findById(req.params.id);

    if (!pmi) {
      return res.status(404).json({ msg: 'Data PMI tidak ditemukan' });
    }

    Object.values(pmi.dokumen).forEach(filePath => {
      if (filePath) {
        fs.unlink(path.join(__dirname, '..', filePath), (err) => {
          if (err) console.error('Failed to delete file:', filePath);
        });
      }
    });

    await User.findByIdAndUpdate(pmi.user, {
      pmiApplication: null
    });

    await pmi.deleteOne();

    res.json({ 
      success: true,
      msg: 'Data PMI berhasil dihapus' 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Download document
// @route   GET /api/pmi/download/:pmiId/:docField
// @access  Private
exports.downloadDocument = async (req, res) => {
  try {
    const pmi = await Pmi.findById(req.params.pmiId);
    
    if (!pmi) {
      return res.status(404).send('PMI not found.');
    }

    if (req.user.role !== 'admin' && pmi.user.toString() !== req.user.id) {
      return res.status(403).send('Unauthorized');
    }

    const docField = req.params.docField;
    const filePath = pmi.dokumen[docField];

    if (!filePath) {
      return res.status(404).send('Document not found.');
    }

    res.download(path.join(__dirname, '..', filePath));

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// @desc    View document in browser
// @route   GET /api/pmi/view/:pmiId/:docField
// @access  Private
exports.viewDocument = async (req, res) => {
  try {
    const pmi = await Pmi.findById(req.params.pmiId);
    
    if (!pmi) {
      return res.status(404).send('PMI not found.');
    }

    if (req.user.role !== 'admin' && pmi.user.toString() !== req.user.id) {
      return res.status(403).send('Unauthorized');
    }

    const docField = req.params.docField;
    const filePath = pmi.dokumen[docField];

    if (!filePath) {
      return res.status(404).send('Document not found.');
    }

    const absolutePath = path.join(__dirname, '..', filePath);
    
    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).send('File not found.');
    }

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch(ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
    }

    // Set headers to display in browser instead of downloading
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    
    // Send file
    res.sendFile(absolutePath);

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// ============ STATISTICS (untuk Admin) ============

const createDateMatchStage = (req) => {
  const { startDate, endDate } = req.query;
  let matchStage = {};
  
  if (startDate && endDate) {
    const endOfDay = new Date(endDate);
    endOfDay.setDate(endOfDay.getDate() + 1);
    
    matchStage = {
      waktuBerangkat: {
        $gte: new Date(startDate),
        $lt: endOfDay
      }
    };
  }
  
  return matchStage;
};

exports.getStatsJumlahPmi = async (req, res) => {
  try {
    const matchStage = createDateMatchStage(req);
    const count = await Pmi.countDocuments(matchStage);
    res.json({ jumlahPmiRembang: count });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getStatsAsal = async (req, res) => {
  try {
    const matchStage = createDateMatchStage(req);
    const asalData = await Pmi.aggregate([
      { $match: matchStage },
      { $group: { _id: "$asal.kecamatan", jumlah: { $sum: 1 } } },
      { $project: { kecamatan: "$_id", jumlah: 1, _id: 0 } },
      { $sort: { kecamatan: 1 } }
    ]);
    res.json(asalData);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getStatsAsalDesaByKecamatan = async (req, res) => {
  const { kecamatan } = req.params;
  try {
    const matchStageWithDate = createDateMatchStage(req);
    const finalMatchStage = {
      ...matchStageWithDate,
      "asal.kecamatan": kecamatan
    };
    
    const desaData = await Pmi.aggregate([
      { $match: finalMatchStage },
      { $group: { _id: "$asal.desa", jumlah: { $sum: 1 } } },
      { $project: { desa: "$_id", jumlah: 1, _id: 0 } },
      { $sort: { desa: 1 } }
    ]);
    res.json(desaData);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getStatsJenisKelamin = async (req, res) => {
  try {
    const matchStage = createDateMatchStage(req);
    const jenisKelaminData = await Pmi.aggregate([
      { $match: matchStage },
      { $group: { _id: "$jenisKelamin", jumlah: { $sum: 1 } } },
      { $project: { jenisKelamin: "$_id", jumlah: 1, _id: 0 } }
    ]);
    res.json(jenisKelaminData);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getStatsNegaraTujuan = async (req, res) => {
  try {
    const matchStage = createDateMatchStage(req);
    const negaraTujuanData = await Pmi.aggregate([
      { $match: matchStage },
      { $group: { _id: "$negaraTujuan", jumlah: { $sum: 1 } } },
      { $project: { negara: "$_id", jumlah: 1, _id: 0 } },
      { $sort: { jumlah: -1 } }
    ]);
    res.json(negaraTujuanData);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getStatsProfesi = async (req, res) => {
  try {
    const matchStage = createDateMatchStage(req);
    const profesiData = await Pmi.aggregate([
      { $match: matchStage },
      { $group: { _id: "$profesi", jumlah: { $sum: 1 } } },
      { $project: { profesi: "$_id", jumlah: 1, _id: 0 } },
      { $sort: { jumlah: -1 } }
    ]);
    res.json(profesiData);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getStatsByStatus = async (req, res) => {
  try {
    const statusData = await Pmi.aggregate([
      { $group: { _id: "$status", jumlah: { $sum: 1 } } },
      { $project: { status: "$_id", jumlah: 1, _id: 0 } }
    ]);
    res.json(statusData);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get PMI statistics by year
// @route   GET /api/pmi/stats/yearly
// @access  Private (Admin only)
exports.getStatsYearly = async (req, res) => {
  try {
    const yearlyData = await Pmi.aggregate([
      {
        $group: {
          _id: { $year: "$waktuBerangkat" },
          jumlah: { $sum: 1 }
        }
      },
      {
        $project: {
          tahun: "$_id",
          jumlah: 1,
          _id: 0
        }
      },
      { $sort: { tahun: 1 } }
    ]);
    
    res.json(yearlyData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};