// File: client/src/pages/user/ApplicationForm.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { rembangData } from '../../data/rembangData';
import axios from 'axios';

const ApplicationForm = () => {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: '',
    asalKecamatan: '',
    asalDesa: '',
    jenisKelamin: 'Laki-laki',
    negaraTujuan: '',
    profesi: '',
    waktuBerangkat: '',
    pendidikanTerakhir: 'SMA/SMK',
    pengalamanKerja: '',
    keterampilan: ''
  });

  const [fileFields, setFileFields] = useState({
    ktpPmi: null,
    kk: null,
    akta: null,
    ijazah: null,
    izinKeluarga: null,
    pasFoto: null,
    skck: null,
    suratSehatJasmani: null,
    suratSehatRohani: null,
    bukuNikah: null,
    sertifikatKeterampilan: null,
    dokumenLainnya: null
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const documentFields = [
    { name: 'ktpPmi', label: 'KTP PMI', required: true },
    { name: 'kk', label: 'Kartu Keluarga', required: true },
    { name: 'akta', label: 'Akta Kelahiran', required: true },
    { name: 'ijazah', label: 'Ijazah Terakhir', required: true },
    { name: 'izinKeluarga', label: 'Surat Izin Keluarga', required: true },
    { name: 'pasFoto', label: 'Pas Foto (4x6)', required: true },
    { name: 'skck', label: 'SKCK', required: false },
    { name: 'suratSehatJasmani', label: 'Surat Sehat Jasmani', required: false },
    { name: 'suratSehatRohani', label: 'Surat Sehat Rohani', required: false },
    { name: 'bukuNikah', label: 'Buku Nikah (jika menikah)', required: false },
    { name: 'sertifikatKeterampilan', label: 'Sertifikat Keterampilan', required: false },
    { name: 'dokumenLainnya', label: 'Dokumen Lainnya', required: false }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'asalKecamatan') {
        return { ...prev, asalKecamatan: value, asalDesa: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e) => {
    setFileFields({ ...fileFields, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataPayload = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        dataPayload.append(key, formData[key]);
      });
      
      // Append files
      Object.keys(fileFields).forEach(key => {
        if (fileFields[key]) {
          dataPayload.append(key, fileFields[key]);
        }
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${state.token}`
        }
      };

      await axios.post('http://localhost:5000/api/pmi/application', dataPayload, config);

      setNotification({
        show: true,
        type: 'success',
        message: 'Aplikasi berhasil dibuat! Mengalihkan ke dashboard...'
      });

      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error creating application:', err);
      const errorMsg = err.response?.data?.msg || 'Terjadi kesalahan. Silakan coba lagi.';
      
      setNotification({
        show: true,
        type: 'error',
        message: errorMsg
      });

      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset form?')) {
      setFormData({
        nama: '',
        asalKecamatan: '',
        asalDesa: '',
        jenisKelamin: 'Laki-laki',
        negaraTujuan: '',
        profesi: '',
        waktuBerangkat: '',
        pendidikanTerakhir: 'SMA/SMK',
        pengalamanKerja: '',
        keterampilan: ''
      });
      setFileFields({
        ktpPmi: null,
        kk: null,
        akta: null,
        ijazah: null,
        izinKeluarga: null,
        pasFoto: null,
        skck: null,
        suratSehatJasmani: null,
        suratSehatRohani: null,
        bukuNikah: null,
        sertifikatKeterampilan: null,
        dokumenLainnya: null
      });
      document.getElementById('applicationForm').reset();
    }
  };

  return (
    <div>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button onClick={() => setNotification({ show: false, type: '', message: '' })}>
            &times;
          </button>
        </div>
      )}

      <h1>Buat Aplikasi PMI</h1>
      <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
        Lengkapi formulir di bawah ini untuk membuat aplikasi menjadi Pekerja Migran Indonesia.
        <br />
        <small>
          <span style={{ color: 'red' }}>*</span> Dokumen yang wajib diupload
        </small>
      </p>

      <form onSubmit={handleSubmit} onReset={handleReset} className="pmi-form" id="applicationForm">
        {/* Data Diri PMI */}
        <div className="form-section">
          <h4>Data Diri PMI</h4>
          
          <div className="form-group">
            <label htmlFor="nama">Nama Lengkap</label>
            <input 
              type="text" 
              name="nama" 
              id="nama" 
              value={formData.nama} 
              onChange={handleFormChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="asalKecamatan">Asal Kecamatan</label>
            <select
              name="asalKecamatan"
              id="asalKecamatan"
              value={formData.asalKecamatan}
              onChange={handleFormChange}
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
              onChange={handleFormChange}
              required
              disabled={!formData.asalKecamatan}
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
                <input 
                  type="radio" 
                  name="jenisKelamin" 
                  value="Laki-laki" 
                  checked={formData.jenisKelamin === 'Laki-laki'} 
                  onChange={handleFormChange} 
                /> 
                Laki-laki
              </label>
              <label>
                <input 
                  type="radio" 
                  name="jenisKelamin" 
                  value="Perempuan" 
                  checked={formData.jenisKelamin === 'Perempuan'} 
                  onChange={handleFormChange} 
                /> 
                Perempuan
              </label>
            </div>
          </div>
        </div>

        {/* Data Keberangkatan */}
        <div className="form-section">
          <h4>Data Keberangkatan</h4>
          
          <div className="form-group">
            <label htmlFor="negaraTujuan">Negara Tujuan</label>
            <input 
              type="text" 
              name="negaraTujuan" 
              id="negaraTujuan" 
              value={formData.negaraTujuan} 
              onChange={handleFormChange} 
              placeholder="Contoh: Malaysia, Singapura, Hong Kong"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="profesi">Profesi / Pekerjaan</label>
            <input 
              type="text" 
              name="profesi" 
              id="profesi" 
              value={formData.profesi} 
              onChange={handleFormChange} 
              placeholder="Contoh: Perawat, Buruh Pabrik, Pelayan"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="waktuBerangkat">Rencana Waktu Berangkat</label>
            <input 
              type="date" 
              name="waktuBerangkat" 
              id="waktuBerangkat" 
              value={formData.waktuBerangkat} 
              onChange={handleFormChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="pendidikanTerakhir">Pendidikan Terakhir</label>
            <select
              name="pendidikanTerakhir"
              id="pendidikanTerakhir"
              value={formData.pendidikanTerakhir}
              onChange={handleFormChange}
              required
            >
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pengalamanKerja">Pengalaman Kerja (opsional)</label>
            <textarea
              name="pengalamanKerja"
              id="pengalamanKerja"
              value={formData.pengalamanKerja}
              onChange={handleFormChange}
              rows={3}
              placeholder="Tuliskan pengalaman kerja Anda jika ada..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="keterampilan">Keterampilan (pisahkan dengan koma)</label>
            <input
              type="text"
              name="keterampilan"
              id="keterampilan"
              value={formData.keterampilan}
              onChange={handleFormChange}
              placeholder="Contoh: Memasak, Menjahit, Mengemudi, Bahasa Inggris"
            />
            <small style={{ color: 'var(--text-light)' }}>
              Pisahkan dengan koma jika lebih dari satu keterampilan
            </small>
          </div>
        </div>

        {/* Dokumen Pendukung */}
        <div className="form-section">
          <h4>Dokumen Pendukung</h4>
          <p style={{ fontSize: '0.9em', color: 'var(--text-secondary)', marginBottom: '15px' }}>
            Upload dokumen dalam format PDF, JPG, atau PNG (maksimal 5MB per file)
          </p>
          
          {documentFields.map(field => (
            <div className="form-group" key={field.name}>
              <label htmlFor={field.name}>
                {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
              </label>
              <input 
                type="file" 
                name={field.name} 
                id={field.name} 
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required={field.required}
              />
              {fileFields[field.name] && (
                <small style={{ color: 'var(--success-color)' }}>
                  File terpilih: {fileFields[field.name].name}
                </small>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Sebagai Draft'}
          </button>
          <button type="button" className="reset-btn" onClick={handleReset}>
            Reset Form
          </button>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '0.9em', color: 'var(--text-secondary)' }}>
            💡 <strong>Info:</strong> Aplikasi akan tersimpan sebagai draft. 
            Anda dapat melanjutkan pengisian nanti atau langsung submit untuk direview oleh admin.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;