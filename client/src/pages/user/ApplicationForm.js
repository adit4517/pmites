// File: client/src/pages/user/ApplicationForm.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { rembangData } from '../../data/rembangData';
import { countriesData, profesiData } from '../../data/countriesData';
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
    benua: '',
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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
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
      if (name === 'benua') {
        return { ...prev, benua: value, negaraTujuan: '' };
      }
      return { ...prev, [name]: value };
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file && file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: 'Ukuran file maksimal 5MB'
      }));
      e.target.value = '';
      return;
    }

    setFileFields({ ...fileFields, [e.target.name]: file });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) newErrors.nama = 'Nama harus diisi';
    if (!formData.asalKecamatan) newErrors.asalKecamatan = 'Kecamatan harus dipilih';
    if (!formData.asalDesa) newErrors.asalDesa = 'Desa harus dipilih';
    if (!formData.benua) newErrors.benua = 'Benua harus dipilih';
    if (!formData.negaraTujuan) newErrors.negaraTujuan = 'Negara tujuan harus dipilih';
    if (!formData.profesi) newErrors.profesi = 'Profesi harus dipilih';
    if (!formData.waktuBerangkat) newErrors.waktuBerangkat = 'Tanggal berangkat harus diisi';

    // Validasi dokumen wajib
    documentFields.forEach(field => {
      if (field.required && !fileFields[field.name]) {
        newErrors[field.name] = `${field.label} harus diupload`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    documentFields.forEach(field => {
      if (field.required) {
        allTouched[field.name] = true;
      }
    });
    setTouched(allTouched);

    if (!validateForm()) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Mohon lengkapi semua field yang wajib diisi'
      });
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
      return;
    }

    setLoading(true);

    try {
      const dataPayload = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key !== 'benua') { // Jangan kirim benua ke backend
          dataPayload.append(key, formData[key]);
        }
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
        benua: '',
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
      setErrors({});
      setTouched({});
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
          <span style={{ color: 'red' }}>*</span> Field yang wajib diisi
        </small>
      </p>

      <form onSubmit={handleSubmit} onReset={handleReset} className="pmi-form" id="applicationForm">
        {/* Data Diri PMI */}
        <div className="form-section">
          <h4>Data Diri PMI</h4>
          
          <div className="form-group">
            <label htmlFor="nama">Nama Lengkap <span style={{color: 'red'}}>*</span></label>
            <input 
              type="text" 
              name="nama" 
              id="nama" 
              value={formData.nama} 
              onChange={handleFormChange}
              onBlur={handleBlur}
              className={touched.nama && errors.nama ? 'error' : ''}
            />
            {touched.nama && errors.nama && (
              <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                {errors.nama}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="asalKecamatan">Asal Kecamatan <span style={{color: 'red'}}>*</span></label>
            <select
              name="asalKecamatan"
              id="asalKecamatan"
              value={formData.asalKecamatan}
              onChange={handleFormChange}
              onBlur={handleBlur}
              className={touched.asalKecamatan && errors.asalKecamatan ? 'error' : ''}
            >
              <option value="">-- Pilih Kecamatan --</option>
              {Object.keys(rembangData).map(kecamatan => (
                <option key={kecamatan} value={kecamatan}>{kecamatan}</option>
              ))}
            </select>
            {touched.asalKecamatan && errors.asalKecamatan && (
              <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                {errors.asalKecamatan}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="asalDesa">Asal Desa <span style={{color: 'red'}}>*</span></label>
            <select
              name="asalDesa"
              id="asalDesa"
              value={formData.asalDesa}
              onChange={handleFormChange}
              onBlur={handleBlur}
              disabled={!formData.asalKecamatan}
              className={touched.asalDesa && errors.asalDesa ? 'error' : ''}
            >
              <option value="">-- Pilih Desa --</option>
              {formData.asalKecamatan && rembangData[formData.asalKecamatan].map(desa => (
                <option key={desa} value={desa}>{desa}</option>
              ))}
            </select>
            {touched.asalDesa && errors.asalDesa && (
              <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                {errors.asalDesa}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Jenis Kelamin <span style={{color: 'red'}}>*</span></label>
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
            <label htmlFor="benua">Benua Tujuan <span style={{color: 'red'}}>*</span></label>
            <select
              name="benua"
              id="benua"
              value={formData.benua}
              onChange={handleFormChange}
              onBlur={handleBlur}
              className={touched.benua && errors.benua ? 'error' : ''}
            >
              <option value="">-- Pilih Benua --</option>
              {Object.keys(countriesData).map(benua => (
                <option key={benua} value={benua}>{benua}</option>
              ))}
            </select>
            {touched.benua && errors.benua && (
              <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                {errors.benua}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="negaraTujuan">Negara Tujuan <span style={{color: 'red'}}>*</span></label>
            <select
              name="negaraTujuan"
              id="negaraTujuan"
              value={formData.negaraTujuan}
              onChange={handleFormChange}
              onBlur={handleBlur}
              disabled={!formData.benua}
              className={touched.negaraTujuan && errors.negaraTujuan ? 'error' : ''}
            >
              <option value="">-- Pilih Negara --</option>
              {formData.benua && countriesData[formData.benua].map(negara => (
                <option key={negara} value={negara}>{negara}</option>
              ))}
            </select>
            {touched.negaraTujuan && errors.negaraTujuan && (
              <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                {errors.negaraTujuan}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="profesi">Profesi / Pekerjaan <span style={{color: 'red'}}>*</span></label>
            <select
              name="profesi"
              id="profesi"
              value={formData.profesi}
              onChange={handleFormChange}
              onBlur={handleBlur}
              className={touched.profesi && errors.profesi ? 'error' : ''}
            >
              <option value="">-- Pilih Profesi --</option>
              {profesiData.map(profesi => (
                <option key={profesi} value={profesi}>{profesi}</option>
              ))}
            </select>
            {touched.profesi && errors.profesi && (
              <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                {errors.profesi}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="waktuBerangkat">Rencana Waktu Berangkat <span style={{color: 'red'}}>*</span></label>
            <input 
              type="date" 
              name="waktuBerangkat" 
              id="waktuBerangkat" 
              value={formData.waktuBerangkat} 
              onChange={handleFormChange}
              onBlur={handleBlur}
              className={touched.waktuBerangkat && errors.waktuBerangkat ? 'error' : ''}
            />
            {touched.waktuBerangkat && errors.waktuBerangkat && (
              <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                {errors.waktuBerangkat}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="pendidikanTerakhir">Pendidikan Terakhir <span style={{color: 'red'}}>*</span></label>
            <select
              name="pendidikanTerakhir"
              id="pendidikanTerakhir"
              value={formData.pendidikanTerakhir}
              onChange={handleFormChange}
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
                className={touched[field.name] && errors[field.name] ? 'error' : ''}
              />
              {fileFields[field.name] && (
                <small style={{ color: 'var(--success-color)' }}>
                  File terpilih: {fileFields[field.name].name}
                </small>
              )}
              {touched[field.name] && errors[field.name] && (
                <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                  {errors[field.name]}
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