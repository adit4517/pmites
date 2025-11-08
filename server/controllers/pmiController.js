const Pmi = require('../models/Pmi');
const Counter = require('../models/Counter'); // <-- IMPORT MODEL COUNTER BARU
const multer = require('multer'); // Untuk handle file upload
const path = require('path');
const fs = require('fs'); // Impor module 'fs' untuk menghapus file


// Konfigurasi Multer untuk penyimpanan file
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
    checkFileType(file, cb);
  }
}).fields([
  { name: 'suratPerjanjian', maxCount: 1 },
  { name: 'rekomendasiPaspor', maxCount: 1 },
  { name: 'izinPerekrutan', maxCount: 1 }, // <--- PASTIKAN INI ADA DAN SESUAI
  { name: 'tugasPendampingan', maxCount: 1 },
  { name: 'ktpPmi', maxCount: 1 },
  { name: 'kk', maxCount: 1 },
  { name: 'akta', maxCount: 1 },
  { name: 'bukuNikah', maxCount: 1 },
  { name: 'ijazah', maxCount: 1 },
  { name: 'izinKeluarga', maxCount: 1 },
  { name: 'sertifikatKeterampilan', maxCount: 1 },
  { name: 'dokumenLainnya', maxCount: 1 }
  // Pastikan semua field dokumen lainnya juga tercantum di sini
]);

function checkFileType(file, cb) {
  // Tipe file yang diizinkan (contoh: pdf, jpg, png)
  const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images, PDFs, or Word Documents Only!');
  }
}


exports.createPmi = async (req, res) => {
  // Kita akan proses upload file terlebih dahulu
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ msg: err });
    }

    try {
      // 1. Dapatkan nomor urut berikutnya secara atomik
      const counterDoc = await Counter.findOneAndUpdate(
        { _id: 'pmiId' },            // Cari counter dengan ID 'pmiId'
        { $inc: { seq: 1 } },        // Tambah (increment) nilainya sebesar 1
        { new: true, upsert: true }  // Opsi: kembalikan dokumen baru & buat jika belum ada
      );

      // 2. Format ID PMI
      const pmiId = 'PMI' + String(counterDoc.seq).padStart(3, '0');

      // 3. Siapkan data dokumen
      const { nama, asalKecamatan, asalDesa, jenisKelamin, negaraTujuan, profesi, waktuBerangkat } = req.body;
      const dokumen = {};
      if (req.files) {
        for (const key in req.files) {
          if (req.files[key] && req.files[key][0]) {
            dokumen[key] = req.files[key][0].path;
          }
        }
      }

      // 4. Buat instance PMI baru dengan ID yang sudah kita buat
      const newPmi = new Pmi({
        pmiId: pmiId, // <-- Set ID yang sudah diformat
        nama,
        asal: { kecamatan: asalKecamatan, desa: asalDesa },
        jenisKelamin,
        negaraTujuan,
        profesi,
        waktuBerangkat,
        dokumen,
        user: req.user ? req.user.id : null // Jika menggunakan authMiddleware
      });

      // 5. Simpan ke database
      const pmi = await newPmi.save();
      res.json({ msg: 'Input data PMI berhasil', pmi });

    } catch (err) {
      console.error('Error saat membuat PMI:', err.message);
      res.status(500).send('Server Error');
    }
  });
};

exports.getAllPmi = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // UBAH KONDISI IF INI
    
    if (search && search.trim() !== '') {
      // Hanya buat query pencarian jika 'search' tidak kosong
      query = {
        $or: [
          { pmiId: { $regex: search, $options: 'i' } },
          { nama: { $regex: search, $options: 'i' } },
          { 'asal.kecamatan': { $regex: search, $options: 'i' } },
          { 'asal.desa': { $regex: search, $options: 'i' } },
          { negaraTujuan: { $regex: search, $options: 'i' } },
          { profesi: { $regex: search, $options: 'i' } },
        ],
      };
    }
    
    const pmiData = await Pmi.find(query).sort({ createdAt: -1 }); // Urutkan dari yg terbaru
    // TAMBAHKAN BARIS INI UNTUK DEBUGGING
    console.log(`[Backend] Menemukan ${pmiData.length} data PMI. Mengirim ke frontend...`);
    // Anda juga bisa melihat isinya jika perlu: console.log(pmiData);
    res.json(pmiData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getPmiById = async (req, res) => {
  try {
    const pmi = await Pmi.findById(req.params.id);
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

exports.deletePmi = async (req, res) => {
    try {
        const pmi = await Pmi.findById(req.params.id);
        if (!pmi) {
            return res.status(404).json({ msg: 'Data PMI tidak ditemukan' });
        }
        // Hapus juga file fisik jika perlu (gunakan fs.unlink)
        // ...
        await pmi.deleteOne(); // atau pmi.remove() tergantung versi mongoose
        res.json({ msg: 'Data PMI berhasil dihapus' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Endpoint untuk download file (contoh sederhana)
exports.downloadDocument = async (req, res) => {
  try {
    const pmi = await Pmi.findById(req.params.pmiId);
    if (!pmi) return res.status(404).send('PMI not found.');

    const docField = req.params.docField; // e.g., 'suratPerjanjian'
    const filePath = pmi.dokumen[docField];

    if (!filePath) return res.status(404).send('Document not found.');

    res.download(path.join(__dirname, '..', filePath)); // Path relatif dari server.js
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Helper function untuk membuat match stage berdasarkan tanggal
const createDateMatchStage = (req) => {
  const { startDate, endDate } = req.query;
  let matchStage = {};
  if (startDate && endDate) {
      // Tambahkan 1 hari ke endDate agar inklusif sampai akhir hari
      const endOfDay = new Date(endDate);
      endOfDay.setDate(endOfDay.getDate() + 1);

      matchStage = {
          waktuBerangkat: {
              $gte: new Date(startDate),
              $lt: endOfDay // Gunakan $lt (less than) untuk mencakup seluruh hari endDate
          }
      };
  }
  return matchStage;
};

// --- Statistik Dashboard (Contoh) ---
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
          { $match: matchStage }, // Tambahkan match stage
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
  const { kecamatan } = req.params; // Ambil nama kecamatan dari parameter URL
  try {
      const matchStageWithDate = createDateMatchStage(req); // Terapkan filter tanggal global
      
      // Gabungkan matchStage untuk tanggal dengan matchStage untuk kecamatan
      const finalMatchStage = {
          ...matchStageWithDate, // Filter tanggal
          "asal.kecamatan": kecamatan // Filter spesifik untuk kecamatan ini
      };

      const desaData = await Pmi.aggregate([
          { $match: finalMatchStage }, // Gunakan finalMatchStage
          { $group: { _id: "$asal.desa", jumlah: { $sum: 1 } } },
          { $project: { desa: "$_id", jumlah: 1, _id: 0 } },
          { $sort: { desa: 1 } }
      ]);
      res.json(desaData);
  } catch (err) {
      console.error(`Error fetching desa data for ${kecamatan}:`, err.message);
      res.status(500).json({ msg: 'Server error' });
  }
};

exports.getStatsJenisKelamin = async (req, res) => {
  try {
      const matchStage = createDateMatchStage(req);
      const jenisKelaminData = await Pmi.aggregate([
          { $match: matchStage }, // Tambahkan match stage
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
          { $match: matchStage }, // Tambahkan match stage
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
      // Fungsi ini sudah memiliki filter tanggal, jadi kita pastikan saja sudah benar
      const matchStage = createDateMatchStage(req);
      const profesiData = await Pmi.aggregate([
          { $match: matchStage },
          { $group: { _id: "$profesi", jumlah: { $sum: 1 } } },
          { $project: { profesi: "$_id", jumlah: 1, _id: 0 } }
      ]);
      res.json(profesiData);
  } catch (err) {
      res.status(500).json({ msg: 'Server error' });
  }
};

// --- FUNGSI BARU: updatePmi ---
exports.updatePmi = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    try {
      const pmi = await Pmi.findById(req.params.id);
      if (!pmi) {
        return res.status(404).json({ msg: 'Data PMI tidak ditemukan' });
      }

      // Update text fields
      const { nama, asalKecamatan, asalDesa, jenisKelamin, negaraTujuan, profesi, waktuBerangkat, documentsToDelete } = req.body;
      if (nama) pmi.nama = nama;
      if (asalKecamatan && asalDesa) pmi.asal = { kecamatan: asalKecamatan, desa: asalDesa };
      if (jenisKelamin) pmi.jenisKelamin = jenisKelamin;
      if (negaraTujuan) pmi.negaraTujuan = negaraTujuan;
      if (profesi) pmi.profesi = profesi;
      if (waktuBerangkat) pmi.waktuBerangkat = waktuBerangkat;

      // Handle file deletion
      if (documentsToDelete) {
        const docsToDeleteArray = JSON.parse(documentsToDelete); // Expecting a JSON string array like '["ktpPmi", "kk"]'
        docsToDeleteArray.forEach(docField => {
          if (pmi.dokumen[docField]) {
            // Hapus file dari server
            fs.unlink(path.join(__dirname, '..', pmi.dokumen[docField]), (unlinkErr) => {
              if (unlinkErr) console.error(`Failed to delete old file: ${pmi.dokumen[docField]}`, unlinkErr);
            });
            // Hapus path dari database
            pmi.dokumen[docField] = undefined;
          }
        });
      }

      // Handle new/updated files
      if (req.files) {
        for (const key in req.files) {
          if (req.files[key] && req.files[key][0]) {
            // Jika sudah ada file lama, hapus dulu
            if (pmi.dokumen[key]) {
              fs.unlink(path.join(__dirname, '..', pmi.dokumen[key]), (unlinkErr) => {
                 if (unlinkErr) console.error(`Failed to delete old file before update: ${pmi.dokumen[key]}`, unlinkErr);
              });
            }
            // Simpan path file baru
            pmi.dokumen[key] = req.files[key][0].path;
          }
        }
      }
      // Tandai field dokumen sebagai termodifikasi agar tersimpan
      pmi.markModified('dokumen');
      await pmi.save();
      res.json({ msg: 'Data PMI berhasil diperbarui', pmi });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
};