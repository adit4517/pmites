// File: server/models/Pmi.js

const mongoose = require('mongoose');

const PmiSchema = new mongoose.Schema({
  // ID PMI (auto-generated)
  pmiId: {
    type: String,
    unique: true
  },
  
  // Referensi ke User yang mengajukan
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Data Diri PMI
  nama: { 
    type: String, 
    required: true 
  },
  
  asal: {
    kecamatan: { 
      type: String, 
      required: true 
    },
    desa: { 
      type: String, 
      required: true 
    },
  },
  
  jenisKelamin: { 
    type: String, 
    enum: ['Laki-laki', 'Perempuan'], 
    required: true 
  },
  
  // Data Keberangkatan
  negaraTujuan: { 
    type: String, 
    required: true 
  },
  
  profesi: { 
    type: String, 
    required: true 
  },
  
  waktuBerangkat: { 
    type: Date, 
    required: true 
  },
  
  // Informasi Tambahan
  pendidikanTerakhir: {
    type: String,
    enum: ['SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2', 'S3'],
    required: true
  },
  
  pengalamanKerja: {
    type: String,
    default: null
  },
  
  keterampilan: [{
    type: String
  }],
  
  // Status Aplikasi
  status: {
    type: String,
    enum: [
      'draft',           // Baru dibuat, belum submit
      'submitted',       // Sudah disubmit, menunggu review
      'under_review',    // Sedang direview admin
      'need_revision',   // Perlu revisi/perbaikan dokumen
      'approved',        // Disetujui admin
      'rejected',        // Ditolak
      'processing',      // Dalam proses keberangkatan
      'departed',        // Sudah berangkat
      'returned'         // Sudah pulang
    ],
    default: 'draft'
  },
  
  // Catatan dari Admin
  adminNotes: [{
    note: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Alasan jika ditolak atau perlu revisi
  rejectionReason: {
    type: String,
    default: null
  },
  
  revisionNotes: {
    type: String,
    default: null
  },
  
  // Dokumen Pendukung
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
    
    // Dokumen tambahan yang bisa diupload user
    pasFoto: { type: String },
    skck: { type: String },
    suratSehatJasmani: { type: String },
    suratSehatRohani: { type: String }
  },
  
  // Tracking perubahan status
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    note: String,
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tanggal-tanggal penting
  submittedAt: {
    type: Date,
    default: null
  },
  
  approvedAt: {
    type: Date,
    default: null
  },
  
  rejectedAt: {
    type: Date,
    default: null
  },
  
  departureDate: {
    type: Date,
    default: null
  },
  
  returnDate: {
    type: Date,
    default: null
  },
  
  // Admin yang memproses
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
  
}, { timestamps: true });

// Index untuk pencarian
PmiSchema.index({ nama: 'text', pmiId: 'text' });
PmiSchema.index({ status: 1 });
PmiSchema.index({ user: 1 });
PmiSchema.index({ 'asal.kecamatan': 1, 'asal.desa': 1 });

// Method untuk update status dengan tracking
PmiSchema.methods.updateStatus = function(newStatus, changedBy, note = '') {
  this.status = newStatus;
  
  // Tambahkan ke history
  this.statusHistory.push({
    status: newStatus,
    changedBy: changedBy,
    note: note,
    changedAt: new Date()
  });
  
  // Update tanggal sesuai status
  switch(newStatus) {
    case 'submitted':
      this.submittedAt = new Date();
      break;
    case 'approved':
      this.approvedAt = new Date();
      break;
    case 'rejected':
      this.rejectedAt = new Date();
      break;
    case 'departed':
      this.departureDate = new Date();
      break;
    case 'returned':
      this.returnDate = new Date();
      break;
  }
  
  return this.save();
};

// Method untuk add admin note
PmiSchema.methods.addAdminNote = function(note, adminId) {
  this.adminNotes.push({
    note: note,
    createdBy: adminId,
    createdAt: new Date()
  });
  
  return this.save();
};

// Virtual untuk cek kelengkapan dokumen
PmiSchema.virtual('documentCompleteness').get(function() {
  const requiredDocs = [
    'ktpPmi', 
    'kk', 
    'akta', 
    'ijazah', 
    'izinKeluarga',
    'pasFoto'
  ];
  
  let completed = 0;
  requiredDocs.forEach(doc => {
    if (this.dokumen[doc]) completed++;
  });
  
  return {
    total: requiredDocs.length,
    completed: completed,
    percentage: Math.round((completed / requiredDocs.length) * 100)
  };
});

// Virtual untuk status label yang lebih readable
PmiSchema.virtual('statusLabel').get(function() {
  const statusLabels = {
    'draft': 'Draft',
    'submitted': 'Menunggu Review',
    'under_review': 'Sedang Direview',
    'need_revision': 'Perlu Revisi',
    'approved': 'Disetujui',
    'rejected': 'Ditolak',
    'processing': 'Dalam Proses',
    'departed': 'Sudah Berangkat',
    'returned': 'Sudah Pulang'
  };
  
  return statusLabels[this.status] || this.status;
});

PmiSchema.set('toJSON', { virtuals: true });
PmiSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Pmi', PmiSchema);