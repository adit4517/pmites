// File: server/models/Pmi.js

const mongoose = require('mongoose');

// TIDAK PERLU LAGI 'mongoose-sequence'

const PmiSchema = new mongoose.Schema({
  // Kita hanya butuh field pmiId, yang akan kita isi dari controller
  pmiId: {
    type: String,
    unique: true
  },
  nama: { type: String, required: true },
  asal: {
    kecamatan: { type: String, required: true },
    desa: { type: String, required: true },
  },
  jenisKelamin: { type: String, enum: ['Laki-laki', 'Perempuan'], required: true },
  negaraTujuan: { type: String, required: true },
  profesi: { type: String, required: true },
  waktuBerangkat: { type: Date, required: true },
  dokumen: {
    suratPerjanjian: { type: String },
    rekomendasiPaspor: { type: String },
    izinPerekrutan: { type: String },
    tugasPendampingan: { type: String },
    ktpPmi: { type: String },
    kk: { type: String },
    akta: { type: String },
    bukuNikah: { type: String },
    ijazah: { type: String },
    izinKeluarga: { type: String },
    sertifikatKeterampilan: { type: String },
    dokumenLainnya: { type: String },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// HAPUS SEMUA .plugin() DAN .pre('save') hook dari sini

module.exports = mongoose.model('Pmi', PmiSchema);