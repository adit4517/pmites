import React from 'react';
import { rembangData } from '../../data/rembangData'; // Impor data kecamatan/desa


const PmiForm = ({ formData, fileFields, onFormChange, onFileChange, onSubmit, onReset, formId, props = "pmiForm" }) => {
  // Array of document field names for easier mapping
  const documentFields = [
    { name: 'suratPerjanjian', label: 'Surat Perjanjian Antara PMI dan Perusahaan Penyalur' },
    { name: 'rekomendasiPaspor', label: 'Surat Rekomendasi Pembuatan Paspor' },
    { name: 'izinPerekrutan', label: 'Surat Izin Perekrutan PMI' },
    { name: 'tugasPendampingan', label: 'Surat Tugas Pendampingan PMI' },
    { name: 'ktpPmi', label: 'KTP PMI' },
    { name: 'kk', label: 'Kartu Keluarga' },
    { name: 'akta', label: 'Akta Kelahiran/Surat Kenal Lahir' },
    { name: 'bukuNikah', label: 'Buku Nikah (jika menikah)' },
    { name: 'ijazah', label: 'Ijazah Terakhir' },
    { name: 'izinKeluarga', label: 'Surat Keterangan Izin Istri/Suami/Orang Tua/Wali' },
    { name: 'sertifikatKeterampilan', label: 'Sertifikat Keterampilan (jika ada)' },
    { name: 'dokumenLainnya', label: 'Dokumen Lainnya (jika ada)' },
  ];

  const handleKecamatanChange = (e) => {
    // Panggil onFormChange untuk kecamatan dan reset desa
    onFormChange({ target: { name: 'asalKecamatan', value: e.target.value } });
    onFormChange({ target: { name: 'asalDesa', value: '' } });
  };

  return (
    <form onSubmit={onSubmit} onReset={onReset} className="pmi-form" id={formId}>
      <div className="form-section">
        <h4>Data Diri PMI</h4>
        <div className="form-group">
          <label htmlFor="nama">Nama Lengkap</label>
          <input type="text" name="nama" id="nama" value={formData.nama} onChange={onFormChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="asalKecamatan">Asal Kecamatan</label>
          <select
          name="asalKecamatan"
          id="asalKecamatan"
          value={formData.asalKecamatan}
          onChange={handleKecamatanChange}
          required
        >
          <option value="">-- Pilih Kecamatan --</option>
          {Object.keys(rembangData).map(kecamatan => (
            <option key={kecamatan} value={kecamatan}>{kecamatan}</option>
          ))}
        </select>
        </div>
        <div className="form-group">
          <label htmlFor="asalDesa">Asal Desa</label>
          <select
          name="asalDesa"
          id="asalDesa"
          value={formData.asalDesa}
          onChange={onFormChange}
          required
          disabled={!formData.asalKecamatan} // Disable jika kecamatan belum dipilih
        >
          <option value="">-- Pilih Desa --</option>
          {formData.asalKecamatan && rembangData[formData.asalKecamatan].map(desa => (
            <option key={desa} value={desa}>{desa}</option>
          ))}
        </select>
        </div>

        <div className="form-group">
          <label>Jenis Kelamin</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="jenisKelamin" value="Laki-laki" checked={formData.jenisKelamin === 'Laki-laki'} onChange={onFormChange} /> Laki-laki
            </label>
            <label>
              <input type="radio" name="jenisKelamin" value="Perempuan" checked={formData.jenisKelamin === 'Perempuan'} onChange={onFormChange} /> Perempuan
            </label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Data Keberangkatan</h4>
        <div className="form-group">
          <label htmlFor="negaraTujuan">Negara Tujuan</label>
          <input type="text" name="negaraTujuan" id="negaraTujuan" value={formData.negaraTujuan} onChange={onFormChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="profesi">Profesi</label>
          <input type="text" name="profesi" id="profesi" value={formData.profesi} onChange={onFormChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="waktuBerangkat">Waktu Berangkat</label>
          <input type="date" name="waktuBerangkat" id="waktuBerangkat" value={formData.waktuBerangkat} onChange={onFormChange} required />
        </div>
      </div>

      <div className="form-section">
        <h4>Dokumen Pendukung</h4>
        {documentFields.map(field => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input type="file" name={field.name} id={field.name} onChange={onFileChange} />
            {/* Display selected file name (optional) */}
            {fileFields[field.name] && <small>File terpilih: {fileFields[field.name].name}</small>}
          </div>
        ))}
      </div>

      <div className="form-buttons">
        <button type="submit" className="submit-btn">Selesai & Simpan</button>
        <button type="reset" className="reset-btn">Batal</button>
      </div>

      {/* Pada form edit, mungkin perlu menampilkan dokumen yang sudah ada */}
      {props.isEditMode && (
        <div className="form-section">
            <h4>Hapus Dokumen Lama</h4>
            {/* Logic untuk menampilkan & menghapus dokumen lama */}
        </div>
      )}

      {/* ... (sisa form lainnya) ... */}
      
    </form>
  );
};

export default PmiForm;